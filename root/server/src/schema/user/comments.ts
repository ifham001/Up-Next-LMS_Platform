
// schema/comments.ts
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
 // Assuming you already have a video table
// Assuming you already have a user table
import { video } from "../admin/video";
import { user } from "../auth";

export const comment = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),

  videoId: uuid("video_id")
    .references(() => video.id, { onDelete: "cascade" })
    .notNull(),

  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sub-comments (Replies)
export const subComment = pgTable("sub_comment", {
  id: uuid("id").primaryKey().defaultRandom(),

  commentId: uuid("comment_id")
    .references(() => comment.id, { onDelete: "cascade" })
    .notNull(),

  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const commentRelations = relations(comment, ({ one, many }) => ({
  video: one(video, {
    fields: [comment.videoId],
    references: [video.id],
  }),
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  subComments: many(subComment),
}));

export const subCommentRelations = relations(subComment, ({ one }) => ({
  comment: one(comment, {
    fields: [subComment.commentId],
    references: [comment.id],
  }),
  user: one(user, {
    fields: [subComment.userId],
    references: [user.id],
  }),
}));
