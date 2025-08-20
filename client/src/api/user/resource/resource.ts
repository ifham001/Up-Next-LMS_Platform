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
    } catch {
     
      return { success: false, data: [], message:  "Internal error" };
    }
  };
  