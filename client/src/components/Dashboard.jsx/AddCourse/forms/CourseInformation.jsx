import  { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseCategories,
  editCourseDetails,
  addCourseDetails,
} from "../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { setStep, setCourse } from "../../../../redux/slices/courseSlice";
import IconBtn from "../../../reusable/IconBtn";

function CourseInformation() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    getValues,
    watch,
    reset,
    // control,
  } = useForm();

  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const selectedCourseCategory = watch("courseCategory");

  //IMAGE RELATED
  const fileInputRef = useRef(null);
  const [previewSource, setPreviewSource] = useState(null);

  function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("courseImage", file); // Set the file to the form state
      previewFile(file);
    }
  };

  const handleReplaceImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
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
      coursePrice: course?.price || "",
      courseTags: course?.tag || [],
      courseBenefits: course?.whatYouWillLearn || "",
      courseCategory:course?.category?._id ||"",
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
      currentValues.courseShortDesc !==
        course?.courseDescription ||
      currentValues.coursePrice !== course?.price ||
      currentValues.courseTitle !== course?.courseName ||
      currentValues.courseBenefits !==
        course?.whatYouWillLearn ||
      selectedCategoryId !== existingCategoryId ||
      (currentValues.courseImage &&
        currentValues.courseImage !== course?.thumbnail)
    )
      return true;
    else return false;
  };

  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course?._id);
        if (currentValues.courseTitle !== course?.courseName) {
          formData.append("courseName", data.courseTitle);
        }

        if (
          currentValues.courseShortDesc !==
          course?.courseDescription
        ) {
          formData.append("courseDescription", data.courseShortDesc);
        }

        if (currentValues.coursePrice !== course?.price) {
          formData.append("price", data.coursePrice);
        }

        if (
          currentValues.courseBenefits !==
          course?.whatYouWillLearn
        ) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }

        if (
          currentValues.courseCategory !== course?.category?._id?.toString()
        ) {
          formData.append("category", data.courseCategory);
        }
        if (currentValues.courseImage !== course?.thumbnail) {
          formData.append("thumbnail", data.courseImage);
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
    //create a new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("status", "draft");
    if (data.courseImage) {
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
    <>
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
            {errors.courseTitle && <span className="text-red-600 text-sm mt-1">Course Title is Required**</span>}
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
              <span className="text-red-600 text-sm mt-1">Course Description is required**</span>
            )}
          </div>

          <div className="relative flex flex-col gap-2">
            <label htmlFor="coursePrice lable-style">
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
            {errors.coursePrice && <span className="text-red-600 text-sm mt-1">Course Price is Required**</span>}
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
            {errors.courseCategory && <span className="text-red-600 text-sm mt-1">Course Category is Required</span>}
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
                  <button
                    type="button"
                    onClick={handleReplaceImage}
                    className="rounded-md bg-richblack-700 px-4 py-2 text-sm font-medium text-yellow-50 transition-all duration-200 hover:scale-95"
                  >
                    Replace Image
                  </button>
                </div>
              </>
            )}
            {(!previewSource || course?.thumbnail) && (
              <div className="w-full text-richblack-300">
                Click
                <span
                  className="text-yellow-50 cursor-pointer "
                  onClick={() => fileInputRef.current.click()}
                >
                    {" "}
                    Browse
                  </span>{" "}
                  to choose an image for thumbnail
                </div>
              )}
            </div>
            {errors.courseImage && <span className="text-red-600 text-sm mt-1">Thumbnail Is required**</span>}
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
              <span className="text-red-600 text-sm mt-1">Benefits of the course are required**</span>
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
      {/* <DevTool control={control} /> */}
    </>
  );
}

export default CourseInformation;
