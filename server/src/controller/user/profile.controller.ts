import { Context } from "hono";
import { z } from "zod";
import {
  getProfile,
  updateProfileName,
  getPasswordHash,
  updatePasswordHash,
} from "../../queries/user/profile.queries";
import { hashPassword, verifyPassword } from "../../util/auth.service";
import { getValidated } from "../../util/validate";
import { ok } from "../../util/response";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../util/errors";

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(50),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(50),
  newPassword: z.string().min(8).max(50),
});

const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

// GET /user/profile — the caller's own profile.
export const getMyProfile = async (c: Context) => {
  const userId = currentUserId(c);
  const profile = await getProfile(userId);
  if (!profile) throw new NotFoundError("User not found");
  return ok(c, { profile }, "Profile fetched");
};

// PUT /user/profile — update the caller's display name.
export const updateMyProfile = async (c: Context) => {
  const userId = currentUserId(c);
  const { name } = getValidated<z.infer<typeof updateProfileSchema>>(c, "body");
  const profile = await updateProfileName(userId, name);
  if (!profile) throw new NotFoundError("User not found");
  return ok(c, { profile }, "Profile updated");
};

// PUT /user/profile/password — change the caller's password.
export const changeMyPassword = async (c: Context) => {
  const userId = currentUserId(c);
  const { currentPassword, newPassword } =
    getValidated<z.infer<typeof changePasswordSchema>>(c, "body");

  const existingHash = await getPasswordHash(userId);
  if (!existingHash) {
    // e.g. Google-auth accounts with no local password set.
    throw new BadRequestError("This account has no password set");
  }
  if (!(await verifyPassword(currentPassword, existingHash))) {
    throw new UnauthorizedError("Current password is incorrect");
  }
  if (currentPassword === newPassword) {
    throw new BadRequestError("New password must be different from the current one");
  }

  await updatePasswordHash(userId, await hashPassword(newPassword));
  return ok(c, undefined, "Password changed");
};
