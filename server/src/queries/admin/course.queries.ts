import { dbDrizzle } from "../../config/pg.db";
import { section, sectionItem } from "../../schema/admin/section"
import { course , ICourse } from "../../schema/admin/course";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { deleteFilesFromGCS } from "../../util/gcs-upload";
import { deleteSection } from "./section.queries";
import { video } from "../../schema/admin/video";
import { duration } from "drizzle-orm/gel-core";
import userComments from "../../route/user/comments";
import { userCourses } from "../../schema";






export const createCourse = async (courseData: ICourse) => {
  

    const newCourse = await dbDrizzle.insert(course).values(courseData).returning();
   
    return newCourse;


   }

export const getDraftCourse = async () => {
    return await dbDrizzle.select().from(course).where(eq(course.status, 'draft'));
  };
 
  export async function getCoursesWithContentCounts() {
    const result = await dbDrizzle
      .select({
        ...getTableColumns(course), // ✅ Get all fields from course
        videos: sql<number>`COALESCE(SUM(CASE WHEN ${sectionItem.content_type} = 'video' THEN 1 ELSE 0 END), 0)`,
        quizzez: sql<number>`COALESCE(SUM(CASE WHEN ${sectionItem.content_type} = 'quiz' THEN 1 ELSE 0 END), 0)`,
        resources: sql<number>`COALESCE(SUM(CASE WHEN ${sectionItem.content_type} = 'resource' THEN 1 ELSE 0 END), 0)`,
        duration: sql<number>`COALESCE(SUM(CASE WHEN ${sectionItem.content_type} = 'video' THEN ${sectionItem.duration} ELSE 0 END), 0)`
      
      })
      .from(course)
      .leftJoin(section, eq(section.course_id, course.id))
      .leftJoin(sectionItem, eq(sectionItem.section_id, section.id))
      .groupBy(course.id);
  
    return result;
  }

  export const courseFinalize = async (courseId: string) => {
    const checkSectionStatus = await dbDrizzle.select({status:section.section_status}).from(section).where(eq(section.course_id,courseId))

    if(checkSectionStatus[0].status ==='in_progress'){
      return {message:'Please complete the previous section before publish',success:false}
    }
     await dbDrizzle.update(course).set({ status: 'published' }).where(eq(course.id, courseId));
      return {message:'Course publish successfully',success:true}
  };

  export const deleteCourse = async (courseId: string) => {
    if (!courseId || courseId === "undefined") {
      return { message: "courseId not found or undefined", success: false };
    }
  
    try {
      const result = await dbDrizzle.transaction(async (tx) => {
        const courseData = await tx
          .select()
          .from(course)
          .where(eq(course.id, courseId));
  
        if (!courseData.length) {
          return { message: "Course not found", success: false };
        }
  
        const sections = await tx
          .select()
          .from(section)
          .where(eq(section.course_id, courseId));

          if(sections.length >0){
            sections.map(async (section)=>{
              return await deleteSection(section.id)
            })
          }
  
          
            
  
        const { thumbnail, preview_video  } = courseData[0];
        const filesToDelete = [thumbnail, preview_video];
  
        // If GCS deletion fails, abort transaction
        await deleteFilesFromGCS(filesToDelete).catch((err) => {
          return({message:"Failed to delete course files from GCS",success:false});
        });
  
        const deleteResult = await tx
          .delete(course)
          .where(eq(course.id, courseId));
  
        if (deleteResult.rowCount === 1) {
          return { message: "Course deleted successfully", success: true };
        }
  
        return { message: "Course could not be deleted", success: false };
      });
  
      return result;
    } catch (error) {
      
      return { message: "Something went wrong, try again", success: false };
    }
  };

export const archiveCourse = async(courseId:string)=>{
  return await dbDrizzle.update(course).set({ status: 'archived' }).where(eq(course.id, courseId)).returning();
}
export const updatedPrice = async(courseId:string,updatePrice :number)=>{
  return  await dbDrizzle.update(course).set({price:updatePrice}).where(eq(course.id, courseId)).returning();

}



export const lifeTimeCourseDetail = async () => {
  try {
    const allCourses = await dbDrizzle.select().from(course);

    const details = await Promise.all(
      allCourses.map(async (c) => {
        // Find all enrollments for this course
        const enrolledUsers = await dbDrizzle
          .select()
          .from(userCourses)
          .where(eq(userCourses.courseId, c.id));

        const totalEnrolled = enrolledUsers.length;
    

        return {
          courseId: c.id,
          courseName: c.title,
          thumbnail:c.thumbnail,
          totalEnrolled,
          price:c.price,
          status:c.status
        };
      })
    );

    return {
      success: true,
      data: details,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch lifetime course details",
    };
  }
};