import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  resetCourseState,
  setCourse,
  setStep,
} from "../../../../redux/slices/courseSlice";
import { editCourseDetails } from "../../../../services/operations/courseDetailsAPI";
import IconBtn from "../../../reusable/IconBtn";

interface PublishFormValues {
  public: boolean;
}

function PublishForm() {
  const { handleSubmit, register, setValue } = useForm<PublishFormValues>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const { course } = useAppSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course?.status === "published") setValue("public", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitHandler(data: PublishFormValues) {
    if (!course || !token) return;
    if (
      (course?.status === "published" && data?.public === true) ||
      (course?.status === "draft" && data?.public === false)
    ) {
      dispatch(resetCourseState());
      navigate("/dashboard/my-courses");
    } else {
      const formData = new FormData();
      formData.append("courseId", course._id);
      const value = data?.public === true ? "published" : "draft";
      formData.append("status", value);
      setLoading(true);
      const result = await editCourseDetails(formData, token);
      if (result) {
        dispatch(setCourse(result));
      }
      setLoading(false);
      dispatch(resetCourseState());
      navigate("/dashboard/my-courses");
    }
  }

  return (
    <div className="bg-richblack-800 p-8 rounded-xl flex flex-col gap-8">
      <h1 className="text-richblack-25 text-2xl">Publish Course</h1>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-8"
      >
        <div className="space-x-3">
          <input
            type="checkbox"
            id="public"
            className="text-richblack-400 h-4 w-4 rounded-md"
            {...register("public")}
          />
          <label htmlFor="public" className="text-richblack-400">
            Mark This Course As Public
          </label>
        </div>
        <div className="flex justify-end gap-4">
          <button
            disabled={loading}
            onClick={() => dispatch(setStep(1))}
            className="flex items-center justify-center px-6 py-2 hover:scale-95 transition-all duration-150 ease-in-out rounded-md bg-richblack-600"
          >
            Back
          </button>
          <IconBtn disabled={loading} text={"Save and Publish"} />
        </div>
      </form>
    </div>
  );
}

export default PublishForm;
