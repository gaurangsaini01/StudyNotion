import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SignupData = Record<string, unknown> | null;

export interface AuthState {
  signupData: SignupData;
  loading: boolean;
  token: string | null;
}

const initialState: AuthState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token")
    ? (JSON.parse(localStorage.getItem("token") as string) as string | null)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload));
    },
    setSignupData(state, action: PayloadAction<SignupData>) {
      state.signupData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setToken, setLoading, setSignupData } = authSlice.actions;
export default authSlice.reducer;
