import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;
export const orderConfirmationApi = async (
  userId: string,
  orderId: string,
  dispatch: AppDispatch,
  setIsLoading:(isLoading:boolean)=>void
) => {
  try {
    const response = await fetch(`${db}/user/order-confirmation`, {
      method: "POST",
      body: JSON.stringify({ userId, orderId }),
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('token')}`,
    }
    });

    const resData = await response.json();

    if (!resData.success) {
      return dispatch(
        showNotification({ message: "Cannot make order!", type: "error" })
      );
     
    }
    return resData
  } catch {
    dispatch(
      showNotification({ message: "Error fetching order confirmation", type: "error" })
    );
    return null;
  }
};
