import { toast } from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";

import type { AppDispatch } from "../../redux/store";
import type { User } from "../../types/domain";
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
  userDetails?: User;
}

interface AxiosLikeError {
  response?: { data?: { message?: string } };
  message?: string;
}

function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const err = error as AxiosLikeError;
  return err?.response?.data?.message ?? err?.message ?? fallback;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword?: string;
}

export async function changePasswordService(
  _token: string,
  formData: ChangePasswordPayload
): Promise<void> {
  const toastId = toast.loading("Changing...");
  try {
    const response = await apiConnector<ApiResponse>(
      "PUT",
      CHANGE_PASSWORD_API,
      formData
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password changed Successfully");
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
}

export function updateDisplayPicture(_token: string, formData: FormData) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector<ApiResponse<User>>(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Display Picture Updated Successfully");

      if (response.data.data) {
        dispatch(setUser(response.data.data));
      }
    } catch {
      toast.error("Could Not Update Display Picture");
    }
    toast.dismiss(toastId);
  };
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  about?: string;
  contactNumber?: string;
  gender?: string;
}

export function updateProfile(_token: string, formData: ProfileUpdatePayload) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector<ApiResponse>(
        "PUT",
        UPDATE_PROFILE_API,
        formData
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      if (response.data.userDetails) {
        dispatch(setUser(response.data.userDetails));
      }

      toast.success("Profile Updated Successfully");
    } catch {
      toast.error("Could Not Update Profile");
    }
    toast.dismiss(toastId);
  };
}

export function deleteProfile(_token: string, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector<ApiResponse>(
        "DELETE",
        DELETE_PROFILE_API
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch {
      toast.error("Could Not Delete Profile");
    }
    toast.dismiss(toastId);
  };
}
