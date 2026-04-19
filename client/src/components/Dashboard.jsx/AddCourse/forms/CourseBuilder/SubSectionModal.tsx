import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { setCourse } from "../../../../../redux/slices/courseSlice";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import type { Section, SubSection } from "../../../../../types/domain";
import IconBtn from "../../../../reusable/IconBtn";
import FileDropzone from "../../FileDropzone";
import Upload from "../../Upload";

type ModalData = string | (SubSection & { sectionId?: string });

interface SubSectionModalProps {
  modalData: ModalData;
  setModalData: (value: SubSection | string | null) => void;
  add?: boolean;
  view?: boolean;
  edit?: boolean;
}

interface SubSectionFormValues {
  lectureTitle: string;
  lectureDesc: string;
  lectureVideo: File | string | null;
  notesPdf: File | null;
}

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}: SubSectionModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
    watch,
  } = useForm<SubSectionFormValues>();

  const selectedNotesPdf = watch("notesPdf");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [notesPdfRemoved, setNotesPdfRemoved] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const { course } = useAppSelector((state) => state.course);

  const isObjectModal = typeof modalData !== "string";
  const subData = isObjectModal ? modalData : null;

  useEffect(() => {
    if ((view || edit) && subData) {
      setValue("lectureTitle", subData.title);
      setValue("lectureDesc", subData.description ?? "");
      setValue("lectureVideo", subData.videoURL ?? null);
      setValue("notesPdf", null);
      setNotesPdfRemoved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, modalData, edit, view]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== subData?.title ||
      currentValues.lectureDesc !== subData?.description ||
      currentValues.lectureVideo !== subData?.videoURL ||
      !!selectedNotesPdf ||
      notesPdfRemoved
    ) {
      return true;
    }
    return false;
  };

  const handleEditSubsection = async () => {
    if (!token || !course || !subData) return;
    const currentValues = getValues();
    const formData = new FormData();

    if (subData.sectionId) formData.append("sectionId", subData.sectionId);
    formData.append("subSectionId", subData._id);
    if (currentValues.lectureTitle !== subData?.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== subData?.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (
      currentValues.lectureVideo !== subData?.videoURL &&
      currentValues.lectureVideo instanceof File
    ) {
      formData.append("video", currentValues.lectureVideo);
    }
    if (selectedNotesPdf) {
      formData.append("notesPdf", selectedNotesPdf);
    } else if (notesPdfRemoved) {
      formData.append("removeNotesPdf", "true");
    }
    formData.append("course", JSON.stringify(course));
    setLoading(true);

    const result = await updateSubSection(formData, token);
    if (result && subData.sectionId) {
      const updatedCourseContent = course?.courseContent.map((section) =>
        section._id === subData.sectionId ? result : section
      ) as Section[];
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data: SubSectionFormValues) => {
    if (view) return;
    if (!token || !course) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }
    const formData = new FormData();
    formData.append("course", JSON.stringify(course));
    if (typeof modalData === "string") {
      formData.append("sectionId", modalData);
    }
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    if (data.lectureVideo instanceof File) {
      formData.append("video", data.lectureVideo);
    }
    if (data.notesPdf) {
      formData.append("notesPdf", data.notesPdf);
    }
    setLoading(true);
    const result = await createSubSection(formData, token);
    if (result && typeof modalData === "string") {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      ) as Section[];
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-hidden bg-white bg-opacity-10 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[700px] flex-col rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : undefined)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="thin-dark-scrollbar flex-1 space-y-8 overflow-y-auto overscroll-contain px-8 py-10">
            <Upload<SubSectionFormValues>
              name="lectureVideo"
              label="Lecture Video"
              register={register}
              setValue={setValue}
              errors={errors}
              video={true}
              viewData={view ? subData?.videoURL ?? null : null}
              editData={edit ? subData?.videoURL ?? null : null}
            />
            <FileDropzone<SubSectionFormValues>
              name="notesPdf"
              label="Lecture Notes (Optional)"
              register={register}
              setValue={setValue}
              errors={errors}
              accept={{ "application/pdf": [".pdf"] }}
              helperText="Drag and drop a PDF file with lecture notes, or browse to upload one."
              viewData={view ? subData?.notesPdfUrl ?? null : null}
              editData={
                edit && !notesPdfRemoved ? subData?.notesPdfUrl ?? null : null
              }
              viewLabel={view ? subData?.notesPdfName ?? null : null}
              editLabel={
                edit && !notesPdfRemoved ? subData?.notesPdfName ?? null : null
              }
              onFileRemove={() => setNotesPdfRemoved(true)}
              onFileSelect={() => setNotesPdfRemoved(false)}
              disabled={view || loading}
            />
            <div className="flex flex-col space-y-2">
              <label
                className="text-sm text-richblack-5"
                htmlFor="lectureTitle"
              >
                Lecture Title {!view && <sup className="text-pink-200">*</sup>}
              </label>
              <input
                disabled={view || loading}
                id="lectureTitle"
                placeholder="Enter Lecture Title"
                {...register("lectureTitle", { required: true })}
                className="form-style w-full"
              />
              {errors.lectureTitle && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Lecture title is required
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                className="text-sm text-richblack-5"
                htmlFor="lectureDesc"
              >
                Lecture Description{" "}
                {!view && <sup className="text-pink-200">*</sup>}
              </label>
              <textarea
                disabled={view || loading}
                id="lectureDesc"
                placeholder="Enter Lecture Description"
                {...register("lectureDesc", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
              />
              {errors.lectureDesc && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Lecture Description is required
                </span>
              )}
            </div>
          </div>
          {!view && (
            <div className="sticky bottom-0 flex justify-end border-t border-richblack-700 bg-richblack-800 px-8 py-4">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
