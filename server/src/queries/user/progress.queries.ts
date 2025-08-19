import { user } from "../../schema/auth";
import { video } from "../../schema/admin/video";
import { Progress } from "../../schema/user/course-progress";
import { dbDrizzle } from "../../config/pg.db";
import { section, sectionItem } from "../../schema";

// Import Drizzle ORM operators for queries
import { and, eq } from 'drizzle-orm';
import { userCourses } from "../../schema/user/userCourses";



export const mapVideoProgress = async (
   userCourseId: string,
   videoId: string,
   watched_seconds: number
) => {
   try {
     
       
     
       const videoDurationResult = await dbDrizzle
           .select({ duration: sectionItem.duration })
           .from(sectionItem)
           .where(eq(sectionItem.item_id, videoId));

       const durationOfVideo = videoDurationResult[0]?.duration;

      
       if (durationOfVideo === undefined || durationOfVideo === null) {
           console.error(`Video with ID ${videoId} not found or duration is missing.`);
           return;
       }
       
       const isCompleted = (watched_seconds >= durationOfVideo - 10);
       

       const existingProgress = await dbDrizzle
           .select()
           .from(Progress)
           .where(
               and(
                   eq(Progress.userCoursesId, userCourseId),
                   eq(Progress.videoId, videoId)
               )
           );

       if (existingProgress.length > 0) {
        
           await dbDrizzle
               .update(Progress)
               .set({
                   watchedSeconds: watched_seconds,
                   isCompleted: isCompleted,
               })
               .where(eq(Progress.id, existingProgress[0].id));
               
           
           console.log(`Updated progress for video ${videoId} and user course ${userCourseId}. Total watched: ${watched_seconds}`);
       } else {
           // 4b. If no record exists, insert a new one.
           await dbDrizzle.insert(Progress).values({
               userCoursesId: userCourseId,
               videoId: videoId,
               watchedSeconds: watched_seconds,
               isCompleted: isCompleted,
           });
           
           console.log(`Created new progress for video ${videoId} and user course ${userCourseId}. Watched: ${watched_seconds}`);
       }
   } catch (error) {
       // 5. Handle any potential errors during the database operations.
       console.error("Error in mapVideoProgress:", error);
   }
};

export const getUserVideoWithProgress = async (userCourseId: string, videoId: string) => {
    try {
        // 1. Fetch the video details from the 'video' table.
        const dbVideoResult = await dbDrizzle.select().from(video).where(eq(video.id, videoId));

        if (dbVideoResult.length === 0) {
            return { message: "Video not found", success: false, data: null };
        }
        
        const dbVideo = dbVideoResult[0];

        // 2. Fetch the user's progress for that specific video.
        const progressResult = await dbDrizzle
            .select()
            .from(Progress)
            .where(
                and(
                    eq(Progress.userCoursesId, userCourseId),
                    eq(Progress.videoId, videoId)
                )
            );

        const progress = progressResult[0] || null;

        return {
            message: "Video and progress retrieved successfully",
            success: true,
            data: {
                video: dbVideo,
                progress: progress,
            }
        };
    } catch (error) {
        console.error("Error in getVideoWithProgress:", error);
        return { message: "An unexpected error occurred", success: false, data: null };
    }
};



import { count } from "drizzle-orm";

export const courseProgress = async (userCourseId: string) => {
    try {
        // 1. Get the courseId for this userCourse
        const courseResult = await dbDrizzle
            .select({ courseId: userCourses.courseId })
            .from(userCourses)
            .where(eq(userCourses.id, userCourseId));

        if (courseResult.length === 0) {
            return { message: 'User course not found', success: false };
        }

        const courseId = courseResult[0].courseId;

        // 2. Get total videos in the course
        const totalVideosResult = await dbDrizzle
            .select({ count: count() })
            .from(video)
            .innerJoin(section, eq(section.id, video.section_id))
            .where(eq(section.course_id, courseId));

        const totalVideos = Number(totalVideosResult[0]?.count || 0);
        if (totalVideos === 0) {
            return { message: 'No videos found for this course', success: false };
        }

        // 3. Get completed videos for this userCourse
        const completedVideosResult = await dbDrizzle
            .select({ count: count() })
            .from(Progress)
            .where(
                and(
                    eq(Progress.userCoursesId, userCourseId),
                    eq(Progress.isCompleted, true)
                )
            );

        const completedVideos = Number(completedVideosResult[0]?.count || 0);

        // 4. Calculate percent
        const percent = Math.round((completedVideos / totalVideos) * 100);

        // 5. Update userCourses
        await dbDrizzle
            .update(userCourses)
            .set({ completedPercent: percent })
            .where(eq(userCourses.id, userCourseId));

        return { message: 'Course progress updated', success: true, completedPercent: percent };

    } catch (error) {
        console.error("Error in courseProgress:", error);
        return { message: 'Internal server error', success: false };
    }
};
