import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";

function EnrolledCourses() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to Fetch Enrolled Courses");
    }
  };
  console.log(enrolledCourses);

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="text-white p-7">
      <div className="text-3xl font-bold">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div>Loading...</div>
      ) : !enrolledCourses.length ? (
        <p className="text-red-500 font-semibold text-2xl my-10">
          You have not enrolled in any course yet
        </p>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex bg-richblack-700 my-6 pl-6 rounded-md py-4">
            <p className="w-1/2">Course Name</p>
            <p className="w-1/4">Category</p>
            <p className="w-1/4">Instructor Name</p>
          </div>
          {/* Cards starting */}
          <div className="flex flex-col gap-3 pl-6">
            {enrolledCourses.map((course, index) => (
              <div key={index} className="flex items-center">
                <div onClick={()=>navigate(`/courses/${course?._id}`)} className="cursor-pointer flex gap-4 w-1/2 items-center">
                  <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
                    <img className="h-full w-full object-contain" src={course.thumbnail} />
                  </div>
                  <div className="flex gap-1 flex-col">
                    <p>{course.courseName}</p>
                    <p className="text-sm text-richblack-300">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>
                <div className="w-1/4">{course?.category?.name}</div>
                <div className="w-1/4">{course?.instructor?.firstName}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrolledCourses;
