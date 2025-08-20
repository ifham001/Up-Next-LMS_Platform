// api/user/resource/resourceApi.ts
import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";

const db = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";

export const getResourcesApi = async (resourceId: string) => {
    try {
      const res = await fetch(`${db}/user/get-resource/${resourceId}`,{
        headers:{
            "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('token')}`,
        }
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        return { success: false, data: [], message: data.message || "Failed to fetch resources" };
      }
  
      return { success: true, data: data.data };
    } catch (error: any) {
      console.error("Error fetching resources:", error);
      return { success: false, data: [], message: error.message || "Internal error" };
    }
  };
  