import { Context } from "hono";
import { z } from "zod";
import { createCoupon, listCoupons, setCouponActive } from "../../queries/admin/coupon.queries";
import { getValidated } from "../../util/validate";
import { ok, created } from "../../util/response";
import { NotFoundError } from "../../util/errors";

export const createCouponSchema = z
  .object({
    code: z.string().min(3).max(40),
    discountType: z.enum(["percent", "fixed"]),
    value: z.number().int().positive(),
    maxRedemptions: z.number().int().positive().nullable().optional(),
    perUserLimit: z.number().int().positive().default(1),
    courseId: z.string().uuid().nullable().optional(),
    // ISO date string; coerced to a Date.
    expiresAt: z.coerce.date().nullable().optional(),
  })
  .refine((v) => v.discountType !== "percent" || v.value <= 100, {
    message: "percent discount value must be between 1 and 100",
    path: ["value"],
  });

export const couponIdParamSchema = z.object({ couponId: z.string().uuid() });
export const setActiveSchema = z.object({ active: z.boolean() });

// POST /admin/coupons
export const adminCreateCoupon = async (c: Context) => {
  const data = getValidated<z.infer<typeof createCouponSchema>>(c, "body");
  const coupon = await createCoupon(data);
  return created(c, { coupon }, "Coupon created");
};

// GET /admin/coupons
export const adminListCoupons = async (c: Context) => {
  const coupons = await listCoupons();
  return ok(c, { coupons }, "Coupons fetched");
};

// PUT /admin/coupons/:couponId/active
export const adminSetCouponActive = async (c: Context) => {
  const { couponId } = getValidated<z.infer<typeof couponIdParamSchema>>(c, "params");
  const { active } = getValidated<z.infer<typeof setActiveSchema>>(c, "body");
  const coupon = await setCouponActive(couponId, active);
  if (!coupon) throw new NotFoundError("Coupon not found");
  return ok(c, { coupon }, active ? "Coupon activated" : "Coupon deactivated");
};
