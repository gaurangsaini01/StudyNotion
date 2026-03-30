import toast from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
const { CATEGORY_PAGE_DETAILS_API, GET_ALL_RECOMMENDED_COURSES } =
  courseEndpoints;

export async function getCatalogPageData(categoryId) {
  let result = null;
  const toastId = toast.loading("loading...");
  try {
    const response = await apiConnector("POST", CATEGORY_PAGE_DETAILS_API, {
      categoryId,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not get Category page Details");
    }
    result = response?.data?.data;
  } catch (err) {}
  toast.dismiss(toastId);
  return result;
}

export async function getAllRecomenddedCourses() {
  let result = null;
  const toastId = toast.loading("loading...");
  try {
    const res = await apiConnector("GET", GET_ALL_RECOMMENDED_COURSES);
    if (!response?.data?.success) {
      throw new Error("Could Not get Category page Details");
    }
    return res;
  } catch (error) {}
  toast.dismiss(toastId);
  return result;
}
