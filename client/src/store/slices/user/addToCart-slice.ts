import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Items = {
  title: string;
  tagline: string;
  price: number;
  url: string;
  id: string;
  courseId: string;
};

export interface UserAuthState {
  items: Items[];
  forNotification: boolean;
}

const initialState: UserAuthState = {
  items: [],
  forNotification:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cartItemNotification") || "false")
      : false,
};

const addToCartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Items>) => {
      state.items.push(action.payload);
      state.forNotification = true;
      localStorage.setItem("cartItemNotification", JSON.stringify(true));
    },
    deleteItemToCart: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      if(state.items =[]){
        state.forNotification = false;
        localStorage.removeItem("cartItemNotification");
      }
    },
    setCart: (state, action: PayloadAction<Items[]>) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.forNotification = false;
      localStorage.removeItem("cartItemNotification");
    },
    resetNotification: (state) => {
      state.forNotification = false;
      localStorage.removeItem("cartItemNotification");
    },
  },
});

export const {
  addToCart,
  deleteItemToCart,
  setCart,
  clearCart,
  resetNotification,
} = addToCartSlice.actions;

export default addToCartSlice;
