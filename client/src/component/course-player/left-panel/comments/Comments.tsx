import { addCommentApi, replyCommentApi, getCommentsApi } from "@/api/user/comment/comment";
import { RootState } from "@/store/Store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Sub-comment type
type SubCommentType = {
  commentId: string;
  createdAt: string;
  name: string;
  avatarLetter: string;
  content: string;
  id: string;
};

// Main comment type
type CommentType = {
  avatarLetter: string;
  createdAt: string;
  id: string;
  name: string;
  content: string;
  replies?: SubCommentType[];
};

// Utility: Convert timestamp to "x time ago"
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval}y ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval}mo ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}m ago`;

  return "Just now";
};

export default function Comments({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const userId = useSelector((state: RootState) => state.userAuth.userId);
  const dispatch = useDispatch();

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const addComment = await addCommentApi(videoId, userId, newComment, dispatch);
    if (addComment.success) {
      setComments([addComment.data, ...comments]);
      setNewComment("");
    }
  };

  // Add reply
  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    const replyComment = await replyCommentApi(parentId, userId, replyText, dispatch);
    if (replyComment.success) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), replyComment.data] }
            : c
        )
      );
      setReplyingTo(null);
      setReplyText("");
    }
  };

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      const res = await getCommentsApi(videoId);
      if (res.success && res.data) {
        setComments(res.data);
      }
    };
    fetchComments();
  }, [videoId]);

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="pb-4 border-b border-gray-200">
          {/* Main Comment */}
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white w-9 h-9 flex items-center justify-center rounded-full font-bold">
              {comment.avatarLetter}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <p className="font-semibold text-gray-900">{comment.name}</p>
                <span>•</span>
                <span>{timeAgo(comment.createdAt)}</span>
              </div>

              <p className="text-gray-800 mt-1">{comment.content}</p>

              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-sm text-blue-500 hover:underline mt-1"
              >
                Reply
              </button>

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <div className="flex items-center gap-2 mt-2 ml-1 bg-gray-50 p-2 rounded-lg">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                  >
                    Reply
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-4 border-l-2 border-gray-200 pl-4 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <div className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
                        {reply.avatarLetter}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <p className="font-semibold text-gray-900">{reply.name}</p>
                          <span>•</span>
                          <span>{timeAgo(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-800 mt-1 text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add Comment at the End */}
      <div className="flex items-center gap-2 border-t border-gray-300 pt-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Comment
        </button>
      </div>
    </div>
  );
}
