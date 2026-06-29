import { Context } from "hono";
import { z } from "zod";
import { createAdmin, findAdminByEmail } from "../../queries/admin/auth.queries";
import { hashPassword, verifyPassword, signAuthToken } from "../../util/auth.service";
import { ok, created } from "../../util/response";
import { UnauthorizedError } from "../../util/errors";

const createUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email().min(10).max(50),
  password: z.string().min(8).max(50),
});

const loginUserSchema = z.object({
  email: z.string().email().min(10).max(50),
  password: z.string().min(8).max(50),
});

export const adminSignUp = async (c: Context) => {
  const body = await c.req.json();
  const { name, email, password } = createUserSchema.parse(body);

  const passwordHash = await hashPassword(password);
  const admin = await createAdmin({ name, email, passwordHash });

  return created(c, { admin }, "Admin created successfully");
};

export const adminLoggedIn = async (c: Context) => {
  const body = await c.req.json();
  const { email, password } = loginUserSchema.parse(body);

  const admin = await findAdminByEmail(email);
  if (!admin || !(await verifyPassword(password, admin.password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signAuthToken({ id: admin.id });
  return ok(c, { token }, "Admin login successfully");
};
