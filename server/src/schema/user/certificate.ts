import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth";
import { course } from "../admin/course";

// A completion certificate issued once a user finishes a course (100% progress).
// `certificateNumber` is a public, human-shareable id used for verification.
export const certificate = pgTable(
  "certificate",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    certificateNumber: varchar("certificate_number", { length: 40 }).notNull().unique(),

    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    courseId: uuid("course_id")
      .references(() => course.id, { onDelete: "cascade" })
      .notNull(),

    issuedAt: timestamp("issued_at").defaultNow().notNull(),
  },
  (table) => [unique("certificate_user_course_unique").on(table.userId, table.courseId)]
);

export const certificateRelations = relations(certificate, ({ one }) => ({
  user: one(user, { fields: [certificate.userId], references: [user.id] }),
  course: one(course, { fields: [certificate.courseId], references: [course.id] }),
}));
