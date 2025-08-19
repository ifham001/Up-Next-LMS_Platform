import { integer, doublePrecision, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { course } from "./course";



export const sectionStatus = pgEnum('section_status', ['completed', 'in_progress']);
export const contentTypes = pgEnum('content_types', ['video', 'quiz', 'resource']);

export const section = pgTable('section', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    course_id: uuid('course_id').references(() => course.id).notNull(),
    section_number: integer('section_number').notNull().default(0),
    section_status: sectionStatus('section_status').default('in_progress').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });

export const sectionItem = pgTable('section_item', {
    id: uuid('id').primaryKey().defaultRandom(),
    section_id: uuid('section_id').references(() => section.id).notNull(),
    item_id: uuid('item_id').notNull(),
    content_type: contentTypes('content_type').notNull(),
    duration: doublePrecision('duration').notNull().default(0),
    order: integer('order').notNull().default(0),
    title: varchar('title', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });


  export interface SectionItem {
    section_id: string;
    item_id: string;
    content_type: 'video' | 'quiz' | 'resource';
    order: number;
    title: string;
    duration?: number;
  }

  export interface ISection {
    title: string;
    description: string;
    course_id: string;
    
   
  }