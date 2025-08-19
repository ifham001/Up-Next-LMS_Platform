import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;


export const getUserCourseApi = async(userId:string,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>
    {   
        setIsLoading(true)
        try {
            const response = await fetch(`${db}/user/user-courses/${userId}`,{
                headers:{
                    "Content-Type": "application/json",
                      "Authorization": `Bearer ${Cookies.get('token')}`,
                }
            })
            const data = await response.json()
            if(data.success){
                return data
            }
            return []
        } catch (error) {
            return dispatch(showNotification({message:'failed to fetch course',type:'error'}))
        }
        finally{
            setIsLoading(false)
        }
    }
    export const getCourseContentApi = async(userId:string,courseId:string,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
        setIsLoading(true)
        try {
            const response = await fetch(`${db}/user/course-content`,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                      "Authorization": `Bearer ${Cookies.get('token')}`,
                },
                body:JSON.stringify({userId,courseId})
            })
            const data =await  response.json()
            if(data.success){
                return data
            }
            return dispatch(showNotification({message:'section item list not found '}))
          
        } catch (error) {
            console.log(error)
            return dispatch(showNotification({message:"failed to fetch section item",type:"error"}))
        }
        finally{
            setIsLoading(false)
        }
    }

    export const getSelectedItemApi = async(itemId:string,dispatch:AppDispatch)=>{

        
        try {
            const response = await fetch(`${db}/user/course-content/${itemId}`,{
                headers:{
                    "Content-Type": "application/json",
                      "Authorization": `Bearer ${Cookies.get('token')}`,
                }
            })
            const data =await  response.json()
            if(data.success){
                return data
            }
        
            return dispatch(showNotification({message:'section item list not found '}))
          
        } catch (error) {
            console.log(error)
            return dispatch(showNotification({message:"failed to fetch section item",type:"error"}))
        }
        
    } 