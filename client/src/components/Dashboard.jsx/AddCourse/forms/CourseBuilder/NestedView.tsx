import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";

import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { setCourse } from "../../../../../redux/slices/courseSlice";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import type { SubSection } from "../../../../../types/domain";
import ConfirmationModal from "../../../../reusable/Confirmationmodal";
import type { ConfirmationModalData } from "../../../../reusable/Confirmationmodal";
import SubSectionModal from "./SubSectionModal";

interface NestedViewProps {
  handleChangeEditSectionName: (sectionId: string, sectionName: string) => void;
}

export default function NestedView({
  handleChangeEditSectionName,
}: NestedViewProps) {
  const { course } = useAppSelector((state) => state.course);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [addSubSection, setAddSubsection] = useState<string | null>(null);
  const [viewSubSection, setViewSubSection] = useState<SubSection | null>(null);
  const [editSubSection, setEditSubSection] = useState<
    (SubSection & { sectionId: string }) | null
  >(null);

  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleleSection = async (sectionId: string) => {
    if (!token || !course) return;
    const result = await deleteSection(
      {
        sectionId,
        courseId: course?._id,
      },
      token
    );
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (
    subSectionId: string,
    sectionId: string
  ) => {
    if (!token || !course) return;
    const result = await deleteSubSection(
      { subSectionId, sectionId },
      token
    );
    if (result) {
      const updatedCourseContent = course?.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = {
        ...course,
        // deleteSubSection returns Course; align with section update by casting
        courseContent: updatedCourseContent as typeof course.courseContent,
      };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };

  return (
    <>
      <div
        className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {course &&
          course?.courseContent?.map((section) => (
            <details key={section._id} open>
              <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p className="font-semibold text-richblack-50">
                    {section.sectionName}
                  </p>
                </div>
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() =>
                      handleChangeEditSectionName(
                        section._id,
                        section.sectionName
                      )
                    }
                  >
                    <MdEdit className="text-xl text-richblack-300" />
                  </button>
                  <button
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Delete this Section?",
                        text2:
                          "All the lectures in this section will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleleSection(section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      });
                      handleOpen();
                    }}
                  >
                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                  </button>
                  <span className="font-medium text-richblack-300">|</span>
                  <AiFillCaretDown className={`text-xl text-richblack-300`} />
                </div>
              </summary>
              <div className="px-6 pb-4">
                {section?.subSection?.map((data, index) => (
                  <div
                    key={index}
                    onClick={() => setViewSubSection(data)}
                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                  >
                    <div className="flex items-center gap-x-3 py-2 ">
                      <RxDropdownMenu className="text-2xl text-richblack-50" />
                      <p className="font-semibold text-richblack-50">
                        {data.title}
                      </p>
                    </div>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-x-3"
                    >
                      <button
                        onClick={() =>
                          setEditSubSection({
                            ...data,
                            sectionId: section._id,
                          })
                        }
                      >
                        <MdEdit className="text-xl text-richblack-300" />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmationModal({
                            text1: "Delete this Sub-Section?",
                            text2: "This lecture will be deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () =>
                              handleDeleteSubSection(data._id, section._id),
                            btn2Handler: handleClose,
                          });
                          setOpen(true);
                        }}
                      >
                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setAddSubsection(section._id)}
                  className="mt-3 flex items-center gap-x-1 text-yellow-50"
                >
                  <FaPlus className="text-lg" />
                  <p>Add Lecture</p>
                </button>
              </div>
            </details>
          ))}
      </div>
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={
            setAddSubsection as (value: SubSection | string | null) => void
          }
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={
            setViewSubSection as (value: SubSection | string | null) => void
          }
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={
            setEditSubSection as (value: SubSection | string | null) => void
          }
          edit={true}
        />
      ) : null}
      {open && confirmationModal ? (
        <ConfirmationModal
          modalData={confirmationModal}
          open={open}
          handleClose={handleClose}
        />
      ) : null}
    </>
  );
}
