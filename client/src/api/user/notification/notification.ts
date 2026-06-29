import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

export const getNotificationsApi = async (
  page: number = 1,
  limit: number = 20,
  dispatch?: AppDispatch,
  setIsLoading?: (isLoading: boolean) => void
) => {
  setIsLoading?.(true);
  try {
    const response = await fetch(
      `${db}/user/notifications?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('token')}`,
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      return json.data;
    }
    return dispatch?.(showNotification({ message: 'Failed to load notifications', type: "error" }));
  } catch {
    return dispatch?.(showNotification({ message: 'Failed to load notifications', type: "error" }));
  } finally {
    setIsLoading?.(false);
  }
};

export const getUnreadCountApi = async () => {
  try {
    const response = await fetch(`${db}/user/notifications/unread-count`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('token')}`,
      },
    });
    const json = await response.json();
    if (json.success) {
      return json.data.unread;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export const markAllNotificationsReadApi = async (dispatch?: AppDispatch) => {
  try {
    const response = await fetch(`${db}/user/notifications/read-all`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('token')}`,
      },
    });
    const json = await response.json();
    if (json.success) {
      dispatch?.(showNotification({ message: 'All notifications marked as read', type: "success" }));
      return json.data;
    }
    return dispatch?.(showNotification({ message: 'Failed to mark notifications as read', type: "error" }));
  } catch {
    return dispatch?.(showNotification({ message: 'Failed to mark notifications as read', type: "error" }));
  }
};

export const markNotificationReadApi = async (
  notificationId: string,
  dispatch?: AppDispatch
) => {
  try {
    const response = await fetch(
      `${db}/user/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('token')}`,
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      return json.success;
    }
    return dispatch?.(showNotification({ message: 'Failed to mark notification as read', type: "error" }));
  } catch {
    return dispatch?.(showNotification({ message: 'Failed to mark notification as read', type: "error" }));
  }
};
