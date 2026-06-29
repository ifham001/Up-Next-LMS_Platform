import { Context } from "hono";
import { z } from "zod";
import { createUser, findUserByEmail } from "../../queries/user/auth";
import { hashPassword, verifyPassword, signAuthToken } from "../../util/auth.service";
import { ok, created } from "../../util/response";
import { UnauthorizedError } from "../../util/errors";

const createUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email().min(10).max(50),
  password: z.string().min(8).max(50),
  auth_type: z.enum(["google", "email"]).default("email"),
});

const loginUserSchema = z.object({
  email: z.string().email().min(10).max(50),
  password: z.string().min(8).max(50),
});

export const createUserController = async (c: Context) => {
  const body = await c.req.json();
  const { name, email, password, auth_type } = createUserSchema.parse(body);

  const passwordHash = await hashPassword(password);
  const user = await createUser({ name, email, passwordHash, auth_type });

  return created(c, { user }, "User created successfully");
};

export const userLoggedIn = async (c: Context) => {
  const body = await c.req.json();
  const { email, password } = loginUserSchema.parse(body);

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signAuthToken({ id: user.id });
  // Never return the password hash to the client.
  const { password: _password, ...safeUser } = user;
  return ok(c, { user: safeUser, token }, "User login successfully");
};
