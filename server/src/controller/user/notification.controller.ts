import { Context } from "hono";
import { z } from "zod";
import {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
} from "../../queries/user/notification.queries";
import { getValidated } from "../../util/validate";
import { ok } from "../../util/response";
import { NotFoundError, UnauthorizedError } from "../../util/errors";

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  unreadOnly: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export const notificationIdParamSchema = z.object({ notificationId: z.string().uuid() });

const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

// GET /user/notifications
export const getNotifications = async (c: Context) => {
  const userId = currentUserId(c);
  const { page, limit, unreadOnly } =
    getValidated<{ page: number; limit: number; unreadOnly: boolean }>(c, "query");
  const result = await listNotifications(userId, page, limit, unreadOnly);
  return ok(c, result, "Notifications fetched");
};

// GET /user/notifications/unread-count
export const getUnreadCount = async (c: Context) => {
  const userId = currentUserId(c);
  const unread = await unreadCount(userId);
  return ok(c, { unread }, "Unread count fetched");
};

// PUT /user/notifications/:notificationId/read
export const readNotification = async (c: Context) => {
  const userId = currentUserId(c);
  const { notificationId } =
    getValidated<z.infer<typeof notificationIdParamSchema>>(c, "params");
  const updated = await markRead(userId, notificationId);
  if (!updated) throw new NotFoundError("Notification not found");
  return ok(c, undefined, "Notification marked read");
};

// PUT /user/notifications/read-all
export const readAllNotifications = async (c: Context) => {
  const userId = currentUserId(c);
  const updated = await markAllRead(userId);
  return ok(c, { updated }, "All notifications marked read");
};
