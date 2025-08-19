import { eq, inArray , and } from "drizzle-orm";
import { db, dbDrizzle } from "../../config/pg.db";
import { userCourses } from "../../schema/user/userCourses";
import { promise, success } from "zod";
import { course } from "../../schema/admin/course";
import { section, sectionItem } from "../../schema/admin/section";
import { quiz } from "../../schema/admin/quiz";
import { video } from "../../schema/admin/video";
import { resource } from "../../schema/admin/resource";
import { Progress } from "../../schema";
import { courseProgress } from "./progress.queries";





export const getAllUserCourses = async (userId: string) => {
    try {
    
      const userCoursesList = await dbDrizzle
        .select({ 
            courseId: userCourses.courseId,
            userCourseId:userCourses.id
         })
        .from(userCourses)
        .where(eq(userCourses.userId, userId));
  
      if (userCoursesList.length === 0) {
        return { message: "No course found", success: false };
      }
  
      const courseDetailWithUserProgress =await Promise.all(  userCoursesList.map(async (c) =>{
         
         const getProgress = await courseProgress(c.userCourseId); const progress = getProgress?.completedPercent ?? 0;
                 const [courseDetails] = await dbDrizzle
        .select({
            
            title:course.title,
            courseId:course.id,
            tagline:course.tagline,
            thumbnail:course.thumbnail
        })
        .from(course)
        .where(eq(course.id, c.courseId));
       
       return { ...courseDetails,progress ,userCourseId:c.userCourseId }

      }));
 
  
      return { courseDetailWithUserProgress,  success: true };
    } catch (error) {
  
      return { message: "Internal server error", success: false };
    }
  };    
  
  export const getCourseContentById = async (userId: string, courseId: string) => {
    try {
      // 1️⃣ Verify user has any courses
      const user_courses = await dbDrizzle
        .select()
        .from(userCourses)
        .where(eq(userCourses.userId, userId));
  
      if (user_courses.length === 0) {
        return { message: "No courses assigned to this user", success: false };
      }
  
      // 2️⃣ Verify courseId belongs to the user
      const matchingCourse = user_courses.find(
        (courses) => courses.courseId === courseId
      );
  
      const coursedetail = await dbDrizzle
        .select()
        .from(course)
        .where(eq(course.id, courseId));
  
      if (!matchingCourse) {
        return { message: "Course not found for this user", success: false };
      }
  
      // 3️⃣ Get all sections for the course
      const allSections = await dbDrizzle
        .select()
        .from(section)
        .where(eq(section.course_id, courseId));
  
      // 4️⃣ Get section items for each section
      const sections = await Promise.all(
        allSections.map(async (sec) => {
          const items = await dbDrizzle
            .select({
              id: sectionItem.id,
              title: sectionItem.title,
              content_type: sectionItem.content_type,
              section_id: sectionItem.section_id,
              item_id: sectionItem.item_id,
              createdAt: sectionItem.createdAt,
              updatedAt: sectionItem.updatedAt,
              watchedSeconds: Progress.watchedSeconds,
              duration:sectionItem.duration // join field
            })
            .from(sectionItem)
            .leftJoin(
              Progress,
              and(
                eq(Progress.videoId, sectionItem.item_id), // Only videos
                eq(Progress.userCoursesId, user_courses[0].id) // current user
              )
            );
      
          const mappedItems = items.map((item) => {
            if (item.content_type === "video") {
              return { ...item, watchedSeconds: item.watchedSeconds || 0 };
            }
            return item;
          });
      
          return {
            ...sec,
            items: mappedItems,
          };
        })
      );
      return {
        message: "Course content fetched",
        success: true,
        courseName: coursedetail[0].title,
        sections,
        userCourseId: user_courses[0].id,
      };
    } catch (error) {
      console.error(error);
      return { message: "Error fetching course content", success: false };
    }
  };
  


export const getItemById = async (itemId: string) => {
    console.log(itemId)
  try {
    // Search in quiz table
    const quizItem = await dbDrizzle
      .select()
      .from(quiz)
      .where(eq(quiz.id, itemId))
      .limit(1);

    if (quizItem.length > 0) {
      return { message:"quiz item found ", data: quizItem[0],success:true };
    }

    // Search in resource table
    const resourceItem = await dbDrizzle
      .select()
      .from(resource)
      .where(eq(resource.id, itemId))
      .limit(1);

    if (resourceItem.length > 0) {
      return { message:"resource  item found", data: resourceItem[0] ,success:true};
    }

    // Search in video table
    const videoItem = await dbDrizzle
      .select()
      .from(video)
      .where(eq(video.id, itemId))
      .limit(1);
      

    if (videoItem.length > 0) {
      return { message:"video item found", data: videoItem[0],success:true };
    }


    // return {  message:"itemId is wrong item not found",success:false };

  } catch (error) {
   
    return {success:false, message:'Error fetching item by ID'}
  }
};
