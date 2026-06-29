import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

export const addToWishlistApi = async (
    courseId: string,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/wishlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({ courseId }),
        });
        const json = await response.json();

        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Added to wishlist', type: "success" }));
            return json.data;
        }

        return dispatch(showNotification({ message: 'Failed to add course to wishlist', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to add course to wishlist', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const getWishlistApi = async (
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/wishlist`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json = await response.json();

        if (json.success) {
            return json.data?.items;
        }

        return dispatch(showNotification({ message: 'Failed to load wishlist', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to load wishlist', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};

export const removeFromWishlistApi = async (
    courseId: string,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/user/wishlist/${courseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
        });
        const json = await response.json();

        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Removed from wishlist', type: "success" }));
            return json.success;
        }

        return dispatch(showNotification({ message: 'Failed to remove course from wishlist', type: "error" }));
    } catch {
        return dispatch(showNotification({ message: 'Failed to remove course from wishlist', type: "error" }));
    } finally {
        setIsLoading?.(false);
    }
};
