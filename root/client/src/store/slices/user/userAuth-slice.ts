import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


const getToken = () => {
    const token = Cookies.get("token");
    return token;
}
const getUserId = ()=>{
    const userId = Cookies.get("userId")
    return userId
}
const initialState = {
    userId:getUserId()||'',
    token: getToken()||'',
    username: null,
}

export interface UserAuthState {
    
    token: string;
    username: string;
    userId:string
}

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            if(action.payload.token){
                Cookies.set("token", action.payload.token);
                Cookies.set("userId",action.payload.user.id)
            }
            state.userId = action.payload.user.id;
            state.token = action.payload.token;
            state.username = action.payload.user.name;
        },
        userLogout: (state) => {
            Cookies.remove("token");
            Cookies.remove("userId");
            state.userId = '';
            state.token = '';
            state.username = null;
        }
        
    },
})

export const { userLogin, userLogout } = userAuthSlice.actions;
export default userAuthSlice;