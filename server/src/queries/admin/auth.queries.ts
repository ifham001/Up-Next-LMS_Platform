import { dbDrizzle } from "../../config/pg.db";
import { eq } from "drizzle-orm";
import { admin } from "../../schema/auth";

export interface NewAdmin {
  name: string;
  email: string;
  passwordHash: string;
}

// Pure data access: receives an already-hashed password. Returns safe columns.
export const createAdmin = async (adminData: NewAdmin) => {
  try {
    const adminCreated = await dbDrizzle
      .insert(admin)
      .values({
        name: adminData.name,
        email: adminData.email,
        password: adminData.passwordHash,
      })
      .returning({
        id: admin.id,
        name: admin.name,
        email: admin.email,
      });

    return adminCreated[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

// Returns the full admin row (including password hash) by email, or undefined.
export const findAdminByEmail = async (email: string) => {
  const rows = await dbDrizzle.select().from(admin).where(eq(admin.email, email));
  return rows[0];
};
