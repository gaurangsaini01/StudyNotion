import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: localStorage.getItem("recommendedCourses")
    ? JSON.parse(localStorage.getItem("recommendedCourses"))
    : [],
};

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    setRecommendedCourses(state, action) {
      state.courses = action.payload;
      localStorage.setItem(
        "recommendedCourses",
        JSON.stringify(action.payload)
      );
    },
    resetRecommendedCourses(state) {
      state.courses = [];
      localStorage.removeItem("recommendedCourses");
    },
  },
});

export const { setRecommendedCourses, resetRecommendedCourses } =
  recommendationSlice.actions;
export default recommendationSlice.reducer;
