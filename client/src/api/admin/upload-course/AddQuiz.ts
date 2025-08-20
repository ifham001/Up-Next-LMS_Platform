import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import { Quiz } from "@/component-admin/add-new-course/new-section/QuizBuilder";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;


export const createQuizApi = async (sectionId: string, quiz: Quiz, dispatch: AppDispatch, setIsLoading: (isLoading: boolean) => void) => {
  setIsLoading(true)
  try {
    const res = await fetch(`${db}/admin/create-quiz/${sectionId}`,{
      method: "POST",
      body: JSON.stringify(quiz),
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('admin-token')}`,
    }
    }   )
    const quizData = await res.json()
    if(quizData){
        dispatch(showNotification({message:"Quiz created successfully",type:"success"}))
        return quizData
    }else{
        return dispatch(showNotification({message:"Failed to create quiz",type:"error"}))
    }
  }
  finally{
    setIsLoading(false)
  }
}





