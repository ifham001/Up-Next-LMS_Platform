import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { course } from "../admin/course";

// Saved-for-later list. Mirrors cart_items: one row per (user, course).
export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    courseId: uuid("course_id")
      .references(() => course.id, { onDelete: "cascade" })
      .notNull(),

    addedAt: timestamp("added_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [unique("wishlist_user_course_unique").on(table.userId, table.courseId)]
);
