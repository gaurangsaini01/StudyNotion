import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { Course } from "../../types/domain";

export interface RecommendationState {
  courses: Course[];
}

const initialState: RecommendationState = {
  courses: localStorage.getItem("recommendedCourses")
    ? (JSON.parse(localStorage.getItem("recommendedCourses") as string) as Course[])
    : [],
};

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    setRecommendedCourses(state, action: PayloadAction<Course[]>) {
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
