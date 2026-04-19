import { toast } from "react-hot-toast";

import type {
  Course,
  Section,
  RatingAndReview,
} from "../../types/domain";
import { apiConnector, axiosInstance } from "../apiconnector";
import { courseEndpoints } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
  COURSE_PROGRESS_API,
  COURSE_CHATBOT_API,
} = courseEndpoints;

interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
  error?: string;
  newCourse?: Course;
  updatedCourse?: Course;
}

interface AxiosLikeError {
  response?: { data?: { message?: string } };
  message?: string;
  name?: string;
  code?: string;
}

function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const err = error as AxiosLikeError;
  return err?.response?.data?.message ?? err?.message ?? fallback;
}

export interface CourseCategoryOption {
  _id: string;
  name: string;
  description?: string;
}

export const getAllCourses = async (): Promise<Course[]> => {
  const toastId = toast.loading("Loading...");
  let result: Course[] = [];
  try {
    const response = await apiConnector<ApiResponse<Course[]>>(
      "GET",
      GET_ALL_COURSE_API
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data ?? [];
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export interface ChatbotResponse {
  answer: string;
  cancelled?: boolean;
}

export const askCourseChatbot = async (
  data: Record<string, unknown>,
  token: string,
  signal?: AbortSignal
): Promise<ChatbotResponse> => {
  let result: ChatbotResponse = { answer: "" };
  try {
    const response = await axiosInstance({
      method: "POST",
      url: COURSE_CHATBOT_API,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Get Chatbot Response");
    }

    result = response?.data?.data;
  } catch (error) {
    const err = error as AxiosLikeError;
    if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
      return {
        cancelled: true,
        answer: "Stopped the current response.",
      };
    }

    result = {
      answer:
        err?.response?.data?.message ||
        "I couldn't respond right now. Please try again.",
    };
  }

  return result;
};

export interface CourseDetailsResponse {
  success: boolean;
  message?: string;
  data?: Course;
}

export const fetchCourseDetails = async (
  courseId: string
): Promise<CourseDetailsResponse | null> => {
  const toastId = toast.loading("Loading...");
  let result: CourseDetailsResponse | null = null;
  try {
    const response = await apiConnector<CourseDetailsResponse>(
      "POST",
      COURSE_DETAILS_API,
      { courseId }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    const err = error as AxiosLikeError;
    result = (err?.response?.data as CourseDetailsResponse) ?? null;
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseCategories = async (): Promise<CourseCategoryOption[]> => {
  let result: CourseCategoryOption[] = [];
  try {
    const response = await apiConnector<ApiResponse<CourseCategoryOption[]>>(
      "GET",
      COURSE_CATEGORIES_API
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data ?? [];
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  return result;
};

export const addCourseDetails = async (
  data: FormData,
  token: string
): Promise<Course | null> => {
  let result: Course | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse>(
      "POST",
      CREATE_COURSE_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    toast.success("Course Details Added Successfully");
    result = response?.data?.newCourse ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export const editCourseDetails = async (
  data: FormData,
  token: string
): Promise<Course | null> => {
  let result: Course | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse>(
      "PUT",
      EDIT_COURSE_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    toast.success("Course Details Updated Successfully");
    result = response?.data?.updatedCourse ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (
  data: { sectionName: string; courseId: string },
  token: string
): Promise<Course | null> => {
  let result: Course | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse<Course>>(
      "POST",
      CREATE_SECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }
    toast.success("Course Section Created");
    result = response?.data?.data ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export const createSubSection = async (
  data: FormData,
  token: string
): Promise<Section | null> => {
  let result: Section | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse<Section>>(
      "POST",
      CREATE_SUBSECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }
    toast.success("Lecture Added");
    result = response?.data?.data ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error, "Some Error in Uploading"));
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSection = async (
  data: { sectionName: string; sectionId: string; courseId: string },
  token: string
): Promise<Course | null> => {
  let result: Course | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse<Course>>(
      "PUT",
      UPDATE_SECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }
    toast.success("Course Section Updated");
    result = response?.data?.data ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubSection = async (
  data: FormData,
  token: string
): Promise<Section | null> => {
  let result: Section | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse<Section>>(
      "PUT",
      UPDATE_SUBSECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }
    toast.success("Lecture Updated");
    result = response?.data?.data ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error, "Some Error in updating"));
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (
  data: { sectionId: string; courseId: string },
  token: string
): Promise<Course | null> => {
  let result: Course | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse<Course>>(
      "DELETE",
      DELETE_SECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }
    toast.success("Course Section Deleted");
    result = response?.data?.data ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async (
  data: { subSectionId: string; sectionId: string },
  token: string
): Promise<Course | null> => {
  let result: Course | null = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse<Course>>(
      "DELETE",
      DELETE_SUBSECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture");
    }
    toast.success("Lecture Deleted");
    result = response?.data?.data ?? null;
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchInstructorCourses = async (
  token: string
): Promise<Course[]> => {
  let result: Course[] = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse<Course[]>>(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data ?? [];
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCourse = async (
  data: { courseId: string },
  token: string
): Promise<void> => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse>(
      "DELETE",
      DELETE_COURSE_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Course Deleted");
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
};

export interface FullCourseDetails {
  courseDetails: Course;
  completedVideos: string[];
  totalDuration?: string;
}

export const getFullDetailsOfCourse = async (
  courseId: string,
  token: string
): Promise<FullCourseDetails | null> => {
  const toastId = toast.loading("Loading...");
  let result: FullCourseDetails | null = null;
  try {
    const response = await apiConnector<ApiResponse<FullCourseDetails>>(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.data ?? null;
  } catch (error) {
    const err = error as AxiosLikeError;
    result =
      ((err?.response?.data as { data?: FullCourseDetails })?.data as
        | FullCourseDetails
        | undefined) ?? null;
  }
  toast.dismiss(toastId);
  return result;
};

export const markLectureAsComplete = async (
  data: { courseId: string; subSectionId: string },
  token: string
): Promise<boolean> => {
  let result = false;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector<ApiResponse>(
      "POST",
      LECTURE_COMPLETION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    toast.error(getErrorMessage(error));
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

export const createRating = async (
  data: { courseId: string; rating: number; review: string },
  token: string
): Promise<boolean> => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector<ApiResponse<RatingAndReview>>(
      "POST",
      CREATE_RATING_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    toast.success("Rating Created");
    success = true;
  } catch (error) {
    success = false;
    toast.error(getErrorMessage(error));
  }
  toast.dismiss(toastId);
  return success;
};

export interface CourseProgressData {
  completedVideos: string[];
}

export const getCourseProgress = async (
  data: { courseId: string },
  token: string
): Promise<number | null> => {
  let result: number | null = null;
  try {
    const response = await apiConnector<ApiResponse<number>>(
      "POST",
      COURSE_PROGRESS_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Get Progress");
    }
    result = response?.data?.data ?? null;
  } catch {
    result = null;
  }
  return result;
};
