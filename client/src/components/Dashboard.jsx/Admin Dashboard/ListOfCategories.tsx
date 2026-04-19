import { type Dispatch, type SetStateAction, useState } from "react";

import { useAppSelector } from "../../../redux/hooks";
import { deleteCategory } from "../../../services/operations/category";
import type { Category as CategoryType } from "../../../types/domain";
import ConfirmationModal from "../../reusable/Confirmationmodal";
import type { ConfirmationModalData } from "../../reusable/Confirmationmodal";
import type { CategoryFormState } from "./Category";

interface ListOfCategoriesProps {
  list: CategoryType[];
  setList: Dispatch<SetStateAction<CategoryType[]>>;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
  setCategory: Dispatch<SetStateAction<CategoryFormState>>;
  setTodoId: Dispatch<SetStateAction<string | null>>;
}

function ListOfCategories({
  list,
  setList,
  edit,
  setEdit,
  setCategory,
  setTodoId,
}: ListOfCategoriesProps) {
  const { token } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);

  function handleDelete(categoryId: string) {
    if (!token) return;
    setOpen(true);
    setConfirmationModal({
      text1: "Are You Sure ?",
      text2: "All Courses in this category will be deleted.",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: () => {
        deleteCategory(categoryId, token);
        setList((prev) => prev.filter((c) => c._id !== categoryId));
        setOpen(false);
        setConfirmationModal(null);
      },
      btn2Handler: () => setConfirmationModal(null),
    });
  }

  function editHandler(categoryId: string) {
    setEdit((prev) => !prev);
    if (!edit) {
      const currentCategory = list.find((cat) => cat._id == categoryId);
      setCategory({
        name: currentCategory?.name ?? "",
        description: currentCategory?.description ?? "",
      });
      setTodoId(categoryId);
    } else {
      setCategory({
        name: "",
        description: "",
      });
    }
  }

  return (
    <>
      <div className="text-white w-full md:w-[60%]">
        <h1 className="font-semibold text-2xl text-yellow-200">
          CATEGORIES ARE:
        </h1>
        <ul className="pl-4 mt-2">
          {list.map((category) => (
            <li className="list-disc" key={category?._id}>
              <div className="flex items-center justify-between">
                <div>{category?.name}</div>
                <div className="flex gap-4">
                  <button onClick={() => editHandler(category?._id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(category?._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {confirmationModal && (
        <ConfirmationModal
          open={open}
          handleClose={() => setOpen(false)}
          modalData={confirmationModal}
        />
      )}
    </>
  );
}

export default ListOfCategories;
