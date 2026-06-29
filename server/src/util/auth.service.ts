import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Auth primitives live here, out of the data (query) layer. Queries now do pure
// reads/writes and receive an already-hashed password; hashing, comparison and
// token signing are application concerns owned by this service.

const SALT_ROUNDS = 10;

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, SALT_ROUNDS);

export const verifyPassword = (plain: string, hashed: string | null): Promise<boolean> =>
  bcrypt.compare(plain, hashed ?? "");

export const signAuthToken = (payload: object, expiresIn = "1h"): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn } as jwt.SignOptions);
