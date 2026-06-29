import { pgTable, uuid, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth";
import { video } from "../admin/video";

// A learner's personal, timestamped note on a video. Many notes per user+video.
export const note = pgTable("note", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  videoId: uuid("video_id")
    .references(() => video.id, { onDelete: "cascade" })
    .notNull(),

  // Position in the video this note refers to, in seconds.
  timestampSeconds: integer("timestamp_seconds").default(0).notNull(),

  content: varchar("content", { length: 2000 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const noteRelations = relations(note, ({ one }) => ({
  user: one(user, { fields: [note.userId], references: [user.id] }),
  video: one(video, { fields: [note.videoId], references: [video.id] }),
}));
