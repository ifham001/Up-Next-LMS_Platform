import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Add a comment
export const addCommentApi = async (
  videoId: string,
  userId: string,
  content: string,
  dispatch: AppDispatch
) => {
  try {
    const res = await fetch(`${API_URL}/user/add-new-comment`, {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('token')}`,
    },
      body: JSON.stringify({ videoId, userId, content }),
    });

    const data = await res.json();

    if (data.success) {
      dispatch(
        showNotification({ message: "Comment added successfully", type: "success" })
      );
      return data;
    } else {
      dispatch(
        showNotification({ message: data.message || "Failed to add comment", type: "error" })
      );
      return null;
    }
  } catch (error) {
    dispatch(showNotification({ message: "Something went wrong", type: "error" }));
    return null;
  }
};

// Reply to a comment
export const replyCommentApi = async (
  parentCommentId: string,
  userId: string,
  content: string,
  dispatch: AppDispatch
) => {
  try {
    const res = await fetch(`${API_URL}/user/add-reply-comment`, {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('token')}`,
    },
      body: JSON.stringify({ parentCommentId, userId, content }),
    });

    const data = await res.json();

    if (data.success) {
      dispatch(
        showNotification({ message: "Reply added successfully", type: "success" })
      );
      return data;
    } else {
      dispatch(
        showNotification({ message: data.message || "Failed to add reply", type: "error" })
      );
      return null;
    }
  } catch (error) {
    dispatch(showNotification({ message: "Something went wrong", type: "error" }));
    return null;
  }
};

// Get all comments for a video
export const getCommentsApi = async (videoId: string) => {
  try {
    const res = await fetch(`${API_URL}/user/get-all-comments/${videoId}`,{
        headers:{
            "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('token')}`,
        }
    });
    const data = await res.json();
    

    if (data.success) {
      // Map to include avatar initials
        return data
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
