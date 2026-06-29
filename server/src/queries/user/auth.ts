import { dbDrizzle } from "../../config/pg.db";
import { eq } from "drizzle-orm";
import { user } from "../../schema/auth";

export interface NewUser {
  name: string;
  email: string;
  passwordHash: string;
  auth_type: "google" | "email";
}

// Pure data access: receives an already-hashed password (hashing is done in the
// auth service / controller). Returns the safe public columns only.
export const createUser = async (userData: NewUser) => {
  try {
    const userCreated = await dbDrizzle
      .insert(user)
      .values({
        name: userData.name,
        email: userData.email,
        password: userData.passwordHash,
        auth_type: userData.auth_type,
      })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        auth_type: user.auth_type,
      });

    return userCreated[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

// Returns the full user row (including the password hash) by email, or
// undefined. Password verification happens in the controller via the auth
// service — the query layer no longer knows about bcrypt.
export const findUserByEmail = async (email: string) => {
  const rows = await dbDrizzle.select().from(user).where(eq(user.email, email));
  return rows[0];
};
