import { Hono } from "hono";
import {
  adminCreateCoupon,
  adminListCoupons,
  adminSetCouponActive,
  createCouponSchema,
  couponIdParamSchema,
  setActiveSchema,
} from "../../controller/admin/coupon.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody, validateParams } from "../../util/validate";

const coupon = new Hono();

coupon.post("/coupons", authMiddleware, validateBody(createCouponSchema), adminCreateCoupon);
coupon.get("/coupons", authMiddleware, adminListCoupons);
coupon.put(
  "/coupons/:couponId/active",
  authMiddleware,
  validateParams(couponIdParamSchema),
  validateBody(setActiveSchema),
  adminSetCouponActive
);

export default coupon;
