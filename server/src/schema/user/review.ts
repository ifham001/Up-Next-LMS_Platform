import { pgTable, uuid, integer, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth";
import { course } from "../admin/course";

// One review per user per course. `rating` is 1..5 (enforced in the validation
// layer). The course-level aggregate (course.rating / course.total_reviews) is
// recomputed on every write from this table — this is the source of truth.
export const review = pgTable(
  "review",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    courseId: uuid("course_id")
      .references(() => course.id, { onDelete: "cascade" })
      .notNull(),

    rating: integer("rating").notNull(),

    comment: varchar("comment", { length: 1000 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique("review_user_course_unique").on(table.userId, table.courseId)]
);

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),
  course: one(course, { fields: [review.courseId], references: [course.id] }),
}));
