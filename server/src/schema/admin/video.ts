import { boolean, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { section } from "./section";

export const video = pgTable('video', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    section_id: uuid('section_id').references(() => section.id).notNull(),
    url: varchar('url', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });   

  export interface IVideo {
    title: string;
    description: string;
    section_id: string;
    url: string;
    duration?:number
   
  }