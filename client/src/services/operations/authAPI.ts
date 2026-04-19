import { toast } from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";

import type { AppDispatch } from "../../redux/store";
import type { AccountType, User } from "../../types/domain";
import { setLoading, setToken } from "../../redux/slices/authSlice";
import { resetCart } from "../../redux/slices/cartSlice";
import { setUser } from "../../redux/slices/profileSlice";
import {
  resetRecommendedCourses,
  setRecommendedCourses,
} from "../../redux/slices/recommendationSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { fetchRecommendedCourseCards } from "./catalogAPI";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

interface ApiSuccessResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
}

interface AxiosLikeError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const err = error as AxiosLikeError;
  return err?.response?.data?.message ?? err?.message ?? fallback;
}

interface LoginResponseData extends ApiSuccessResponse {
  token: string;
  user: User;
}

export function sendOtp(email: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector<ApiSuccessResponse>(
        "POST",
        SENDOTP_API,
        { email }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send OTP"));
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType: AccountType,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  otp: string,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector<ApiSuccessResponse>(
        "POST",
        SIGNUP_API,
        {
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "Signup failed"));
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(
  email: string,
  password: string,
  navigate: NavigateFunction
) {
  return async function (dispatch: AppDispatch) {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector<LoginResponseData>(
        "POST",
        LOGIN_API,
        {
          email,
          password,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      dispatch(setLoading(false));
      toast.dismiss(toastId);
      navigate("/dashboard/my-profile");

      if (response?.data?.user?.accountType === "student") {
        fetchRecommendedCourseCards(response.data.token)
          .then((recommendedCourses) => {
            dispatch(setRecommendedCourses(recommendedCourses));
          })
          .catch(() => {
            dispatch(setRecommendedCourses([]));
          });
      } else {
        dispatch(resetRecommendedCourses());
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
      dispatch(setLoading(false));
      toast.dismiss(toastId);
      return;
    }
  };
}

export function logout(navigate: NavigateFunction) {
  return (dispatch: AppDispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    dispatch(resetRecommendedCourses());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

export function getPasswordResetToken(
  email: string,
  setEmailSent: (value: boolean) => void
) {
  return async function (dispatch: AppDispatch) {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector<ApiSuccessResponse>(
        "POST",
        RESETPASSTOKEN_API,
        { email }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send reset email"));
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(
  password: string,
  confirmPassword: string,
  resetPasswordToken: string,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector<ApiSuccessResponse>(
        "POST",
        RESETPASSWORD_API,
        {
          password,
          confirmPassword,
          resetPasswordToken,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password reset successfully");
      navigate("/login");
    } catch {
      toast.error("Link Expired Try Again");
    }
    dispatch(setLoading(false));
  };
}
