import { dbDrizzle } from "../../config/pg.db";
import { section, sectionItem } from "../../schema/admin/section"
import { course , ICourse } from "../../schema/admin/course";
import { eq, getTableColumns, sql } from "drizzle-orm";


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