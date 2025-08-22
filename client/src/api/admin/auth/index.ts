import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";

const db = process.env.NEXT_PUBLIC_API_URL;


export const adminLogin = async(email:string,password:string,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
setIsLoading(true)
try {
    const response = await fetch(`${db}/admin/login`,{
        method:'POST',
        body :JSON.stringify({email,password}),
        headers:{
            'Content-type':'application/json'
        }
    })
    const data = await response.json()
    if(!response.ok){
        return dispatch(showNotification({message:'Failed to login',type:'error'}))
    }
    if(!data.success){
        return dispatch(showNotification({message:'Failed to login',type:'error'}))

    }
    Cookies.set('admin-token',data.token)
    return data.success
} catch (error) {

    return dispatch(showNotification({message:'Internal server Error',type:'error'}))

}
finally{
    setIsLoading(false)
}
}