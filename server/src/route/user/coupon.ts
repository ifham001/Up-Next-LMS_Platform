import { Hono } from "hono";
import { applyCoupon, applyCouponSchema } from "../../controller/user/coupon.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody } from "../../util/validate";

const coupon = new Hono();

coupon.post("/coupons/apply", authMiddleware, validateBody(applyCouponSchema), applyCoupon);

export default coupon;
