import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";

import useWindowWidth from "../../hooks/useWindowWidth";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";
import type { RatingAndReview } from "../../types/domain";
import { StarRating } from "../StarComponent/Star";

interface ReviewWithCourse extends Omit<RatingAndReview, "course"> {
  course?:
    | {
        courseName: string;
      }
    | string;
}

function ReviewSlider() {
  const width = useWindowWidth();
  const [reviews, setReviews] = useState<ReviewWithCourse[]>([]);
  const truncateWords = 15;

  useEffect(() => {
    async function reviewDedo() {
      const result = await apiConnector<{ success: boolean; data: ReviewWithCourse[] }>(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      if (result?.data?.success) {
        setReviews(result?.data?.data);
      }
    }
    reviewDedo();
  }, []);

  return (
    <div className="text-white ">
      <div className="my-[50px] h-[184px] mx-auto max-w-[350px] md:max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={width > 1300 ? 4 : width > 900 ? 2 : 1}
          spaceBetween={25}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="w-full "
        >
          {reviews.map((review, i) => {
            const courseName =
              typeof review.course === "object" && review.course
                ? review.course.courseName
                : "";
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col h-full gap-3 bg-richblack-800 p-5 rounded-md text-[14px] text-richblack-25">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img
                        src={
                          review?.user?.image
                            ? review?.user?.image
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                        }
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">
                        {`${review?.user?.firstName ?? ""} ${review?.user?.lastName ?? ""}`}
                      </h1>
                      <h2 className="text-[12px] font-medium text-richblack-400">
                        {courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-200  h-[50px]">
                    {(review?.review ?? "").split(" ").length > truncateWords
                      ? `${(review?.review ?? "")
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review ?? ""}`}
                  </p>
                  <div className="flex items-center gap-2 ">
                    <h3 className="font-semibold text-base text-yellow-100">
                      {review.rating.toFixed(1)}
                    </h3>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
