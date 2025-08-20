import { pgTable,uuid,varchar,timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { course } from "./admin/course";


export const admin = pgTable('admin',{
    id:uuid('id').primaryKey().defaultRandom(),
    name:varchar('name',{length:100}).notNull(),
    email:varchar('email',{length:100}).notNull(),
    password:varchar('password',{length:100}).notNull(),
    createdAt:timestamp('created_at').defaultNow(),
    updatedAt:timestamp('updated_at').defaultNow(),
})
export const authType = pgEnum('auth_type',['google','email']);

export const user = pgTable('user',{
    id:uuid('id').primaryKey().defaultRandom(),
    name:varchar('name',{length:100}).notNull(),
    email:varchar('email',{length:100}).notNull(),
    password:varchar('password',{length:100}),
    auth_type:authType('auth_type'),
    createdAt:timestamp('created_at').defaultNow(),
    updatedAt:timestamp('updated_at').defaultNow(),
    enrolled_courses:uuid('enrolled_courses').references(() => course.id),
})
