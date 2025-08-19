// utils/course.ts
import {Section,Items,Course} from '../../src/component/course-player/CoursePlayer'

export function calculateCourseCompletion(course: Course | null): number {
  if (!course) return 0;

  let totalDuration = 0;
  let totalWatched = 0;

  course.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.content_type === "video" && item.duration > 0) {
        totalDuration += item.duration;
        totalWatched += item.watchedSeconds;
      }
    });
  });

  if (totalDuration === 0) return 0;

  return Math.min(100, Math.round((totalWatched / totalDuration) * 100));
}
