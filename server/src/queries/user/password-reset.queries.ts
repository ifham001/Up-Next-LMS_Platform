import { and, eq, desc, gt } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { passwordResetToken } from "../../schema/user/password-reset";
import { user, admin } from "../../schema/auth";

export type ResetRole = "user" | "admin";

// Does an account exist for this email + role? (Used to decide whether to
// actually generate/send an OTP — but the controller responds 200 regardless to
// avoid account enumeration.)
export const accountExists = async (email: string, role: ResetRole): Promise<boolean> => {
  if (role === "admin") {
    const rows = await dbDrizzle.select({ id: admin.id }).from(admin).where(eq(admin.email, email)).limit(1);
    return rows.length > 0;
  }
  const rows = await dbDrizzle.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
  return rows.length > 0;
};

// Invalidate any outstanding tokens, then store a fresh one.
export const storeResetToken = async (
  email: string,
  role: ResetRole,
  otpHash: string,
  expiresAt: Date
) => {
  await dbDrizzle
    .update(passwordResetToken)
    .set({ consumed: true })
    .where(
      and(
        eq(passwordResetToken.email, email),
        eq(passwordResetToken.role, role),
        eq(passwordResetToken.consumed, false)
      )
    );

  const [created] = await dbDrizzle
    .insert(passwordResetToken)
    .values({ email, role, otpHash, expiresAt })
    .returning({ id: passwordResetToken.id });
  return created;
};

// The most recent unconsumed, unexpired token for an (email, role), or undefined.
export const getActiveToken = async (email: string, role: ResetRole, now: Date) => {
  const rows = await dbDrizzle
    .select()
    .from(passwordResetToken)
    .where(
      and(
        eq(passwordResetToken.email, email),
        eq(passwordResetToken.role, role),
        eq(passwordResetToken.consumed, false),
        gt(passwordResetToken.expiresAt, now)
      )
    )
    .orderBy(desc(passwordResetToken.createdAt))
    .limit(1);
  return rows[0];
};

export const consumeToken = async (tokenId: string) => {
  await dbDrizzle
    .update(passwordResetToken)
    .set({ consumed: true })
    .where(eq(passwordResetToken.id, tokenId));
};

// Update the account password (already hashed) for the given email + role.
// Returns true if an account row was updated.
export const updateAccountPassword = async (
  email: string,
  role: ResetRole,
  passwordHash: string
): Promise<boolean> => {
  if (role === "admin") {
    const updated = await dbDrizzle
      .update(admin)
      .set({ password: passwordHash, updatedAt: new Date() })
      .where(eq(admin.email, email))
      .returning({ id: admin.id });
    return updated.length > 0;
  }
  const updated = await dbDrizzle
    .update(user)
    .set({ password: passwordHash, updatedAt: new Date() })
    .where(eq(user.email, email))
    .returning({ id: user.id });
  return updated.length > 0;
};
