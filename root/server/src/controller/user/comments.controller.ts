
import { Context } from "hono";
import {
addComment,addReply,getCommentsWithReplies
} from "../../queries/user/comments.queries";

// ✅ Add main comment
export const addNewComment = async (c: Context) => {
  try {
    const { videoId, content, userId } = await c.req.json();

    if (!videoId || !content || !userId) {
      return c.json({ success: false, message: "Missing required fields" }, 400);
    }

    const comment = await addComment( userId, videoId, content );
    return c.json({ success: true, data: comment }, 201);

  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

// ✅ Add reply comment
export const addReplyComment = async (c: Context) => {
  try {
    const {  content, userId, parentCommentId } = await c.req.json();

    if ( !content || !userId || !parentCommentId) {
      return c.json({ success: false, message: "Missing required fields" }, 400);
    }

    const reply = await addReply(
     
     userId,
     parentCommentId,
     content
    );

    return c.json({ success: true, data: reply }, 201);

  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

// ✅ Get all comments by video
export const getAllCommentsByVideo = async (c: Context) => {
  try {
    const { videoId } = c.req.param();

    if (!videoId) {
      return c.json({ success: false, message: "Video ID is required" }, 400);
    }

    const comments = await getCommentsWithReplies(videoId);
    return c.json({ success: true, data: comments }, 200);

  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
