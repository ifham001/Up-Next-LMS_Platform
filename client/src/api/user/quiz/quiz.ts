// api/user/quiz/quizApi.ts

import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;


export const getQuizApi = async (quizId: string) => {
    try {
      const res = await fetch(`${db}/user/get-quiz/${quizId}`,{
        headers:{
            "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('token')}`,
        }
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, data: null, message: data.message || "Failed to fetch quiz" };
      }
  
      return { success: true, data: data.data };
    } catch  {
     
      return { success: false, data: null, message:"Internal error" };
    }
  };
  