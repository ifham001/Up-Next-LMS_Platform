import { pgTable, uuid, timestamp, decimal, primaryKey, text, pgEnum, integer,unique } from "drizzle-orm/pg-core";


import { user } from "../auth";
import { course } from "../admin/course";
import { Progress } from "./course-progress";


export const paymentModeEnum = pgEnum('payment_mode',['Card','UPI'])
export const paymentStatus = pgEnum('payment_status',['not_done', 'completed'])



export const userCourses = pgTable(
  "user_courses",
  {
    
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    courseId: uuid("course_id")
      .references(() => course.id, { onDelete: "cascade" })
      .notNull(),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow(),
    completedPercent:integer('complete_percent').default(0)
  },
  
  (table) => [

    
    unique('user_course_unique_constraint').on(table.userId, table.courseId),
  ]
);
  