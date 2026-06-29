import { Context } from "hono";
import { z } from "zod";
import { dbDrizzle } from "../../config/pg.db";
import { evaluateCoupon } from "../../queries/admin/coupon.queries";
import { showCartItems } from "../../queries/user/cart.queries";
import { getValidated } from "../../util/validate";
import { ok } from "../../util/response";
import { UnauthorizedError } from "../../util/errors";

export const applyCouponSchema = z.object({
  code: z.string().min(3).max(40),
});

const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

// POST /user/coupons/apply — preview a coupon against the caller's current cart.
// This does NOT redeem the coupon; redemption happens atomically at checkout.
export const applyCoupon = async (c: Context) => {
  const userId = currentUserId(c);
  const { code } = getValidated<z.infer<typeof applyCouponSchema>>(c, "body");

  const cart = await showCartItems(userId);
  const items = cart.success && cart.data ? cart.data : [];
  const cartTotal = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const courseIds = items.map((item) => item.courseId);

  const result = await evaluateCoupon(
    dbDrizzle,
    code,
    userId,
    cartTotal,
    new Date(),
    courseIds
  );

  if (!result.valid) {
    return ok(c, { valid: false, reason: result.reason, cartTotal }, "Coupon not applicable");
  }

  return ok(
    c,
    {
      valid: true,
      code: result.coupon.code,
      cartTotal,
      discount: result.discount,
      finalPrice: result.finalPrice,
    },
    "Coupon applied"
  );
};
