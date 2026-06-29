import { Hono } from "hono";
import {
  getNotifications,
  getUnreadCount,
  readNotification,
  readAllNotifications,
  listNotificationsQuerySchema,
  notificationIdParamSchema,
} from "../../controller/user/notification.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateQuery, validateParams } from "../../util/validate";

const notification = new Hono();

notification.get(
  "/notifications",
  authMiddleware,
  validateQuery(listNotificationsQuerySchema),
  getNotifications
);
notification.get("/notifications/unread-count", authMiddleware, getUnreadCount);
notification.put("/notifications/read-all", authMiddleware, readAllNotifications);
notification.put(
  "/notifications/:notificationId/read",
  authMiddleware,
  validateParams(notificationIdParamSchema),
  readNotification
);

export default notification;
