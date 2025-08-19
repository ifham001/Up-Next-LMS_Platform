import { dbDrizzle } from "../../config/pg.db";
import { user } from "../../schema";
import { comment, subComment } from "../../schema/user/comments";
import { eq, inArray, desc } from "drizzle-orm";

// Add Comment
export async function addComment(userId: string, videoId: string, content: string) {
  const [newComment] = await dbDrizzle
    .insert(comment)
    .values({
      userId,
      videoId,
      content,
    })
    .returning();

  return newComment;
}

// Add Reply
export async function addReply(userId: string, commentId: string, content: string) {
  const [newReply] = await dbDrizzle
    .insert(subComment)
    .values({
      userId,
      commentId,
      content,
    })
    .returning();

  return newReply;
}

// Get all comments with replies and user names
export async function getCommentsWithReplies(videoId: string) {
  // Fetch top-level comments with user info
  const commentsList = await dbDrizzle
    .select({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
      name: user.name,
    })
    .from(comment)
    .leftJoin(user, eq(comment.userId, user.id))
    .where(eq(comment.videoId, videoId))
    .orderBy(desc(comment.createdAt));

  if (commentsList.length === 0) return [];

  // Fetch replies with user info
  const replies = await dbDrizzle
    .select({
      id: subComment.id,
      content: subComment.content,
      createdAt: subComment.createdAt,
      commentId: subComment.commentId,
      userId: subComment.userId,
      name: user.name,
    })
    .from(subComment)
    .leftJoin(user, eq(subComment.userId, user.id))
    .where(inArray(subComment.commentId, commentsList.map((c) => c.id)))
    .orderBy(desc(subComment.createdAt));

  // Structure data with replies inside comments
  const structured = commentsList.map((c) => ({
    ...c,
    avatarLetter: c.name ? c.name.charAt(0).toUpperCase() : "?",
    replies: replies
      .filter((r) => r.commentId === c.id)
      .map((r) => ({
        ...r,
        avatarLetter: r.name ? r.name.charAt(0).toUpperCase() : "?",
      })),
  }));

  return structured;
}
