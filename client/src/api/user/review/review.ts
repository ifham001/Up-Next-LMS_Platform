import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface SubmitReviewPayload {
    courseId: string;
    rating: number;
    comment?: string;
}

export const submitReviewApi = async (
    payload: SubmitReviewPayload,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify(payload),
        });
        const json = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message || 'Review submitted successfully', type: "success" }));
            return json.data;
        }
        return dispatch(showNotification({ message: 'Failed to submit review', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to submit review', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const getOwnReviewApi = async (
    courseId: string,
    dispatch?: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/reviews/${courseId}/me`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json = await response.json();
        if (json.success) {
            return json.data;
        }
        return dispatch?.(showNotification({ message: 'Failed to fetch your review', type: "error" }));
    } catch {
        return dispatch?.(showNotification({ message: 'Failed to fetch your review', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const getCourseReviewsApi = async (
    courseId: string,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/reviews/${courseId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        if (json.success) {
            return json.data;
        }
        return undefined;
    } catch {
        return undefined;
    } finally {
        setIsLoading?.(false);
    }
};

export const deleteReviewApi = async (
    courseId: string,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/reviews/${courseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message || 'Review deleted successfully', type: "success" }));
            return json.success;
        }
        return dispatch(showNotification({ message: 'Failed to delete review', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to delete review', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};
