import { dbDrizzle } from "../../config/pg.db";
import { Progress, section, sectionItem,video,userCourses } from "../../schema";
import { and, eq, count } from "drizzle-orm";

// --- 1. MAP VIDEO PROGRESS ---
export const mapVideoProgress = async (
  userCourseId: string,
  videoId: string,
  watched_seconds: number
) => {
  try {
    // 1. Get video duration (from sectionItem or video table)
    const videoDurationResult = await dbDrizzle
      .select({ duration: sectionItem.duration })
      .from(sectionItem)
      .where(eq(sectionItem.item_id, videoId));

    const durationOfVideo = videoDurationResult[0]?.duration;
    if (!durationOfVideo) return;

    // 2. Decide completion
    const isCompleted = watched_seconds >= durationOfVideo - 10;

    // 3. Check if progress exists
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
      const prev = existingProgress[0].watchedSeconds ?? 0;

      // Update only if watched_seconds increased
      await dbDrizzle
        .update(Progress)
        .set({
          watchedSeconds: Math.max(prev, watched_seconds),
          isCompleted,
        })
        .where(eq(Progress.id, existingProgress[0].id));
    } else {
      // Insert new progress
      await dbDrizzle.insert(Progress).values({
        userCoursesId: userCourseId,
        videoId,
        watchedSeconds: watched_seconds,
        isCompleted,
      });
    }
  } catch (error) {
    console.error("Error in mapVideoProgress:", error);
  }
};

// --- 2. GET VIDEO + USER PROGRESS ---
export const getUserVideoWithProgress = async (
  userCourseId: string,
  videoId: string
) => {
  try {
    // Fetch video + progress in one query
    const result = await dbDrizzle
      .select({
        video,
        progress: Progress,
      })
      .from(video)
      .leftJoin(
        Progress,
        and(
          eq(Progress.videoId, video.id),
          eq(Progress.userCoursesId, userCourseId)
        )
      )
      .where(eq(video.id, videoId));

    if (result.length === 0) {
      return { message: "Video not found", success: false, data: null };
    }

    const { video: dbVideo, progress } = result[0];

    return {
      message: "Video and progress retrieved successfully",
      success: true,
      data: {
        video: dbVideo,
        progress: progress || null,
      },
    };
  } catch (error) {
    console.error("Error in getUserVideoWithProgress:", error);
    return {
      message: "An unexpected error occurred",
      success: false,
      data: null,
    };
  }
};

// --- 3. UPDATE COURSE PROGRESS ---
export const courseProgress = async (userCourseId: string) => {
  try {
    // 1. Get the courseId for this userCourse
    const courseResult = await dbDrizzle
      .select({ courseId: userCourses.courseId })
      .from(userCourses)
      .where(eq(userCourses.id, userCourseId));

    if (courseResult.length === 0) {
      return { message: "User course not found", success: false };
    }

    const courseId = courseResult[0].courseId;

    // 2. Get total videos in this course
    const totalVideosResult = await dbDrizzle
      .select({ count: count() })
      .from(video)
      .innerJoin(section, eq(section.id, video.section_id))
      .where(eq(section.course_id, courseId));

    const totalVideos = Number(totalVideosResult[0]?.count || 0);
    if (totalVideos === 0) {
      return { message: "No videos found for this course", success: false };
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
    const percent = Math.min(
      100,
      Math.max(0, Math.round((completedVideos / totalVideos) * 100))
    );

    // 5. Update userCourses
    await dbDrizzle
      .update(userCourses)
      .set({ completedPercent: percent })
      .where(eq(userCourses.id, userCourseId));

    return {
      message: "Course progress updated",
      success: true,
      completedPercent: percent,
    };
  } catch (error) {
    console.error("Error in courseProgress:", error);
    return { message: "Internal server error", success: false };
  }
};