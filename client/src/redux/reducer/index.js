import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice"
import profileSlice from "../slices/profileSlice";
import cartSlice from "../slices/cartSlice";
const rootreducer = combineReducers({
    auth:authSlice,
    profile:profileSlice,
    cart:cartSlice
})
export default rootreducer