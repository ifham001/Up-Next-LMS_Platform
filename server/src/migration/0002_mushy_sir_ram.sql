CREATE TYPE "public"."discount_type" AS ENUM('percent', 'fixed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('announcement', 'enrollment', 'certificate', 'system');--> statement-breakpoint
CREATE TYPE "public"."reset_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certificate_number" varchar(40) NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "certificate_certificate_number_unique" UNIQUE("certificate_number"),
	CONSTRAINT "certificate_user_course_unique" UNIQUE("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "coupon" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(40) NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"value" integer NOT NULL,
	"max_redemptions" integer,
	"per_user_limit" integer DEFAULT 1 NOT NULL,
	"course_id" uuid,
	"expires_at" timestamp with time zone,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupon_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "coupon_redemption" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount_discounted" integer NOT NULL,
	"redeemed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"video_id" uuid NOT NULL,
	"timestamp_seconds" integer DEFAULT 0 NOT NULL,
	"content" varchar(2000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" DEFAULT 'system' NOT NULL,
	"title" varchar(150) NOT NULL,
	"body" text NOT NULL,
	"course_id" uuid,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"role" "reset_role" NOT NULL,
	"otp_hash" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemption" ADD CONSTRAINT "coupon_redemption_coupon_id_coupon_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemption" ADD CONSTRAINT "coupon_redemption_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_video_id_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;