import toast from "react-hot-toast";
import type { AxiosResponse } from "axios";

import { apiConnector } from "../apiconnector";
import { categories } from "../apis";

const { CREATE_CATEGORY_API, DELETE_CATEGORY_API, EDIT_CATEGORY_API } =
  categories;

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

export async function createCategory(
  data: { name: string; description?: string },
  token: string
): Promise<AxiosResponse<ApiResponse> | undefined> {
  try {
    const response = await apiConnector<ApiResponse>(
      "POST",
      CREATE_CATEGORY_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Category Created Successfully");
    return response;
  } catch (err) {
    toast.error(getErrorMessage(err));
    return undefined;
  }
}

export async function editCategory(
  data: { categoryId: string; name?: string; description?: string },
  token: string
): Promise<AxiosResponse<ApiResponse> | undefined> {
  try {
    const response = await apiConnector<ApiResponse>(
      "PUT",
      EDIT_CATEGORY_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Category Edited Successfully");
    return response;
  } catch (err) {
    toast.error(getErrorMessage(err));
    return undefined;
  }
}

export async function deleteCategory(
  categoryId: string,
  token: string
): Promise<AxiosResponse<ApiResponse> | undefined> {
  try {
    const response = await apiConnector<ApiResponse>(
      "DELETE",
      DELETE_CATEGORY_API,
      { categoryId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Category Deleted Successfully");
    return response;
  } catch (error) {
    toast.error(getErrorMessage(error));
    return undefined;
  }
}
