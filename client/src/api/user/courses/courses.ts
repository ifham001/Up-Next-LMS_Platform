import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";

const db = process.env.NEXT_PUBLIC_API_URL;



export const fetchCourseById = async (courseId:string,dispatch:AppDispatch,setIsLoading: (isLoading: boolean) => void)=>{
setIsLoading(true)
try {
    const response = await fetch (`${db}/user/get-course/${courseId}`)
    const data = await response.json()

    if(!data.success){
      return  dispatch(showNotification({message:'fetching course failed try again', type:"error"}))
    }
    return data.course
    
} catch  {
    return  dispatch(showNotification({message:'fatching course failed try again', type:"error"}))

}
finally{
    setIsLoading(false)
}
}


export const getAllCoursesApi = async (dispatch:AppDispatch,setIsLoading: (isLoading: boolean) => void)=>{
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/user/get-all-courses`)
        const data = await response.json()

        if(!data.success){
            return dispatch(showNotification({message:'failed to fetch course or courses not found ', type :'error'}))
        }
        return data.course
    } catch {
        return dispatch(showNotification({message:'failed to fetch course or courses not found ', type :'error'}))

    }
    finally{
        setIsLoading(false)
    }

}