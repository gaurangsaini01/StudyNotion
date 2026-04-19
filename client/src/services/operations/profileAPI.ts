import toast from "react-hot-toast";

import type { Course, QuizQuestion } from "../../types/domain";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";

const {
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
  GET_QUIZ_QUESTIONS_API,
} = profileEndpoints;

interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
}

interface AxiosLikeError {
  response?: { data?: { message?: string } };
  message?: string;
}

function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const err = error as AxiosLikeError;
  return err?.response?.data?.message ?? err?.message ?? fallback;
}

export interface EnrolledCourse extends Course {
  totalDuration?: string;
  progressPercentage?: number;
}

export interface InstructorCourseData {
  _id: string;
  courseName: string;
  totalAmountGenerated: number;
  totalStudentsEnrolled: number;
}

export async function getUserEnrolledCourses(
  _token: string
): Promise<EnrolledCourse[]> {
  const toastId = toast.loading("Loading...");
  let result: EnrolledCourse[] = [];
  try {
    const response = await apiConnector<ApiResponse<EnrolledCourse[]>>(
      "GET",
      GET_USER_ENROLLED_COURSES_API
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data ?? [];
  } catch {
    toast.error("Could Not Get Enrolled Courses");
  }
  toast.dismiss(toastId);
  return result;
}

export async function getInstructorData(
  _token: string
): Promise<InstructorCourseData[]> {
  const toastId = toast.loading("Loading...");
  let result: InstructorCourseData[] = [];
  try {
    const response = await apiConnector<{ courses: InstructorCourseData[] }>(
      "GET",
      GET_INSTRUCTOR_DATA_API
    );
    result = response?.data?.courses ?? [];
  } catch {
    toast.error("Could Not Get Instructor Data");
  }
  toast.dismiss(toastId);
  return result;
}

export interface QuizQuestionsData {
  questions: QuizQuestion[];
}

export interface QuizQuestionsResponse {
  success: boolean;
  message?: string;
  data?: QuizQuestionsData;
}

export async function getQuizQuestions(
  data: { courseName?: string; courseDescription?: string },
  _token: string
): Promise<QuizQuestionsResponse | null> {
  let result: QuizQuestionsResponse | null = null;
  try {
    const response = await apiConnector<QuizQuestionsResponse>(
      "POST",
      GET_QUIZ_QUESTIONS_API,
      data
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    result = response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error));
  }

  return result;
}
