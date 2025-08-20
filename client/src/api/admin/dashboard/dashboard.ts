import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";

const db = process.env.NEXT_PUBLIC_API_URL;
import Cookies from 'js-cookie'



export const getDashBoardDataApi = async(dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/dashboard`,{
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('admin-token')}`,
            }
        })
        const data = await response.json()
        if(!response.ok){
            return dispatch(showNotification({message:'something went wrong',type:'error'}))
        }
        if(!data.success){
            return dispatch(showNotification({message:'something went wrong',type:'error'}))

        }
        return data
    } catch (error) {
        console.log(error)
        return dispatch(showNotification({message:'failed to fetch',type:'error'}))
    }
    finally{
        setIsLoading(false)
    }
}