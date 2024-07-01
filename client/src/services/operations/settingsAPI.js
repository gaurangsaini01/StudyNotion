import { settingsEndpoints } from "../apis";
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiconnector";

import {toast} from "react-hot-toast"
const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;


export function updateProfile(token, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {

        const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
          Authorization: `Bearer ${token}`,
        })
        console.log("UPDATE_PROFILE_API API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        localStorage.setItem("user", JSON.stringify(response.data.userUpdatedDetails));
        dispatch(
          setUser(response.data.userUpdatedDetails)
        )

        toast.success("Profile Updated Successfully")
      } catch (error) {
        console.log("UPDATE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Update Profile")
      }
      toast.dismiss(toastId)
    }
  }