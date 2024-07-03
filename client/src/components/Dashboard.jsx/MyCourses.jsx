import React, { useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { getUserEnrolledCourses } from "../../services/operations/profileAPI";
import { useSelector } from "react-redux";
import { FaRupeeSign } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

function MyCourses() {
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
    <div className="text-richblack-5 p-6 w-11/12">
      <div className="flex justify-between">
        <h1 className="text-3xl">My Courses</h1>
        <button className="flex font-semibold items-center hover:scale-95 transition-all duration-100 ease-out gap-1 bg-yellow-100 text-black px-4 py-2 rounded-md">
          <GoPlusCircle size={20} />
          <p>New</p>
        </button>
      </div>
      <div>
        {!enrolledCourses ? (
          <div>Loading...</div>
        ) : !enrolledCourses.length ? (
          <p className="text-red-500 font-semibold text-2xl my-10">
            You have not Published Any Course Yet.
          </p>
        ) : (
          <div className="flex flex-col w-full border-[1px] rounded-md mt-6 border-richblack-700 pb-6">
            <div className="flex  bg-richblack-700 mb-6 pl-6 border-b-[1px] border-b-richblack-300 rounded-md py-4">
              <p className="w-[55%]">Courses</p>
              <p className="w-[15%]">Category</p>
              <p className="w-[15%]">Price</p>
              <p className="w-[15%]">Actions</p>
            </div>
            {/* Cards starting */}
            <div className="flex flex-col gap-10 pl-6">
              {enrolledCourses.map((course, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex gap-4 w-[55%]">
                    <img
                      className="w-44 h-32 rounded-md object-cover"
                      src={course.thumbnail}
                    />
                    <div className="flex gap-1 flex-col">
                      <p className="text-xl font-semibold">{course.courseName}</p>
                      <p className="text-sm text-richblack-300">
                        {course.courseDescription}
                      </p>
                    </div>
                  </div>
                  <div className="w-[15%]">{course.category[0].name}</div>
                  <div className="w-[15%] flex items-center gap-1 text-yellow-100"><FaRupeeSign/> {course.price}</div>
                  <div className="w-[15%] flex items-center gap-2 text-xl text-richblack-200"><MdModeEdit/><RiDeleteBin5Line/></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;
