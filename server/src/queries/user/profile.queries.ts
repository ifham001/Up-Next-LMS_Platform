import { eq } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { user } from "../../schema/auth";

// Public profile columns (never the password hash).
export const getProfile = async (userId: string) => {
  const rows = await dbDrizzle
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      auth_type: user.auth_type,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return rows[0];
};

// Update mutable profile fields (currently just the display name).
export const updateProfileName = async (userId: string, name: string) => {
  const [updated] = await dbDrizzle
    .update(user)
    .set({ name, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      auth_type: user.auth_type,
    });
  return updated;
};

// Fetch the password hash for the current-password check during a change.
export const getPasswordHash = async (userId: string) => {
  const rows = await dbDrizzle
    .select({ password: user.password })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return rows[0]?.password ?? null;
};

// Persist a new (already-hashed) password.
export const updatePasswordHash = async (userId: string, passwordHash: string) => {
  await dbDrizzle
    .update(user)
    .set({ password: passwordHash, updatedAt: new Date() })
    .where(eq(user.id, userId));
};
