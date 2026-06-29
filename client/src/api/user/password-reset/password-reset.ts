import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
const db = process.env.NEXT_PUBLIC_API_URL;

interface VerifyResetOtpData {
  verified: boolean;
}

interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  role?: "user" | "admin";
}

export const requestPasswordResetApi = async (
  email: string,
  dispatch: AppDispatch,
  setIsLoading?: (isLoading: boolean) => void
) => {
  setIsLoading?.(true);
  try {
    const response = await fetch(`${db}/user/password/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const json = await response.json();
    if (json.success) {
      dispatch(
        showNotification({
          message: json.message || "If the email exists, a reset code has been sent",
          type: "success",
        })
      );
      return json.success;
    }
    return dispatch(
      showNotification({ message: "Failed to request password reset", type: "error" })
    );
  } catch {
    return dispatch(
      showNotification({ message: "Failed to request password reset", type: "error" })
    );
  } finally {
    setIsLoading?.(false);
  }
};

export const verifyResetOtpApi = async (
  email: string,
  otp: string,
  dispatch: AppDispatch,
  setIsLoading?: (isLoading: boolean) => void
) => {
  setIsLoading?.(true);
  try {
    const response = await fetch(`${db}/user/password/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const json = await response.json();
    if (json.success) {
      dispatch(
        showNotification({
          message: json.message || "OTP verified successfully",
          type: "success",
        })
      );
      return json.data as VerifyResetOtpData;
    }
    return dispatch(
      showNotification({ message: "Failed to verify OTP", type: "error" })
    );
  } catch {
    return dispatch(
      showNotification({ message: "Failed to verify OTP", type: "error" })
    );
  } finally {
    setIsLoading?.(false);
  }
};

export const resetPasswordApi = async (
  payload: ResetPasswordPayload,
  dispatch: AppDispatch,
  setIsLoading?: (isLoading: boolean) => void
) => {
  setIsLoading?.(true);
  try {
    const response = await fetch(`${db}/user/password/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (json.success) {
      dispatch(
        showNotification({
          message: json.message || "Password reset successfully",
          type: "success",
        })
      );
      return json.success;
    }
    return dispatch(
      showNotification({ message: "Failed to reset password", type: "error" })
    );
  } catch {
    return dispatch(
      showNotification({ message: "Failed to reset password", type: "error" })
    );
  } finally {
    setIsLoading?.(false);
  }
};
