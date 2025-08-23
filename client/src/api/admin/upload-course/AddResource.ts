import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;





export const addResourcesApi = async(formData:FormData,dispatch:AppDispatch,setIsLoading: (isLoading: boolean) => void,sectionId:string)=>{
    setIsLoading(true)
    try {
        const res = await fetch(`${db}/admin/add-resource/${sectionId}`,{
            method:"POST",
            body:formData,
            
            headers:{
            
                  "Authorization": `Bearer ${Cookies.get('admin-token')}`,
            }
        })
        const data = await res.json()
     
        if(data.success){
            return dispatch(showNotification({message:"resources add Successfully", type:"success"}))
        }
        else{
            return dispatch(showNotification({message:"something went wrong ", type:"error"}))

        }
    } catch {
        return dispatch(showNotification({message:"something went wrong ", type:"error"}))

    }
    finally{
        setIsLoading(false)
    }


} 