import { Context } from "hono";
import { z } from "zod";
import {
  getAllCourse,
  getCoursesWithCourseId,
  searchCourses,
  courseDomains,
} from "../../queries/user/course.queries";
import { getValidated } from "../../util/validate";
import { ok } from "../../util/response";

export const getCourseById = async (c: Context) => {
  try {
    const { courseId } = c.req.param();
    const course = await getCoursesWithCourseId(courseId);
    if (course.length > 0) {
      return c.json({ message: "course fetch successfully", course: course, success: true });
    }
    return c.json({ message: "failed to fetch course", success: false });
  } catch (error) {
    return c.json({ message: "failed to fetch course", success: false });
  }
};

export const fetchAllCourse = async (c: Context) => {
  try {
    const course = await getAllCourse();
    if (course) {
      return c.json({ message: "courses fetched successfully", success: true, course }, 200);
    }
    return c.json({ message: "no courses found", success: false }, 200);
  } catch (error) {
    return c.json({ message: "Failed to fetch courses, try again!", success: false }, 200);
  }
};

// --- Search / filter / pagination ----------------------------------------

export const searchCoursesSchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
  domain: z.enum(courseDomains as [string, ...string[]]).optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "rating", "enrollments"])
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

// GET /user/search-courses?search=&domain=&sort=&page=&limit=
export const searchAllCourses = async (c: Context) => {
  const params = getValidated<z.infer<typeof searchCoursesSchema>>(c, "query");
  const result = await searchCourses(params as any);
  return ok(c, result, "Courses fetched");
};
