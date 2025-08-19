import { integer, jsonb, pgEnum, pgTable, timestamp, uuid, varchar ,doublePrecision } from "drizzle-orm/pg-core";



export const courseStatus = pgEnum('course_status', ['draft', 'published', 'archived']);
export const domain = pgEnum('domain', ['Information Technology', 'Business', 'Language', 'Marketing', 'Management', 'Other']);


export const course = pgTable('course', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 100 }).notNull(),
    tagline: varchar('tagline', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    price: integer('price').notNull(),
    thumbnail: varchar('thumbnail', { length: 255 }).notNull(),
    status: courseStatus('course_status').default('draft').notNull(),
    domain: domain('domain').default('Other').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    requirements: jsonb('requirements').notNull(),
    benefits: jsonb('benefits').notNull(),
    rating: integer('rating').default(0),
    total_reviews: integer('total_reviews').default(0),
    total_enrollments: integer('total_enrollments').default(0),
    course_duration: integer('course_duration').default(0),
    preview_video: varchar('preview_video', { length: 455 }).notNull(),
    preview_video_duration: doublePrecision('preview_video_duration').notNull(),

  });   

  // title:string
  // course_duration:number
  // tagline:string
  // price:number
  // domain:string
  // total_enrollment:number
  // id:string
  // lessons:number,
  // thumbnailUrl:string

  export interface ICourse {
    title: string;
    tagline: string;
    description: string;
    price: number;
    thumbnail: string;
    domain: 'Information Technology' | 'Business' | 'Language' | 'Marketing' | 'Management' | 'Other';
    requirements: string[];
    benefits: string[];
    preview_video: string;
    preview_video_duration:number
  }