import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

type IPurchaseDetail = {
  name: string;
  userId: string;
  address: string;
  city: string;
  state: string;
  zip_code: number;
  pricePaid: number;
  payment_mode: string;
  purchased_courses: string[];
};

export const checkoutApi = async (
  data: IPurchaseDetail,
  dispatch: AppDispatch,
  setIsLoading: (isLoading: boolean) => void
) => {
  setIsLoading(true);
  try {
    const response = await fetch(`${db}/user/purchase-items`, {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('token')}`,
    },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (resData.success) {

      dispatch(showNotification({ message: "Course purchased successfully!", type: "success" }))
      return resData
    } else {
      dispatch(showNotification({ message: resData.message || "Failed to purchase course, try again!", type: "error" }));
    }
  } catch {
    
    dispatch(showNotification({ message: "Failed to purchase course, try again!", type: "error" }));
  } finally {
    setIsLoading(false);
  }
};
