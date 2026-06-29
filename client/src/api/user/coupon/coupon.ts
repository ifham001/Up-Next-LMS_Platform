import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const applyCouponApi = async (
  code: string,
  dispatch: AppDispatch,
  setIsLoading?: (isLoading: boolean) => void
) => {
  setIsLoading?.(true);
  try {
    const response = await fetch(`${db}/user/coupons/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({ code }),
    });
    const json: ApiEnvelope<unknown> = await response.json();
    if (json.success) {
      dispatch(showNotification({ message: json.message ?? 'Coupon applied successfully', type: "success" }));
      return json.data;
    }
    return dispatch(showNotification({ message: json.message ?? 'Failed to apply coupon', type: "error" }));
  } catch {
    return dispatch(showNotification({ message: 'Failed to apply coupon', type: "error" }));
  } finally {
    setIsLoading?.(false);
  }
};
