import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth";
import { course } from "../admin/course";

export const notificationType = pgEnum("notification_type", [
  "announcement",
  "enrollment",
  "certificate",
  "system",
]);

// A per-user notification. Course announcements fan out into one row per
// enrolled user so reads/unreads are tracked individually.
export const notification = pgTable("notification", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  type: notificationType("type").default("system").notNull(),

  title: varchar("title", { length: 150 }).notNull(),
  body: text("body").notNull(),

  // Optional link to the course the notification is about.
  courseId: uuid("course_id").references(() => course.id, { onDelete: "cascade" }),

  isRead: boolean("is_read").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
  course: one(course, { fields: [notification.courseId], references: [course.id] }),
}));
