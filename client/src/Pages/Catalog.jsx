import React, { useEffect, useRef, useState } from "react";
import { getCatalogPageData } from "../services/operations/catalogAPI";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CourseCard from "../components/Catalog/CourseCard";
import useWindowWidth from "../hooks/useWindowWidth";

function Catalog() {
  //custom Hook
  const width = useWindowWidth();
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [selectedCategoryCourses, setSelectedCategoryCourses] = useState(null);
  const [differentCategories, setDifferentCategories] = useState(null);
  const params = useParams();
  const categoryId = params.categoryid;

  async function getData(categoryId) {
    const result = await getCatalogPageData(categoryId);
    console.log(result);
    if (result) {
      setSelectedCategoryCourses(result?.selectedCategoryCourses?.courses);
      setDifferentCategories(result?.differentCategoryCourses);
      setCategoryDetails(result?.selectedCategoryCourses);
      return;
    } else {
      return;
    }
  }
  useEffect(() => {
    getData(categoryId);
  }, [categoryId]);
  console.log("selectedCategoryCourses", selectedCategoryCourses);
  console.log("differentCategories", differentCategories);
  console.log("categoryDetails", categoryDetails);
  const navigate = useNavigate();
  return (
    <div className="flex text-richblack-5 flex-col">
      <div className="min-h-[200px] py-10 bg-richblack-800">
        <div className="w-10/12 mx-auto flex flex-col gap-4">
          <div className="flex text-sm gap-2">
            <p
              onClick={() => navigate("/")}
              className=" cursor-pointer hover:underline"
            >
              Home{" "}
            </p>
            <p>/</p>
            <p>Catalog </p>
            <p>/</p>
            <p className="text-yellow-50 cursor-pointer hover:underline">
              {categoryDetails?.name}
            </p>
          </div>
          <h1 className="text-3xl font-medium">{categoryDetails?.name}</h1>
          <p className="text-sm w-10/12 text-richblack-300">
            {categoryDetails?.description}
          </p>
        </div>
      </div>
      <div className="mx-auto w-10/12 flex flex-col gap-12 py-10">
        <div className="text-3xl font-semibold capitalize">
          Courses to get you started with {categoryDetails?.name}
        </div>

        <Swiper
          slidesPerView={width > 1300 ? 3 : width > 900 ? 2 : 1}
          loop={true}
          className="mySwiper"
        >
          {selectedCategoryCourses?.map((course, index) => {
            return (
              <SwiperSlide key={index}>
                <CourseCard course={course} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default Catalog;
