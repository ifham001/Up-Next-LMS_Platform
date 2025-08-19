CREATE TABLE "user_video_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid NOT NULL,
	"user_courses" uuid,
	"watched_seconds" integer DEFAULT 0,
	"is_completed" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_user_id_course_id_pk";--> statement-breakpoint
ALTER TABLE "user_courses" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_video_progress" ADD CONSTRAINT "user_video_progress_video_id_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_video_progress" ADD CONSTRAINT "user_video_progress_user_courses_user_courses_id_fk" FOREIGN KEY ("user_courses") REFERENCES "public"."user_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_courses" ADD CONSTRAINT "user_course_unique_constraint" UNIQUE("user_id","course_id");