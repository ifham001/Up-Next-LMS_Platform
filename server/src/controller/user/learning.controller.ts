import { Context } from "hono";
import { getAllUserCourses, getCourseContentById, getItemById } from "../../queries/user/learning.queries";
import z from "zod";
import { courseProgress } from "../../queries/user/progress.queries";

export const getUserCourses = async (c: Context) => {
  try {
    const userId = c.req.param("userId");
    console.log('hi')
    if (!userId) {
      return c.json({ message: "userId not found", success: false });
    }

    const getCourses = await getAllUserCourses(userId);

    if (!getCourses.success ) {
      return c.json({ message: getCourses.message || "course not found", success: false });
    }
    return c.json(getCourses)


  } catch (error) {
    console.log(error)
    return c.json({ message: "Internal server error", success: false });
  }
};

const indexSchema = z.object({
  courseId: z.string(),
  userId: z.string(),
});

export const getCourseContent = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { courseId, userId } = indexSchema.parse(body);

    const getContent = await getCourseContentById(userId, courseId);
    return c.json(getContent, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal error try again!", success: false }, 500);
  }
};

export const getItemContent = async (c: Context) => {
  try {
    const itemId = c.req.param("itemId");
    if (!itemId) {
      return c.json({ message: "itemId not found", success: false });
    }

    const data = await getItemById(itemId);
    if (data?.success) {
      return c.json(data, 200);
    }

    return c.json({ message: "could not find item id", success: false });
  } catch (error) {
    return c.json({ message: "internal server error", success: false });
  }
};
