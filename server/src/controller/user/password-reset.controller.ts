import { Context } from "hono";
import { z } from "zod";
import {
  accountExists,
  storeResetToken,
  getActiveToken,
  consumeToken,
  updateAccountPassword,
} from "../../queries/user/password-reset.queries";
import { hashPassword, verifyPassword } from "../../util/auth.service";
import { generateOtp, sendOtp } from "../../util/otp.service";
import { getValidated } from "../../util/validate";
import { ok } from "../../util/response";
import { BadRequestError } from "../../util/errors";

const roleField = z.enum(["user", "admin"]).default("user");
const OTP_TTL_MS = 10 * 60 * 1000;

export const requestResetSchema = z.object({
  email: z.string().email(),
  role: roleField,
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  role: roleField,
  otp: z.string().length(6),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  role: roleField,
  otp: z.string().length(6),
  newPassword: z.string().min(8).max(50),
});

// Generic response so an attacker can't tell whether an email is registered.
const ENUMERATION_SAFE_MESSAGE =
  "If an account exists for that email, a reset code has been sent.";

// POST /user/password/request-reset
export const requestReset = async (c: Context) => {
  const { email, role } = getValidated<z.infer<typeof requestResetSchema>>(c, "body");

  if (await accountExists(email, role)) {
    const otp = generateOtp();
    const otpHash = await hashPassword(otp);
    await storeResetToken(email, role, otpHash, new Date(Date.now() + OTP_TTL_MS));
    await sendOtp({ email }, otp);
  }

  // Always 200, regardless of whether the account exists.
  return ok(c, undefined, ENUMERATION_SAFE_MESSAGE);
};

// Shared OTP check for verify + reset.
const checkOtp = async (email: string, role: "user" | "admin", otp: string) => {
  const token = await getActiveToken(email, role, new Date());
  if (!token) return null;
  const valid = await verifyPassword(otp, token.otpHash);
  return valid ? token : null;
};

// POST /user/password/verify-otp — confirm a code without consuming it.
export const verifyOtp = async (c: Context) => {
  const { email, role, otp } = getValidated<z.infer<typeof verifyOtpSchema>>(c, "body");
  const token = await checkOtp(email, role, otp);
  if (!token) throw new BadRequestError("Invalid or expired code");
  return ok(c, { verified: true }, "Code verified");
};

// POST /user/password/reset — verify the code, set the new password, consume it.
export const resetPassword = async (c: Context) => {
  const { email, role, otp, newPassword } =
    getValidated<z.infer<typeof resetPasswordSchema>>(c, "body");

  const token = await checkOtp(email, role, otp);
  if (!token) throw new BadRequestError("Invalid or expired code");

  const passwordHash = await hashPassword(newPassword);
  const updated = await updateAccountPassword(email, role, passwordHash);
  if (!updated) throw new BadRequestError("Unable to reset password");

  await consumeToken(token.id);
  return ok(c, undefined, "Password has been reset");
};
