import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { course } from "./course";
import { user } from "../auth";

export const discountType = pgEnum("discount_type", ["percent", "fixed"]);

export const coupon = pgTable("coupon", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Case-insensitive code is enforced by upper-casing before store/lookup.
  code: varchar("code", { length: 40 }).notNull().unique(),

  discountType: discountType("discount_type").notNull(),
  // percent: 1..100, fixed: absolute amount in the same unit as course.price
  value: integer("value").notNull(),

  // null => unlimited total redemptions.
  maxRedemptions: integer("max_redemptions"),
  // how many times a single user may redeem this coupon.
  perUserLimit: integer("per_user_limit").default(1).notNull(),

  // null => not scoped to a course (applies cart-wide).
  courseId: uuid("course_id").references(() => course.id, { onDelete: "cascade" }),

  expiresAt: timestamp("expires_at", { withTimezone: true }),
  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const couponRedemption = pgTable("coupon_redemption", {
  id: uuid("id").primaryKey().defaultRandom(),

  couponId: uuid("coupon_id")
    .references(() => coupon.id, { onDelete: "cascade" })
    .notNull(),

  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Amount actually discounted at redemption time.
  amountDiscounted: integer("amount_discounted").notNull(),

  redeemedAt: timestamp("redeemed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const couponRelations = relations(coupon, ({ one, many }) => ({
  course: one(course, { fields: [coupon.courseId], references: [course.id] }),
  redemptions: many(couponRedemption),
}));

export const couponRedemptionRelations = relations(couponRedemption, ({ one }) => ({
  coupon: one(coupon, { fields: [couponRedemption.couponId], references: [coupon.id] }),
  user: one(user, { fields: [couponRedemption.userId], references: [user.id] }),
}));
