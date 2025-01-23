import { apiConnector } from "../apiconnector";
import { categories } from "../apis";
import toast from "react-hot-toast";
const { CREATE_CATEGORY_API, DELETE_CATEGORY_API } = categories;

async function createCategory(data, token) {
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Category Created Successfully");
    return response;
  } catch (err) {
    toast.error(err.response.data.message);
  }
}

async function deleteCategory(categoryId, token) {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_CATEGORY_API,
      { categoryId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Category Deleted Successfully");
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
}
export { createCategory, deleteCategory };
