import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartslice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});