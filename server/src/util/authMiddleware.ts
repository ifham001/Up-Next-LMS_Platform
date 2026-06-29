import { Context, Next } from "hono";
import { verify } from "jsonwebtoken";
import { env } from "../config/env";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    return c.json({ success: false, message: "Authorization header missing" }, 401);
  }

  const token = authHeader.split(" ")[1]; // removes "Bearer"
  if (!token) {
    return c.json({ success: false, message: "Token missing" }, 401);
  }

  try {
    // verify JWT against the validated secret (no insecure hardcoded fallback)
    const decoded = verify(token, env.JWT_SECRET);
    // attach user info to context
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ success: false, message: "Invalid or expired token" }, 403);
  }
};
