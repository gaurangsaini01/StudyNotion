import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { getCourseProgress } from "../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";

function EnrolledCourseCard({ course, navigate }) {
  console.log(course);
  const { token } = useSelector((state) => state.auth);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function getProgress() {
      const completedLectures = await getCourseProgress(
        { courseId: course._id },
        token
      );
      console.log("completedLectures", completedLectures);

      let totalLectures = course?.courseContent?.reduce((acc, section) => {
        return acc + (section?.subSection.length || 0);
      }, 0);
      console.log("totalLectures", totalLectures);
      setProgress((completedLectures/totalLectures)*100);
    }
    getProgress();
  }, []);

  return (
    <div className="flex items-center">
      <div
        onClick={() =>
          navigate(
            `/viewcourse/${course._id}/section/${course?.courseContent?.[0]._id}/subsection/${course?.courseContent?.[0]?.subSection?.[0]?._id}`
          )
        }
        className="cursor-pointer flex gap-4 w-1/2 items-center"
      >
        <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
          <img
            className="h-full w-full object-contain"
            src={course.thumbnail}
          />
        </div>
        <div className="flex gap-1 flex-col">
          <p>{course.courseName}</p>
          <p className="text-sm text-richblack-300">
            {course.courseDescription}
          </p>
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="text-sm text-richblack-200">
          {course?.category?.name}
        </div>
        <div className="text-sm text-richblack-200">
          {course?.instructor?.firstName}
        </div>
        <div className="min-w-[250px] flex flex-col gap-2">
          <div className="text-sm text-richblack-200">
            Progress : {progress}%
          </div>
          <ProgressBar
            height="10px"
            bgColor="#2274cd"
            baseBgColor="#d9d9d9"
            isLabelVisible={false}
            completed={progress}
          />
        </div>
      </div>
    </div>
  );
}

export default EnrolledCourseCard;
