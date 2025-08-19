import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        message: "",
        type: "",
     },
     reducers:{
        showNotification: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        hideNotification: (state) => {
            
            state.message = "";
            state.type = "";
        }
       
     }


     
})
export default notificationSlice;
export const { showNotification, hideNotification } = notificationSlice.actions;