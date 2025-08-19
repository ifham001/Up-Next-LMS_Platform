import { dbDrizzle } from "../../config/pg.db";
import { cartItems } from "../../schema/user/cart";
import { checkout } from "../../schema/user/checkout";
import { userCourses } from "../../schema/user/userCourses";
import { eq } from "drizzle-orm";

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
};

export const makePurchase = async (purchaseData: IPurchaseDetail) => {
  const { userId, ...purchaseInfo } = purchaseData;

  try {
    const purchaseResult = await dbDrizzle.transaction(async (tx) => {
      // 1️⃣ Insert into checkout table
      const [purchaseRecord] = await tx
        .insert(checkout)
        .values({
          ...purchaseInfo,
          userId,
          paymentStatus: "completed",
          purchasedAt: new Date(),
        })
        .returning();

      // 2️⃣ Get all courses from the user's cart
      const userCartItems = await tx
        .select({ courseId: cartItems.courseId })
        .from(cartItems)
        .where(eq(cartItems.userId, userId));

      if (userCartItems.length === 0) {
        return null; // no purchase possible
      }

      // 3️⃣ Get already purchased courses
      const alreadyOwned = await tx
        .select({ courseId: userCourses.courseId })
        .from(userCourses)
        .where(eq(userCourses.userId, userId));

      const ownedCourseIds = new Set(alreadyOwned.map((c) => c.courseId));

      // 4️⃣ Filter out duplicates and prepare insert
      const courseLinks = userCartItems
        .filter((item) => !ownedCourseIds.has(item.courseId))
        .map((item) => ({
          userId,
          courseId: item.courseId,
          purchasedAt: new Date(),
          pricePaid: purchaseInfo.pricePaid,
          paymentStatus: "completed",
        }));

      // 5️⃣ Insert new courses into userCourses
      if (courseLinks.length > 0) {
        await tx.insert(userCourses).values(courseLinks);
      }

      // 6️⃣ Remove all purchased courses from the cart
    

      return purchaseRecord;
    });

    if (!purchaseResult) {
      return {
        success: false,
        message: "No items in cart to purchase.",
      };
    }

    return {
      success: true,
      message: "Purchase completed successfully",
      orderId: purchaseResult.id, // ✅ fixed: no [0]
    };
  } catch (error) {
   
    return {
      success: false,
      message: "Purchase failed",
    };
  }
};
