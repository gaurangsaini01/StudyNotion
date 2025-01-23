import { apiConnector } from "../apiconnector";
import { categories } from "../apis";
import toast from "react-hot-toast";
const { CREATE_CATEGORY_API } = categories;

async function createCategory(data, token) {
  try {
    console.log(data);
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

async function deleteCategory(data,token){
    try {
        
    } catch (error) {
        
    }
}
export { createCategory ,deleteCategory};
