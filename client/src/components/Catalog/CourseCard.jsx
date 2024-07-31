import React from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";

function CourseCard({ course }) {
    const shortDesc = course?.courseDescription.substr(0,37)+'...';
  return (
    <div className=" bg-richblack-800 p-4 rounded-xl flex  flex-col w-[350px] hover:scale-95 transition-all duration-300 cursor-pointer ease-in-out shadow-2xl shadow-blue-500/20">
      <div className="w-full rounded-md h-[200px] overflow-hidden">
        <img
          className="w-full h-full object-contain"
          src={course?.thumbnail}
          alt=""
        />
      </div>
      <div className=" flex flex-col gap-2 mt-4">
        <h1 className="capitalize font-semibold text-left text-richblack-5 ">{course?.courseName}</h1>
        <p className="text-sm text-left text-richblack-400">{course?.courseDescription.length>37?(shortDesc):(course?.courseDescription)}</p>
        <p className="text-sm capitalize text-left text-richblack-400">
          Instructor: {course?.instructor?.firstName}{" "}
          {course?.instructor?.lastName}
        </p>
        {/* <div>Rating:-</div> */}
        <div className="font-medium text-sm flex items-center"><MdOutlineCurrencyRupee size={20}/>{course?.price}</div>
      </div>
    </div>
  );
}

export default CourseCard;
