import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAppSelector } from "../../../redux/hooks";
import { apiConnector } from "../../../services/apiconnector";
import { categories } from "../../../services/apis";
import {
  createCategory,
  editCategory,
} from "../../../services/operations/category";
import type { Category as CategoryType } from "../../../types/domain";
import IconBtn from "../../reusable/IconBtn";
import ListOfCategories from "./ListOfCategories";

export interface CategoryFormState {
  name: string;
  description: string;
}

interface ListResponse {
  data: CategoryType[];
}

function Category() {
  const { token } = useAppSelector((state) => state.auth);
  const [category, setCategory] = useState<CategoryFormState>({
    name: "",
    description: "",
  });
  const [edit, setEdit] = useState(false);
  const [todoId, setTodoId] = useState<string | null>(null);
  const [list, setList] = useState<CategoryType[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    if (!edit) {
      const res = await createCategory(category, token);
      if (!res?.data.success) {
        toast.error("Cannot create category");
        return;
      }
      const newCategory = res.data.data as CategoryType;
      setCategory({
        name: "",
        description: "",
      });
      setList((prev) => [...prev, newCategory]);
    } else {
      if (!todoId) return;
      const data = {
        ...category,
        categoryId: todoId,
      };
      const res = await editCategory(data, token);
      if (!res?.data.success) {
        toast.error("Cannot Edit category");
        return;
      }
      const editedCategory = res.data.data as CategoryType;
      setCategory({
        name: "",
        description: "",
      });
      setList((prev) =>
        prev.map((cat) =>
          cat._id === editedCategory._id ? editedCategory : cat
        )
      );
      setEdit(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setCategory((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  useEffect(() => {
    async function caller() {
      try {
        const result = await apiConnector<ListResponse>(
          "GET",
          categories.CATEGORIES_API
        );
        setList(result.data.data);
      } catch {
        /* no-op */
      }
    }
    caller();
  }, []);

  return (
    <div className="md:p-7 py-4 flex flex-col gap-5  mx-auto">
      <h1 className="md:text-3xl text-2xl font-bold tracking-wider text-richblack-5">
        {edit ? "Edit Category" : "Create Category"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-[70%] bg-[#161c28] p-6 rounded-md text-[#c1c4cf] font-semibold flex-col gap-6"
      >
        <div className="flex gap-1 flex-col">
          <label htmlFor="">Category Name</label>
          <input
            placeholder="Enter category name , eg- web dev , app dev"
            name="name"
            value={category?.name}
            onChange={handleChange}
            type="text"
            autoComplete="off"
            className="form-style w-[90%]"
          />
        </div>
        <div className="flex gap-1 flex-col">
          <label htmlFor="">Category Description</label>
          <input
            placeholder="Write about the category"
            name="description"
            value={category?.description}
            onChange={handleChange}
            type="text"
            autoComplete="off"
            className="form-style w-[90%]"
          />
        </div>
        <IconBtn
          customClasses="mt-4 lg:w-[40%] w-full border-3"
          type="submit"
          disabled={false}
          text={edit ? "Save Changes" : "Add Category"}
        />
      </form>
      <ListOfCategories
        setTodoId={setTodoId}
        setCategory={setCategory}
        setEdit={setEdit}
        edit={edit}
        list={list}
        setList={setList}
      />
    </div>
  );
}

export default Category;
