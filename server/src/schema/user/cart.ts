import {
    pgTable,
    uuid,
    timestamp,
    unique,
  } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { course } from "../admin/course";

  
  export const cartItems = pgTable(
    "cart_items",
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
    (table) => [
      // prevent the same course being added twice for one user
      unique().on(table.userId, table.courseId),
    ]
  );
  