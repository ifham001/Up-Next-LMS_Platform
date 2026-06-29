import { dbDrizzle } from "../../config/pg.db";
import { cartItems } from "../../schema/user/cart";
import { checkout } from "../../schema/user/checkout";
import { userCourses } from "../../schema/user/userCourses";
import { course } from "../../schema/admin/course";
import { eq, inArray } from "drizzle-orm";
import { evaluateCoupon, recordRedemption } from "../admin/coupon.queries";

type IPurchaseDetail = {
  name: string;
  userId: string;
  address: string;
  city: string;
  state: string;
  zip_code: number;
  pricePaid: number;
  payment_mode: "Card" | "UPI";
  purchased_courses: string[]; // ignored, using cart items
  couponCode?: string;
};

export const makePurchase = async (purchaseData: IPurchaseDetail) => {
  const { userId, couponCode, purchased_courses, ...purchaseInfo } = purchaseData;

  try {
    const now = new Date();

    const purchaseResult = await dbDrizzle.transaction(async (tx) => {
      // 1️⃣ Get all courses from the user's cart
      const userCartItems = await tx
        .select({ courseId: cartItems.courseId })
        .from(cartItems)
        .where(eq(cartItems.userId, userId));

      if (userCartItems.length === 0) {
        return null; // no purchase possible
      }

      const cartCourseIds = userCartItems.map((i) => i.courseId);

      // 2️⃣ Derive the authoritative cart total from the DB (not the client),
      //    so the price paid and any discount can't be tampered with.
      const priced = await tx
        .select({ id: course.id, price: course.price })
        .from(course)
        .where(inArray(course.id, cartCourseIds));
      const cartTotal = priced.reduce((sum, p) => sum + p.price, 0);

      // 3️⃣ Apply a coupon if provided (validated against the same cart).
      let discount = 0;
      let appliedCouponId: string | null = null;
      if (couponCode) {
        const evaln = await evaluateCoupon(tx, couponCode, userId, cartTotal, now, cartCourseIds);
        if (!evaln.valid) {
          return { error: evaln.reason } as const;
        }
        discount = evaln.discount;
        appliedCouponId = evaln.coupon.id;
      }

      const pricePaid = cartTotal - discount;

      // 4️⃣ Insert the checkout record with the server-computed price.
      const [purchaseRecord] = await tx
        .insert(checkout)
        .values({
          ...purchaseInfo,
          userId,
          pricePaid,
          paymentStatus: "completed",
          purchasedAt: now,
        })
        .returning();

      // 5️⃣ Record the coupon redemption (within the same transaction).
      if (appliedCouponId) {
        await recordRedemption(tx, appliedCouponId, userId, discount);
      }

      // 6️⃣ Enroll the user in the cart courses they don't already own.
      const alreadyOwned = await tx
        .select({ courseId: userCourses.courseId })
        .from(userCourses)
        .where(eq(userCourses.userId, userId));
      const ownedCourseIds = new Set(alreadyOwned.map((c) => c.courseId));

      const courseLinks = userCartItems
        .filter((item) => !ownedCourseIds.has(item.courseId))
        .map((item) => ({
          userId,
          courseId: item.courseId,
          purchasedAt: now,
        }));

      if (courseLinks.length > 0) {
        await tx.insert(userCourses).values(courseLinks);
      }

      return { record: purchaseRecord, pricePaid, discount } as const;
    });

    if (!purchaseResult) {
      return { success: false, message: "No items in cart to purchase." };
    }
    if ("error" in purchaseResult) {
      return { success: false, message: purchaseResult.error };
    }

    return {
      success: true,
      message: "Purchase completed successfully",
      orderId: purchaseResult.record.id,
      pricePaid: purchaseResult.pricePaid,
      discount: purchaseResult.discount,
    };
  } catch (error) {
    return { success: false, message: "Purchase failed" };
  }
};
