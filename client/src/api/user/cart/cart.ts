import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;



export const addToCartApi = async(userId:string,courseId:string,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
    setIsLoading(true)
   
try {
    const response = await  fetch(`${db}/user/add-to-cart`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('token')}`,
        },
        body:JSON.stringify({courseId,userId})
    })
    const data = await response.json()
    

    if(data.success){
        
        dispatch(showNotification({message:data.message,type:"success"}))
        return data.success
    }

    

    
    return dispatch(showNotification({message:'Failed to add Course to cart',type:"error"}))

} catch (error) {
    return dispatch(showNotification({message:'Failed to add Course to cart',type:"error"}))

}
finally{
 setIsLoading(false)
}
}
export const showCartItemApi =async (userId:string,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
    setIsLoading(true)
    try {
        const response = await  fetch(`${db}/user/get-cart-item/${userId}`,{
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('token')}`,
            }
        },)
        const data = await response.json()
        if(data.success){
           
            
            return data.items
        }
        return dispatch(showNotification({message:'Failed to add Course to cart',type:"error"}))
    
    } catch (error) {
        return dispatch(showNotification({message:'Failed to add Course to cart',type:"error"}))
    
    }
    finally{
     setIsLoading(false)
    }
}
export const deleteItemApi =async (cartItemId:string,dispatch:AppDispatch,setIsLoading:(isLoading:boolean)=>void)=>{
    setIsLoading(true)
    try {
        const response = await  fetch(`${db}/user/delete-cart-item/${cartItemId}`,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('token')}`,
            }
        })
        const data = await response.json()
        if(data.success){
            dispatch(showNotification({message:'Item remove successfully',type:"success"}))
            return data.success
        } 
        
        return dispatch(showNotification({message:'Failed to remove item to cart',type:"error"}))
    
    } catch (error) {
        return dispatch(showNotification({message:'Failed to remove item to cart',type:"error"}))
    
    }
    finally{
     setIsLoading(false)
    }
}