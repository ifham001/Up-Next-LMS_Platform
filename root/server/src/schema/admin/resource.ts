import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { section } from "./section";
 



export const resource = pgTable('resource', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    section_id: uuid('section_id').references(() => section.id).notNull(),
    resource_url: varchar('resource_url', { length: 1000 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });



  export interface IResource {
    title: string;
    description: string;
    section_id: string;
    resource_url:string
  }