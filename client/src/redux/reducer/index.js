import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice"
import profileSlice from "../slices/profileSlice";
import cartSlice from "../slices/cartSlice";
import courseSlice from "../slices/courseSlice";
import recommendationSlice from "../slices/recommendationSlice";
import viewCourseSlice from "../slices/viewCourseSlice";
const rootreducer = combineReducers({
    auth:authSlice,
    profile:profileSlice,
    cart:cartSlice,
    course:courseSlice,
    recommendation:recommendationSlice,
    viewCourse:viewCourseSlice
})
export default rootreducer
