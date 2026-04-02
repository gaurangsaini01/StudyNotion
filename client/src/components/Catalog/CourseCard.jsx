import React, { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FiInfo } from "react-icons/fi";
import GetAvgRating from "../../utils/averageRating";

import { useNavigate } from "react-router-dom";
import { StarRating } from "../StarComponent/Star";

function CourseCard({ course, recommendationReason }) {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews);
    setAvgRating(count);
  }, [course]);

  const shortDesc = course?.courseDescription.substr(0, 37) + "...";
  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      className="relative bg-richblack-800 p-4 rounded-xl flex flex-col w-[350px] hover:scale-95 transition-all duration-300 cursor-pointer ease-in-out shadow-2xl shadow-blue-500/20"
    >
      {recommendationReason && (
        <div
          className="group absolute right-3 top-3 z-20"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative flex items-center justify-center">
            <div className="rounded-full bg-richblack-700/90 p-2 text-yellow-50">
              <FiInfo size={16} />
            </div>
            <div className="pointer-events-none absolute right-0 top-11 hidden w-64 rounded-lg border border-richblack-600 bg-richblack-900 p-3 text-xs text-richblack-50 shadow-lg group-hover:block">
              {recommendationReason}
            </div>
          </div>
        </div>
      )}
      <div className="w-full rounded-md h-[200px] overflow-hidden">
        <img
          className="w-full h-full object-contain"
          src={course?.thumbnail}
          alt=""
        />
      </div>
      <div className=" flex flex-col gap-1 mt-4">
        <p className="text-sm text-left text-richblack-400">
          {course?.courseDescription.length > 37
            ? shortDesc
            : course?.courseDescription}
        </p>
        <h1 className="capitalize font-semibold text-left text-richblack-5 ">
          {course?.courseName}
        </h1>
        <div className=" text-yellow-50 flex gap-2 items-center">
          <div className="pt-1 ">{avgRating}</div>

          <StarRating rating={avgRating} />
          <div className="text-sm"> ({course?.ratingAndReviews?.length})</div>
        </div>
        <p className="text-sm capitalize text-left text-richblack-400">
          Instructor: {course?.instructor?.firstName}{" "}
          {course?.instructor?.lastName}
        </p>

        <div className="font-medium mt-2 flex items-center">
          <MdOutlineCurrencyRupee size={20} />
          {course?.price}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
