import { Context } from "hono";
import { z } from "zod";
import { announceToCourse } from "../../queries/user/notification.queries";
import { getValidated } from "../../util/validate";
import { created } from "../../util/response";
import { NotFoundError } from "../../util/errors";

export const announceSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1).max(150),
  body: z.string().min(1).max(5000),
});

// POST /admin/announce — send an announcement to all enrolled users of a course.
export const announceCourse = async (c: Context) => {
  const { courseId, title, body } = getValidated<z.infer<typeof announceSchema>>(c, "body");

  const recipients = await announceToCourse(courseId, title, body);
  if (recipients === null) throw new NotFoundError("Course not found");

  return created(c, { recipients }, `Announcement sent to ${recipients} user(s)`);
};
