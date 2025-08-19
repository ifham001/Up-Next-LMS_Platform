import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;


export const getuserCourseVideoApi = async(userCourseId:string,videoId:string,dispatch:AppDispatch)=>{
    try {
        const response = await fetch(`${db}/user/get-video-with-progress`,{
            method:"POST",
            body:JSON.stringify({userCourseId,videoId}),
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('token')}`,
            }
        })
        const data =await  response.json()
   
        if(data.success){
            return data
        }
    } catch (error) {
        return dispatch(showNotification({message:'something went wrong while fetching video',type:error}))
    }
}

export const updateVideoProgressApi = async(userCourseId:string,videoId:string,watchedSeconds:number)=>{
    try {
      const response =   await fetch(`${db}/user/add-progress-to-video`,{
            method:"POST",
            body:JSON.stringify({userCourseId,videoId,watchedSeconds}),
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('token')}`,
            }
        })
        const data = await response.json()
      
    } catch (error) {
    return alert('cannnot aupdate progress')
    }
}