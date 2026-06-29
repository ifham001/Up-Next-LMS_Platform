import { dbDrizzle } from "../../config/pg.db";
import { section, sectionItem } from "../../schema/admin/section"
import { course , ICourse, domain as domainEnum } from "../../schema/admin/course";
import { eq, getTableColumns, sql, and, ilike, asc, desc, count, type SQL } from "drizzle-orm";


import { video } from "../../schema/admin/video";
import { duration } from "drizzle-orm/gel-core";




export async function getCoursesWithCourseId(courseId: string) {
    const result = await dbDrizzle
      .select({
        ...getTableColumns(course), // all course fields
        totalVideos: sql<number>`COALESCE(SUM(CASE WHEN ${sectionItem.content_type} = 'video' THEN 1 ELSE 0 END), 0)`,
        totalQuizzes: sql<number>`COALESCE(SUM(CASE WHEN ${sectionItem.content_type} = 'quiz' THEN 1 ELSE 0 END), 0)`,
        totalResources: sql<number>`COALESCE(SUM(CASE WHEN ${sectionItem.content_type} = 'resource' THEN 1 ELSE 0 END), 0)`,
      })
      .from(course)
      .leftJoin(section, eq(section.course_id, course.id)) // ✅ proper join
      .leftJoin(sectionItem, eq(sectionItem.section_id, section.id))
      .where(eq(course.id, courseId)) // ✅ filter by courseId
      .groupBy(course.id); // ✅ group by column
  
    return result;
  }
  
  export const getAllCourse = async () => {
    
    const allCourses = await dbDrizzle
    .select({
      id: course.id,
      title: course.title,
      course_duration: course.course_duration,
      tagline: course.tagline,
      price: course.price,
      domain: course.domain,
      total_enrollments: course.total_enrollments,
      thumbnailUrl: course.thumbnail,
      lessons: sql<number>`COUNT(${section.id})`.mapWith(Number), // total lessons
    })
    .from(course)
    .leftJoin(section, eq(course.id, section.course_id))
    .where(eq(course.status, 'published'))
    .groupBy(course.id);

    return allCourses
  };

// Domain enum values, for validating the `domain` filter.
export type CourseDomain = (typeof domainEnum.enumValues)[number];
export const courseDomains = domainEnum.enumValues;

export type CourseSortKey = "newest" | "price_asc" | "price_desc" | "rating" | "enrollments";

export interface SearchCoursesParams {
  search?: string;
  domain?: CourseDomain;
  sort?: CourseSortKey;
  page: number;
  limit: number;
}

// Search / filter / sort / paginate published courses. Backward compatible with
// getAllCourse (no params -> first page of all published courses).
export const searchCourses = async (params: SearchCoursesParams) => {
  const { search, domain, sort = "newest", page, limit } = params;

  const filters: SQL[] = [eq(course.status, "published")];
  if (search) filters.push(ilike(course.title, `%${search}%`));
  if (domain) filters.push(eq(course.domain, domain));
  const where = and(...filters);

  const orderBy = (() => {
    switch (sort) {
      case "price_asc":
        return asc(course.price);
      case "price_desc":
        return desc(course.price);
      case "rating":
        return desc(course.rating);
      case "enrollments":
        return desc(course.total_enrollments);
      case "newest":
      default:
        return desc(course.createdAt);
    }
  })();

  const offset = (page - 1) * limit;

  const items = await dbDrizzle
    .select({
      id: course.id,
      title: course.title,
      course_duration: course.course_duration,
      tagline: course.tagline,
      price: course.price,
      domain: course.domain,
      rating: course.rating,
      total_reviews: course.total_reviews,
      total_enrollments: course.total_enrollments,
      thumbnailUrl: course.thumbnail,
      createdAt: course.createdAt,
      lessons: sql<number>`COUNT(${section.id})`.mapWith(Number),
    })
    .from(course)
    .leftJoin(section, eq(course.id, section.course_id))
    .where(where)
    .groupBy(course.id)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Total matching course count (for pagination), independent of the section join.
  const [{ total }] = await dbDrizzle
    .select({ total: count() })
    .from(course)
    .where(where);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};



  import { inArray } from "drizzle-orm";
// adjust your path

export const getCourseDetailById = async (courseIds: string[]) => {
  if (!courseIds || courseIds.length === 0) return [];

  const courseNameAndPriceObject = await dbDrizzle
    .select({
      price: course.price,
      title: course.title,
    })
    .from(course)
    .where(inArray(course.id, courseIds));

  return courseNameAndPriceObject;
};