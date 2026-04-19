import { useEffect, useState } from "react";
import { PiSmileySadLight } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

import CourseCard from "../components/Catalog/CourseCard";
import Footer from "../components/Footer";
import useWindowWidth from "../hooks/useWindowWidth";
import { useAppSelector } from "../redux/hooks";
import {
  type CatalogCategory,
  getCatalogPageData,
} from "../services/operations/catalogAPI";
import type { Course } from "../types/domain";

function Catalog() {
  const width = useWindowWidth();
  const navigate = useNavigate();
  const [categoryDetails, setCategoryDetails] = useState<CatalogCategory | null>(
    null
  );
  const [selectedCategoryCourses, setSelectedCategoryCourses] = useState<
    Course[] | null
  >(null);
  const [differentCategories, setDifferentCategories] = useState<
    CatalogCategory[] | null
  >(null);
  const params = useParams<{ categoryid: string }>();
  const recommendedCourses = useAppSelector(
    (state) => state.recommendation.courses
  );
  const categoryId = params.categoryid ?? "";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData(id: string) {
      setLoading(true);
      const result = await getCatalogPageData(id);
      if (result) {
        setSelectedCategoryCourses(
          result?.selectedCategoryCourses?.courses ?? []
        );
        setDifferentCategories(result?.differentCategoryCourses ?? []);
        setCategoryDetails(result?.selectedCategoryCourses ?? null);
      }
      setLoading(false);
    }
    if (categoryId) {
      getData(categoryId);
    }
  }, [categoryId]);

  return (
    <>
      {!loading ? (
        <div className="flex text-richblack-5 flex-col pb-20">
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

            {selectedCategoryCourses && selectedCategoryCourses.length > 0 ? (
              <Swiper
                slidesPerView={width > 1300 ? 3 : width > 900 ? 2 : 1}
                loop={true}
                modules={[Autoplay]}
                autoplay={{
                  delay: 1500,
                  disableOnInteraction: false,
                }}
                className="mySwiper"
              >
                {selectedCategoryCourses?.map((course, index) => (
                  <SwiperSlide key={index}>
                    <CourseCard course={course} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-yellow-50 flex items-center gap-4">
                <PiSmileySadLight size={30} />
                Sorry Currently No courses are present for this category
              </div>
            )}
          </div>

          <div className="w-10/12 mx-auto py-10">
            <div className="text-3xl font-semibold capitalize py-12">
              Other Popular Courses from Different Categories
            </div>
            {differentCategories && differentCategories.length > 0 ? (
              <Swiper
                slidesPerView={width > 1300 ? 3 : width > 900 ? 2 : 1}
                loop={true}
                modules={[Autoplay]}
                autoplay={{
                  delay: 1500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                className="mySwiper"
              >
                {differentCategories?.flatMap((category) =>
                  (category?.courses ?? []).map((course) => (
                    <SwiperSlide key={course._id}>
                      <CourseCard course={course} />
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            ) : (
              <div className="text-yellow-50 flex items-center gap-4">
                <PiSmileySadLight size={30} />
                Sorry Currently No More Similar Courses are Present
              </div>
            )}
          </div>
          {recommendedCourses?.length > 0 && (
            <div className="mx-auto w-10/12 flex flex-col gap-12 py-2">
              <div className="text-3xl font-semibold capitalize">
                <span className="text-yellow-200">AI</span>-Based Recommendations
                for you (Based on your past purchases)
              </div>

              <Swiper
                slidesPerView={width > 1300 ? 3 : width > 900 ? 2 : 1}
                loop={recommendedCourses.length > 3}
                modules={[Autoplay]}
                autoplay={{
                  delay: 1800,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                className="mySwiper"
              >
                {recommendedCourses?.map((course) => (
                  <SwiperSlide key={course?._id}>
                    <CourseCard
                      course={course}
                      recommendationReason={course?.recommendationReason}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      ) : (
        <div className="h-screen flex items-center gap-4 justify-center  ">
          <div className="text-3xl font-semibold text-richblack-5">Loading</div>
          <div className="loader"></div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Catalog;
