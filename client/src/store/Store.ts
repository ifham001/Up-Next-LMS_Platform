import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/common/notification-slice";
import userAuthReducer from "./slices/user/userAuth-slice";
import addToCartReducer from "./slices/user/addToCart-slice";

const store = configureStore({
  reducer: {
    notification: notificationReducer.reducer,
    userAuth: userAuthReducer.reducer,
    addToCart:addToCartReducer.reducer

  },
});

export default store;   
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;