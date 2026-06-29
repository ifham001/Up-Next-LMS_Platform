import { and, eq, count, desc } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { coupon, couponRedemption } from "../../schema/admin/coupon";

type Tx = Parameters<Parameters<typeof dbDrizzle.transaction>[0]>[0];
type DbOrTx = typeof dbDrizzle | Tx;

export interface NewCoupon {
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  maxRedemptions?: number | null;
  perUserLimit?: number;
  courseId?: string | null;
  expiresAt?: Date | null;
}

const normalizeCode = (code: string) => code.trim().toUpperCase();

// --- Admin --------------------------------------------------------------

export const createCoupon = async (data: NewCoupon) => {
  const [created] = await dbDrizzle
    .insert(coupon)
    .values({
      code: normalizeCode(data.code),
      discountType: data.discountType,
      value: data.value,
      maxRedemptions: data.maxRedemptions ?? null,
      perUserLimit: data.perUserLimit ?? 1,
      courseId: data.courseId ?? null,
      expiresAt: data.expiresAt ?? null,
    })
    .returning();
  return created;
};

export const listCoupons = async () => {
  return dbDrizzle.select().from(coupon).orderBy(desc(coupon.createdAt));
};

export const setCouponActive = async (couponId: string, active: boolean) => {
  const [updated] = await dbDrizzle
    .update(coupon)
    .set({ active })
    .where(eq(coupon.id, couponId))
    .returning();
  return updated;
};

// --- Validation core ----------------------------------------------------

export type EvaluateResult =
  | { valid: false; reason: string }
  | {
      valid: true;
      coupon: typeof coupon.$inferSelect;
      discount: number;
      finalPrice: number;
    };

const totalRedemptions = async (db: DbOrTx, couponId: string): Promise<number> => {
  const [{ total }] = await db
    .select({ total: count() })
    .from(couponRedemption)
    .where(eq(couponRedemption.couponId, couponId));
  return Number(total);
};

const userRedemptions = async (
  db: DbOrTx,
  couponId: string,
  userId: string
): Promise<number> => {
  const [{ total }] = await db
    .select({ total: count() })
    .from(couponRedemption)
    .where(
      and(eq(couponRedemption.couponId, couponId), eq(couponRedemption.userId, userId))
    );
  return Number(total);
};

// Validate a coupon code for a user against a cart amount. Pure read; used both
// for the preview endpoint and inside the redeem transaction. `now` is passed
// in so the same instant is used for the expiry check.
export const evaluateCoupon = async (
  db: DbOrTx,
  code: string,
  userId: string,
  cartTotal: number,
  now: Date,
  courseIdsInCart: string[]
): Promise<EvaluateResult> => {
  const rows = await db
    .select()
    .from(coupon)
    .where(eq(coupon.code, normalizeCode(code)))
    .limit(1);
  const found = rows[0];

  if (!found) return { valid: false, reason: "Coupon not found" };
  if (!found.active) return { valid: false, reason: "Coupon is inactive" };
  if (found.expiresAt && found.expiresAt.getTime() < now.getTime()) {
    return { valid: false, reason: "Coupon has expired" };
  }
  if (found.courseId && !courseIdsInCart.includes(found.courseId)) {
    return { valid: false, reason: "Coupon does not apply to the items in your cart" };
  }
  if (found.maxRedemptions !== null) {
    if ((await totalRedemptions(db, found.id)) >= found.maxRedemptions) {
      return { valid: false, reason: "Coupon redemption limit reached" };
    }
  }
  if ((await userRedemptions(db, found.id, userId)) >= found.perUserLimit) {
    return { valid: false, reason: "You have already used this coupon" };
  }

  const rawDiscount =
    found.discountType === "percent"
      ? Math.round((cartTotal * found.value) / 100)
      : found.value;
  // Never discount below zero or above the cart total.
  const discount = Math.max(0, Math.min(rawDiscount, cartTotal));

  return { valid: true, coupon: found, discount, finalPrice: cartTotal - discount };
};

// Record a redemption. Call inside the same transaction that creates the order.
export const recordRedemption = async (
  tx: Tx,
  couponId: string,
  userId: string,
  amountDiscounted: number
) => {
  await tx.insert(couponRedemption).values({ couponId, userId, amountDiscounted });
};
