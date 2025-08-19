import { pgTable, uuid, integer, timestamp, boolean ,doublePrecision } from "drizzle-orm/pg-core";
import { video } from "../admin/video";
import { user } from "../auth";
import { userCourses } from "./userCourses";

export const Progress = pgTable("progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id").notNull().references(() => video.id),
  userCoursesId:uuid("user_courses").references(()=>userCourses.id),
  watchedSeconds: doublePrecision("watched_seconds").default(0), // e.g., 150 seconds
  isCompleted: boolean("is_completed").default(false),
  
});
