import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const resetRole = pgEnum("reset_role", ["user", "admin"]);

// Stores hashed password-reset OTPs. We never store the raw OTP. A request
// inserts a fresh row; verify/reset look up the latest unconsumed, unexpired row
// for the (email, role) pair.
export const passwordResetToken = pgTable("password_reset_token", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: varchar("email", { length: 100 }).notNull(),
  role: resetRole("role").notNull(),

  otpHash: varchar("otp_hash", { length: 255 }).notNull(),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumed: boolean("consumed").default(false).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
