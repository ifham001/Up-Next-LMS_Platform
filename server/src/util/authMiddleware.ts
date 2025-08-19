import { Context, Next } from "hono";
import { verify } from "jsonwebtoken"; // or jose if you prefer
import * as dotenv from 'dotenv'
dotenv.config()


const secretKey = process.env.JWT_SECRET || "121212_secret_key"


export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    return c.json({ error: "Authorization header missing" }, 401);
  }

  const token = authHeader.split(" ")[1]; // removes "Bearer"
  if (!token) {
    return c.json({ error: "Token missing" }, 401);
  }

  try {
    // verify JWT
    const decoded = verify(token, secretKey!);
    // attach user info to context
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid or expired token" }, 403);
  }
};
