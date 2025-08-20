ALTER TABLE "user_video_progress" RENAME TO "progress";--> statement-breakpoint
ALTER TABLE "progress" DROP CONSTRAINT "user_video_progress_video_id_video_id_fk";
--> statement-breakpoint
ALTER TABLE "progress" DROP CONSTRAINT "user_video_progress_user_courses_user_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_video_id_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_courses_user_courses_id_fk" FOREIGN KEY ("user_courses") REFERENCES "public"."user_courses"("id") ON DELETE no action ON UPDATE no action;