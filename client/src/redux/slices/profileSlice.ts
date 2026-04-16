import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { User } from "../../types/domain";

export interface ProfileState {
  user: User | null;
  loading: boolean;
}

const initialState: ProfileState = {
  user: localStorage.getItem("user")
    ? (JSON.parse(localStorage.getItem("user") as string) as User)
    : null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
