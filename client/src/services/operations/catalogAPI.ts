import toast from "react-hot-toast";

import type { Course } from "../../types/domain";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";

const {
  CATEGORY_PAGE_DETAILS_API,
  GET_ALL_RECOMMENDED_COURSES,
  GET_COURSES_BY_IDS_API,
} = courseEndpoints;

interface ApiResponse<TData> {
  success: boolean;
  message?: string;
  data?: TData;
}

export interface CatalogCategory {
  _id: string;
  name: string;
  description?: string;
  courses: Course[];
}

export interface CatalogPageData {
  selectedCategoryCourses: CatalogCategory;
  differentCategoryCourses?: CatalogCategory[];
  mostSellingCourses?: Course[];
}

export interface RecommendedCourseSeed {
  courseId: string;
  reason?: string;
}

export async function getCatalogPageData(
  categoryId: string
): Promise<CatalogPageData | null> {
  let result: CatalogPageData | null = null;
  const toastId = toast.loading("loading...");
  try {
    const response = await apiConnector<ApiResponse<CatalogPageData>>(
      "POST",
      CATEGORY_PAGE_DETAILS_API,
      { categoryId }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not get Category page Details");
    }
    result = response?.data?.data ?? null;
  } catch {
    /* swallowed by design — caller handles null */
  }
  toast.dismiss(toastId);
  return result;
}

export async function getAllRecomenddedCourses(
  token: string
): Promise<RecommendedCourseSeed[]> {
  let result: RecommendedCourseSeed[] = [];
  try {
    const response = await apiConnector<ApiResponse<RecommendedCourseSeed[]>>(
      "GET",
      GET_ALL_RECOMMENDED_COURSES,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not get Category page Details");
    }
    result = response?.data?.data || [];
  } catch {
    /* swallowed */
  }
  return result;
}

export async function getCoursesByIds(courseIds: string[]): Promise<Course[]> {
  let result: Course[] = [];
  try {
    const response = await apiConnector<ApiResponse<Course[]>>(
      "POST",
      GET_COURSES_BY_IDS_API,
      { courseIds }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch courses");
    }

    result = response?.data?.data || [];
  } catch {
    /* swallowed */
  }

  return result;
}

export async function fetchRecommendedCourseCards(
  token: string
): Promise<Course[]> {
  const recommendations = await getAllRecomenddedCourses(token);
  const recommendedCourseIds = recommendations
    ?.map((course) => course?.courseId)
    ?.filter(Boolean) as string[];

  if (!recommendedCourseIds?.length) {
    return [];
  }

  const courseDetails = await getCoursesByIds(recommendedCourseIds);
  const courseMap = new Map<string, Course>(
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
    .filter((course): course is Course => course !== null);
}
