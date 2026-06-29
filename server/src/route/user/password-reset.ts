import { Hono } from "hono";
import {
  requestReset,
  verifyOtp,
  resetPassword,
  requestResetSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../../controller/user/password-reset.controller";
import { validateBody } from "../../util/validate";

// Public (no auth) — these are the forgot-password endpoints. They serve both
// user and admin accounts via the `role` field.
const passwordReset = new Hono();

passwordReset.post("/password/request-reset", validateBody(requestResetSchema), requestReset);
passwordReset.post("/password/verify-otp", validateBody(verifyOtpSchema), verifyOtp);
passwordReset.post("/password/reset", validateBody(resetPasswordSchema), resetPassword);

export default passwordReset;
