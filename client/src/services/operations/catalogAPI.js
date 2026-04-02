import toast from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const {
  CATEGORY_PAGE_DETAILS_API,
  GET_ALL_RECOMMENDED_COURSES,
  GET_COURSES_BY_IDS_API,
} = courseEndpoints;

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

export async function getAllRecomenddedCourses(token) {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_RECOMMENDED_COURSES,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error("Could Not get Category page Details");
    }
    result = response?.data?.data || [];
  } catch (error) {}
  return result;
}

export async function getCoursesByIds(courseIds) {
  let result = [];
  try {
    const response = await apiConnector("POST", GET_COURSES_BY_IDS_API, {
      courseIds,
    });

    if (!response?.data?.success) {
      throw new Error("Could not fetch courses");
    }

    result = response?.data?.data || [];
  } catch (error) {}

  return result;
}

export async function fetchRecommendedCourseCards(token) {
  const recommendations = await getAllRecomenddedCourses(token);
  const recommendedCourseIds = recommendations
    ?.map((course) => course?.courseId)
    ?.filter(Boolean);

  if (!recommendedCourseIds?.length) {
    return [];
  }

  const courseDetails = await getCoursesByIds(recommendedCourseIds);
  const courseMap = new Map(
    courseDetails?.map((course) => [course?._id?.toString(), course])
  );

  return recommendations
    .map((recommendation) => {
      const matchedCourse = courseMap.get(recommendation?.courseId?.toString());

      if (!matchedCourse) {
        return null;
      }

      return {
        ...matchedCourse,
        recommendationReason: recommendation?.reason,
      };
    })
    .filter(Boolean);
}
