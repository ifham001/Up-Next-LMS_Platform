import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";

const db = process.env.NEXT_PUBLIC_API_URL;


export const getAllUsersDetails = async(dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/all-users`,{
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('admin-token')}`,
            }
        })
        const data = await response.json()
        if(!response.ok){
            return dispatch(showNotification({message:'Cannot fetch users data',type:'error'}))
        }
        if(!data.success){
            return dispatch(showNotification({message:'Cannot fetch users data',type:'error'}))

        }
        return data
    } catch  {
        
        return dispatch(showNotification({message:'Cannot fetch users data',type:'error'}))

    }
    finally{
        setIsLoading(false)
    }
}