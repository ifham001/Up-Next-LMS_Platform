import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface AddNotePayload {
    videoId: string;
    timestampSeconds?: number;
    content: string;
}

interface EditNotePayload {
    content?: string;
    timestampSeconds?: number;
}

export const addNoteApi = async (
    payload: AddNotePayload,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({
                videoId: payload.videoId,
                timestampSeconds: payload.timestampSeconds ?? 0,
                content: payload.content,
            }),
        });
        const json = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Note added successfully', type: "success" }));
            return json.data;
        }
        return dispatch(showNotification({ message: 'Failed to add note', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to add note', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const getVideoNotesApi = async (
    videoId: string,
    dispatch?: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/notes/${videoId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json = await response.json();
        if (json.success) {
            return json.data?.notes;
        }
        return dispatch?.(showNotification({ message: 'Failed to fetch notes', type: "error" }));
    } catch {
        return dispatch?.(showNotification({ message: 'Failed to fetch notes', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const editNoteApi = async (
    noteId: string,
    payload: EditNotePayload,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/notes/${noteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify(payload),
        });
        const json = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Note updated successfully', type: "success" }));
            return json.data;
        }
        return dispatch(showNotification({ message: 'Failed to update note', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to update note', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const removeNoteApi = async (
    noteId: string,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/notes/${noteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Note removed successfully', type: "success" }));
            return json.success;
        }
        return dispatch(showNotification({ message: 'Failed to remove note', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to remove note', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};
