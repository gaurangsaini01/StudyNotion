import { settingsEndpoints } from "../apis";
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiconnector";
import {logout} from "../operations/authAPI"

import { toast } from "react-hot-toast";
const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export async function changePasswordService(token,formData){
    const toastId = toast.loading("Changing...");
    try {
      const response = await apiConnector(
        "PUT",
        CHANGE_PASSWORD_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      )
     

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Password changed Successfully") 

    } catch (error) {
      toast.error(error.response.data.message)
    }
    toast.dismiss(toastId);
  }

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
   
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully") 

      dispatch(setUser(response.data.data))
    } catch (error) {
      
      toast.error("Could Not Update Display Picture")
    }
    toast.dismiss(toastId)
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });
    

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setUser(response.data.userDetails));

      toast.success("Profile Updated Successfully");
    } catch (error) {
     
      toast.error("Could Not Update Profile");
    }
    toast.dismiss(toastId);
  };
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
     

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      
      toast.error("Could Not Delete Profile");
    }
    toast.dismiss(toastId);
  };
}
