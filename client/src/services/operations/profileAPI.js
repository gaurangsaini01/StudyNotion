import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
const {GET_USER_ENROLLED_COURSES_API} = profileEndpoints;

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    toast.error("Could Not Get Enrolled Courses");
  }
  toast.dismiss(toastId);
  return result;
}
