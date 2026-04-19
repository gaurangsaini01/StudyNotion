import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Outlet, useParams } from "react-router-dom";

import CourseCopilotChatbot from "../components/ViewCourse/CourseCopilotChatbot";
import CourseReviewModal from "../components/ViewCourse/CourseReviewModal";
import ViewCourseSidebar, {
  type NotesPayload,
} from "../components/ViewCourse/ViewCourseSidebar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../redux/slices/viewCourseSlice";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import type { Section } from "../types/domain";

function calculateTotalLectures(sections: Section[] | undefined): number {
  return (
    sections?.reduce((acc, section) => {
      return acc + (section?.subSection?.length || 0);
    }, 0) ?? 0
  );
}

function ViewCourse() {
  const [reviewModal, setReviewModal] = useState(false);
  const [notesModalData, setNotesModalData] = useState<NotesPayload | null>(
    null
  );
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      if (!courseId || !token) return;
      try {
        const result = await getFullDetailsOfCourse(courseId, token);
        dispatch(setEntireCourseData(result?.courseDetails ?? null));
        dispatch(
          setCourseSectionData(result?.courseDetails?.courseContent ?? [])
        );
        dispatch(setCompletedLectures(result?.completedVideos ?? []));
        dispatch(
          setTotalNoOfLectures(
            calculateTotalLectures(result?.courseDetails?.courseContent)
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    getCourseFullDetails();
  }, [courseId, dispatch, token]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    if (reviewModal || notesModalData) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [notesModalData, reviewModal]);

  return (
    <div className="relative min-h-screen bg-richblack-900 pt-14">
      <ViewCourseSidebar
        setReviewModal={setReviewModal}
        onOpenNotes={setNotesModalData}
      />
      <div className="min-h-[calc(100vh-3.5rem)] w-full md:ml-[320px]">
        <Outlet />
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
      {courseId && <CourseCopilotChatbot courseId={courseId} token={token} />}
      {notesModalData?.notesPdfUrl && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-sm md:p-6">
          <div className="relative flex h-full max-h-[calc(100vh-5.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-richblack-700 bg-richblack-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-richblack-700 px-5 py-4">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-richblack-5">
                  Lecture Notes
                </p>
                <p className="truncate text-sm text-richblack-300">
                  {notesModalData?.notesPdfName || notesModalData?.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotesModalData(null)}
                className="rounded-md p-1 text-richblack-25 transition-all duration-200 hover:bg-richblack-700 hover:text-richblack-5"
              >
                <RxCross2 className="text-2xl" />
              </button>
            </div>
            <div className="flex-1 bg-richblack-5 p-2">
              <iframe
                src={notesModalData.notesPdfUrl}
                title="Lecture Notes PDF"
                className="h-full w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCourse;
