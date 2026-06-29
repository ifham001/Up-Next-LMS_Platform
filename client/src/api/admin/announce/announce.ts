import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface AnnounceCoursePayload {
    courseId: string;
    title: string;
    body: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export const announceCourseApi = async (
    payload: AnnounceCoursePayload,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/admin/announce`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify(payload),
        });
        const json: ApiResponse<{ recipients: number }> = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Announcement sent successfully', type: "success" }));
            return json.data;
        }
        return dispatch(showNotification({ message: json.message ?? 'Failed to send announcement', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to send announcement', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};
