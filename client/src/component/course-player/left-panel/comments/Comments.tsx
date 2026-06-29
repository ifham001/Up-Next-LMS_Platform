import { addCommentApi, replyCommentApi, getCommentsApi } from "@/api/user/comment/comment";
import { RootState } from "@/store/Store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessagesSquare, SendHorizontal } from "lucide-react";

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
    <div>
      <div className="mb-6 flex items-center gap-2">
        <MessagesSquare size={18} strokeWidth={1.75} className="text-text-secondary" />
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          {comments.length > 0 ? (
            <>
              <span className="tnum text-accent">{comments.length}</span>{" "}
              {comments.length === 1 ? "comment" : "comments"}
            </>
          ) : (
            "Comments"
          )}
        </h2>
      </div>

      {comments.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface-muted px-4 py-6 text-center text-sm text-text-secondary">
          No comments yet. Start the discussion below.
        </p>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {comments.map((comment) => (
            <div key={comment.id} className="py-4">
              {/* Main Comment */}
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-text-primary">
                  {comment.avatarLetter}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <p className="font-medium text-text-primary">{comment.name}</p>
                    <span>•</span>
                    <span>{timeAgo(comment.createdAt)}</span>
                  </div>

                  <p className="mt-1 leading-relaxed text-text-secondary">{comment.content}</p>

                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="mt-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Reply
                  </button>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply"
                        className="flex-1 rounded-full border border-input-border bg-input-bg px-4 py-1.5 text-sm text-text-primary placeholder:text-input-placeholder transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        className="btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-2 space-y-3 border-l border-border pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-medium text-text-secondary">
                            {reply.avatarLetter}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <p className="font-medium text-text-primary">{reply.name}</p>
                              <span>•</span>
                              <span>{timeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment at the End */}
      <div className="mt-5 flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment"
          className="flex-1 rounded-full border border-input-border bg-input-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-input-placeholder transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <button
          onClick={handleAddComment}
          className="btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <SendHorizontal size={15} strokeWidth={1.75} />
          Comment
        </button>
      </div>
    </div>
  );
}
