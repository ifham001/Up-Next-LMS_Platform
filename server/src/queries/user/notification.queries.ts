import { and, eq, count, desc } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { notification } from "../../schema/user/notification";
import { userCourses } from "../../schema/user/userCourses";
import { course } from "../../schema/admin/course";

type NotificationType = "announcement" | "enrollment" | "certificate" | "system";

interface NewNotification {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  courseId?: string;
}

// Insert one or many notifications. Returns the number created.
export const createNotifications = async (
  rows: NewNotification[]
): Promise<number> => {
  if (rows.length === 0) return 0;
  const inserted = await dbDrizzle.insert(notification).values(rows).returning({
    id: notification.id,
  });
  return inserted.length;
};

// Announce to every user enrolled in a course. Returns recipient count, or null
// if the course does not exist.
export const announceToCourse = async (
  courseId: string,
  title: string,
  body: string
): Promise<number | null> => {
  const courseRows = await dbDrizzle
    .select({ id: course.id })
    .from(course)
    .where(eq(course.id, courseId))
    .limit(1);
  if (courseRows.length === 0) return null;

  const enrolled = await dbDrizzle
    .select({ userId: userCourses.userId })
    .from(userCourses)
    .where(eq(userCourses.courseId, courseId));

  const rows: NewNotification[] = enrolled.map((e) => ({
    userId: e.userId,
    type: "announcement",
    title,
    body,
    courseId,
  }));

  return createNotifications(rows);
};

// Paginated notification feed for a user, newest first.
export const listNotifications = async (
  userId: string,
  page: number,
  limit: number,
  unreadOnly: boolean
) => {
  const filters = [eq(notification.userId, userId)];
  if (unreadOnly) filters.push(eq(notification.isRead, false));
  const where = and(...filters);

  const offset = (page - 1) * limit;

  const items = await dbDrizzle
    .select()
    .from(notification)
    .where(where)
    .orderBy(desc(notification.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await dbDrizzle
    .select({ total: count() })
    .from(notification)
    .where(where);

  return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
};

export const unreadCount = async (userId: string): Promise<number> => {
  const [{ total }] = await dbDrizzle
    .select({ total: count() })
    .from(notification)
    .where(and(eq(notification.userId, userId), eq(notification.isRead, false)));
  return Number(total);
};

// Mark one notification read, scoped to its owner.
export const markRead = async (userId: string, notificationId: string) => {
  const updated = await dbDrizzle
    .update(notification)
    .set({ isRead: true })
    .where(and(eq(notification.id, notificationId), eq(notification.userId, userId)))
    .returning({ id: notification.id });
  return updated.length > 0;
};

// Mark all of a user's notifications read. Returns the count updated.
export const markAllRead = async (userId: string): Promise<number> => {
  const updated = await dbDrizzle
    .update(notification)
    .set({ isRead: true })
    .where(and(eq(notification.userId, userId), eq(notification.isRead, false)))
    .returning({ id: notification.id });
  return updated.length;
};
