import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setCourse, setStep } from "../../../../redux/slices/courseSlice";
import {
  type CourseCategoryOption,
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../services/operations/courseDetailsAPI";
import IconBtn from "../../../reusable/IconBtn";

interface CourseInformationFormValues {
  courseTitle: string;
  courseShortDesc: string;
  coursePrice: number;
  courseTags?: string[];
  courseBenefits: string;
  courseCategory: string;
  courseRequirements?: string[];
  courseImage: File | string | null;
}

function CourseInformation() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<CourseInformationFormValues>();

  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { course, editCourse } = useAppSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState<
    CourseCategoryOption[]
  >([]);
  const selectedCourseCategory = watch("courseCategory");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);

  function previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result as string);
    };
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("courseImage", file);
      previewFile(file);
    }
  };

  const handleReplaceImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setPreviewSource(null);
    setValue("courseImage", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const cats = await fetchCourseCategories();
      if (cats.length > 0) {
        setCourseCategories(cats);
      }
      setLoading(false);
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (!editCourse || !course) {
      return;
    }
    reset({
      courseTitle: course?.courseName || "",
      courseShortDesc: course?.courseDescription || "",
      coursePrice: course?.price || 0,
      courseTags: course?.tag || [],
      courseBenefits: course?.whatYouWillLearn || "",
      courseCategory: course?.category?._id || "",
      courseRequirements: course?.instructions || [],
      courseImage: course?.thumbnail || "",
    });
  }, [course, editCourse, reset]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    const selectedCategoryId = currentValues.courseCategory;
    const existingCategoryId = course?.category?._id?.toString();
    if (
      currentValues.courseTitle !== course?.courseName ||
      currentValues.courseShortDesc !== course?.courseDescription ||
      currentValues.coursePrice !== course?.price ||
      currentValues.courseBenefits !== course?.whatYouWillLearn ||
      selectedCategoryId !== existingCategoryId ||
      (currentValues.courseImage &&
        currentValues.courseImage !== course?.thumbnail)
    )
      return true;
    return false;
  };

  const onSubmit = async (data: CourseInformationFormValues) => {
    if (!token) return;
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        if (course?._id) formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course?.courseName) {
          formData.append("courseName", data.courseTitle);
        }

        if (currentValues.courseShortDesc !== course?.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }

        if (currentValues.coursePrice !== course?.price) {
          formData.append("price", String(data.coursePrice));
        }

        if (currentValues.courseBenefits !== course?.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }

        if (
          currentValues.courseCategory !== course?.category?._id?.toString()
        ) {
          formData.append("category", data.courseCategory);
        }
        if (currentValues.courseImage !== course?.thumbnail) {
          if (data.courseImage instanceof File) {
            formData.append("thumbnail", data.courseImage);
          }
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(1));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No Changes made so far");
      }
      return;
    }
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", String(data.coursePrice));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append(
      "instructions",
      JSON.stringify(data.courseRequirements ?? [])
    );
    formData.append("status", "draft");
    if (data.courseImage instanceof File) {
      formData.append("thumbnail", data.courseImage);
    }

    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(1));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-h-[calc(100vh-300px)] min-h-[420px] flex-col overflow-hidden rounded-md border border-richblack-700 bg-richblack-800"
    >
      <div className="thin-dark-scrollbar flex-1 space-y-8 overflow-y-auto px-2 py-4 md:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="courseTitle" className="lable-style">
            Course Title<sup className="text-red-500">*</sup>
          </label>
          <input
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: true })}
            className="w-full form-style"
          />
          {errors.courseTitle && (
            <span className="text-red-600 text-sm mt-1">
              Course Title is Required**
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="courseShortDesc" className="lable-style">
            Course Short Description<sup className="text-red-500">*</sup>
          </label>
          <textarea
            id="courseShortDesc"
            placeholder="Enter Description"
            {...register("courseShortDesc", { required: true })}
            className="min-h-[140px] w-full form-style"
          />
          {errors.courseShortDesc && (
            <span className="text-red-600 text-sm mt-1">
              Course Description is required**
            </span>
          )}
        </div>

        <div className="relative flex flex-col gap-2">
          <label htmlFor="coursePrice" className="lable-style">
            Course Price<sup className="text-red-500">*</sup>
          </label>
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
            })}
            className="w-full form-style pl-10"
          />
          <HiOutlineCurrencyRupee
            size={20}
            className="absolute left-3 top-[46px] text-richblack-50"
          />
          {errors.coursePrice && (
            <span className="text-red-600 text-sm mt-1">
              Course Price is Required**
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="courseCategory" className="lable-style">
            Course Category<sup className="text-red-500">*</sup>
          </label>
          <select
            id="courseCategory"
            className="form-style"
            value={selectedCourseCategory || ""}
            {...register("courseCategory", { required: true })}
          >
            <option value="" disabled>
              Choose a Category
            </option>

            {!loading &&
              courseCategories.map((category, index) => (
                <option key={index} value={category?._id?.toString()}>
                  {category?.name}
                </option>
              ))}
          </select>
          {errors.courseCategory && (
            <span className="text-red-600 text-sm mt-1">
              Course Category is Required
            </span>
          )}
        </div>

        <div className="w-full rounded-md p-4 h-fit form-style">
          <div className="w-full flex flex-col gap-6">
            <input
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
              name="courseImage"
              className="hidden"
              accept="image/*"
            />
            {(previewSource || course?.thumbnail) && (
              <>
                <img
                  src={previewSource || course?.thumbnail}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
                <div className="flex justify-end">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReplaceImage}
                      className="rounded-md bg-richblack-700 px-4 py-2 text-sm font-medium text-yellow-50 transition-all duration-200 hover:scale-95"
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-md bg-richblack-700 px-4 py-2 text-sm font-medium text-richblack-100 transition-all duration-200 hover:scale-95"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </>
            )}
            {(!previewSource || course?.thumbnail) && (
              <div className="w-full text-richblack-300">
                Click
                <span
                  className="text-yellow-50 cursor-pointer "
                  onClick={() => fileInputRef.current?.click()}
                >
                  {" "}
                  Browse
                </span>{" "}
                to choose an image for thumbnail
              </div>
            )}
          </div>
          {errors.courseImage && (
            <span className="text-red-600 text-sm mt-1">
              Thumbnail Is required**
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="lable-style">
            Benefits of the course<sup className="text-red-500">*</sup>
          </label>
          <textarea
            id="coursebenefits"
            placeholder="Enter Benefits of the course"
            {...register("courseBenefits", { required: true })}
            className="min-h-[130px] w-full form-style"
          />
          {errors.courseBenefits && (
            <span className="text-red-600 text-sm mt-1">
              Benefits of the course are required**
            </span>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-wrap gap-4 border-t border-richblack-700 bg-richblack-800 px-2 py-4 md:px-6">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(1))}
            className="flex items-center px-6 py-2 hover:scale-95 transition-all duration-150 ease-in-out rounded-md bg-richblack-600"
          >
            Continue Without Saving
          </button>
        )}

        {editCourse && <IconBtn text="Save Changes" />}
        {!editCourse && <IconBtn text="Next" />}
      </div>
    </form>
  );
}

export default CourseInformation;
