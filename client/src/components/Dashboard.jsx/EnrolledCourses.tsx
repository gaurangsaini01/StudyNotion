import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../redux/hooks";
import {
  type EnrolledCourse,
  getUserEnrolledCourses,
} from "../../services/operations/profileAPI";
import EnrolledCourseCard from "./EnrolledCourseCard";
import QuizModal from "./QuizModal";

function EnrolledCourses() {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  const [enrolledCourses, setEnrolledCourses] = useState<
    EnrolledCourse[] | null
  >(null);
  const [quizModal, setQuizModal] = useState<EnrolledCourse | null>(null);

  const getEnrolledCourses = async () => {
    if (!token) return;
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch {
      /* no-op */
    }
  };

  useEffect(() => {
    getEnrolledCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-white md:px-7 py-7 space-y-6 md:space-y-0 px-4">
      <div className="text-3xl font-bold">Enrolled Courses </div>
      (
      <span className="max-w-3xl px-1 py-3 text-sm text-richblack-100">
        Once you complete 60% of a course, you can unlock an AI-generated quiz
        tailored to that course and assess how confidently you have understood
        the material.
      </span>
      )
      {!enrolledCourses ? (
        <div>Loading...</div>
      ) : !enrolledCourses.length ? (
        <p className="text-red-500 font-semibold text-2xl my-10">
          You have not enrolled in any course yet
        </p>
      ) : (
        <div className="flex flex-col  w-full">
          <div className="md:flex hidden bg-richblack-700 my-6 pl-6 rounded-md py-4">
            <p className="w-1/2">Course Name</p>
            <div className="flex justify-between items-center w-full pr-20">
              <p className="">Category</p>
              <p className="">Instructor Name</p>
              <p>Progress</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:pl-6">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard
                key={course._id}
                navigate={navigate}
                course={course}
                setQuizModal={setQuizModal}
              />
            ))}
          </div>
        </div>
      )}
      {quizModal && (
        <QuizModal course={quizModal} setQuizModal={setQuizModal} />
      )}
    </div>
  );
}

export default EnrolledCourses;
