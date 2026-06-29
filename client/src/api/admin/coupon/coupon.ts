import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface CreateCouponPayload {
    code: string;
    discountType: "percent" | "fixed";
    value: number;
    maxRedemptions?: number | null;
    perUserLimit?: number;
    courseId?: string | null;
    expiresAt?: string | null;
}

export const createCouponApi = async (
    payload: CreateCouponPayload,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/admin/coupons`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify(payload)
        })
        const json = await response.json()
        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Coupon created successfully', type: "success" }))
            return json.data
        }
        return dispatch(showNotification({ message: json.message ?? 'Failed to create coupon', type: "error" }))
    } catch {
        return dispatch(showNotification({ message: 'Failed to create coupon', type: "error" }))
    }
    finally {
        setIsLoading?.(false)
    }
}

export const listCouponsApi = async (
    dispatch?: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/admin/coupons`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            }
        })
        const json = await response.json()
        if (json.success) {
            return json.data.coupons
        }
        return dispatch?.(showNotification({ message: json.message ?? 'Failed to load coupons', type: "error" }))
    } catch {
        return dispatch?.(showNotification({ message: 'Failed to load coupons', type: "error" }))
    }
    finally {
        setIsLoading?.(false)
    }
}

export const setCouponActiveApi = async (
    couponId: string,
    active: boolean,
    dispatch: AppDispatch,
    setIsLoading?: (isLoading: boolean) => void
) => {
    setIsLoading?.(true);
    try {
        const response = await fetch(`${db}/admin/coupons/${couponId}/active`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({ active })
        })
        const json = await response.json()
        if (json.success) {
            dispatch(showNotification({ message: json.message ?? 'Coupon updated successfully', type: "success" }))
            return json.data
        }
        return dispatch(showNotification({ message: json.message ?? 'Failed to update coupon', type: "error" }))
    } catch {
        return dispatch(showNotification({ message: 'Failed to update coupon', type: "error" }))
    }
    finally {
        setIsLoading?.(false)
    }
}
