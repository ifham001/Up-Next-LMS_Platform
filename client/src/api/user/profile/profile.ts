import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export const getMyProfileApi = async (dispatch?: AppDispatch, setIsLoading?: (isLoading: boolean) => void) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/profile`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json = await response.json();
        if (json.success) {
            return json.data?.profile;
        }
        return dispatch?.(showNotification({ message: 'Failed to load profile', type: "error" }));
    } catch {
        return dispatch?.(showNotification({ message: 'Failed to load profile', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const updateProfileApi = async (name: string, dispatch: AppDispatch, setIsLoading?: (isLoading: boolean) => void) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({ name }),
        });
        const json = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message || 'Profile updated successfully', type: "success" }));
            return json.data?.profile;
        }
        return dispatch(showNotification({ message: 'Failed to update profile', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to update profile', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const changePasswordApi = async (payload: ChangePasswordPayload, dispatch: AppDispatch, setIsLoading?: (isLoading: boolean) => void) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/profile/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify(payload),
        });
        const json = await response.json();
        if (json.success) {
            dispatch(showNotification({ message: json.message || 'Password changed successfully', type: "success" }));
            return json.success;
        }
        return dispatch(showNotification({ message: 'Failed to change password', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to change password', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};
