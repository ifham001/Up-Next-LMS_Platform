import { showNotification } from "@/store/slices/common/notification-slice";
import { userLogin } from "@/store/slices/user/userAuth-slice";
import { AppDispatch } from "@/store/Store";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface User {
    name?: string;
    email: string;
    password: string;
}


export const createUser = async (user: User,dispatch: AppDispatch,setIsLoading: (isLoading: boolean) => void) => {
    try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/user/create-user`, {
            method: "POST",
            body: JSON.stringify(
                {name:user.name,
                email:user.email,
                password:user.password,
                auth_type:"email",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if(data.user){
         dispatch(showNotification({
            message: "User created successfully",
            type: "success",
         }));
       
            return data;
        }
       return dispatch(showNotification({
            message: "Failed to create user",
            type: "error",
        }));
       


    } catch (error) {
        return dispatch(showNotification({
            message: "Failed to create user",
            type: "error",
        }));

        
    }
    finally {
        setIsLoading(false);
    }
    
};
export const loginUser = async (user: User,dispatch: AppDispatch,setIsLoading: (isLoading: boolean) => void) => {
    try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/user/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if(data.token){
            dispatch(showNotification({
                message: "Login successful",
                type: "success",
            }));
            dispatch(userLogin(data));
           return data
        }

        return dispatch(showNotification({
            message: "Failed to login",
            type: "error",
        }));
        
       

    } catch (error) {
        return dispatch(showNotification({
            message: "Failed to login",
            type: "error",
        }));
       
    }
    finally {
        setIsLoading(false);
    }
}