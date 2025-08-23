import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";


const db = process.env.NEXT_PUBLIC_API_URL;



export const getlifeTimeCourseDetailApi = async(dispatch:AppDispatch,setIsLoading: (isLoading: boolean) => void)=>{
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/course-life-time-details`,{
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('admin-token')}`,
            }
        })
        const data = await response.json()
        if(!response.ok){
            return dispatch(showNotification({message:'failed to fetch course details',type:'error'}))
        }
        if(!data.success){
            return dispatch(showNotification({message:'failed to fetch course details',type:'error'}))
        }
        return data
       
    } catch {
       
        return dispatch(showNotification({message:'failed to fetch course details',type:'error'}))
    }
    finally{
        setIsLoading(false)
    }
}



export const archieveCourseApi = async (courseId:string,dispatch:AppDispatch,setIsLoading: (isLoading: boolean) => void)=>{
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/archieve-course/${courseId}`)
        const data = await response.json()

        if(data.success){
    return dispatch(showNotification({message:'course archieve successfully ', type :'success'}))}

    return dispatch(showNotification({messsage:'something goes wrong try again!' ,type:'success'}))
    } catch (error) {
        return dispatch(showNotification({messsage:'something goes wrong try again!' ,type:'success'}))

    }
    finally{
        setIsLoading(false)
    }
}

export const deleteCourseApi = async (courseId:string ,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
    setIsLoading(true)
    try {
      const res = await fetch(`${db}/admin/delete-course/${courseId}`,{
        method:"DELETE"
      })
      const data = await res.json()
      if(data.success){
        dispatch(showNotification({message:'course delete successfully',type:'success'}))
        return data
      }
      dispatch(showNotification({message:'failed first try delete all section then try again',type:'error'}))

    } catch {
     return  dispatch(showNotification({message:'course delete went wrong try again!',type:'error'}))

    }
    finally{
      setIsLoading(false)
    }
  }
export  const updatePriceCourseApi = async (courseId:string,updatedPrice:number ,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
    setIsLoading(true)
    try {
        const response= await fetch(`${db}/admin/update-course-price/${courseId}`,
            {
                method:"POST",
                body:JSON.stringify(updatedPrice),
                headers:{
                    "Content-type":"application/json"
                }
            })
        const data = await response.json()
            if(data.success){
                return dispatch(showNotification({message:'Price updated successfully',type:"success"}))
            }
            return dispatch(showNotification({message:'Price updated failed',type:"error"}))

    } catch (error) {
        return dispatch(showNotification({message:'Price updated failed',type:"error"}))

    }
    finally{
        setIsLoading(false)
    }
}