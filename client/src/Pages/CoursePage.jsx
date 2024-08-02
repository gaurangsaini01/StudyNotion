import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import GetAvgRating from "../utils/averageRating";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import ReactStars from "react-rating-stars-component";
import ConfirmationModal from "../components/reusable/Confirmationmodal";
import { IoIosGlobe } from "react-icons/io";

function CoursePage() {
  //modal
  const [open, setOpen] = useState(false);
  const { courseid: courseId } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState(null);
  const [rating, setRating] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);
  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        setCourseData(result?.data);
      } catch (error) {
        console.log("Could not fetch coursse details");
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  useEffect(() => {
    const count = GetAvgRating(courseData?.ratingAndReviews);
    setRating(count);
    GetAvgRating();
  }, [courseData]);

  console.log("CourseData", courseData);

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(navigate, dispatch, [courseId], token, user);
      return;
    }
    setOpen(true);
    setConfirmationModal({
      text1: "You are not Logged in",
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <div className="text-richblack-5">
      <div className="bg-richblack-800">
        <div className="py-8 relative p-4 w-10/12 mx-auto  ">
          <div className="w-3/4 ">
            <div className="flex text-sm gap-2 mb-6">
              <p
                onClick={() => navigate("/")}
                className=" cursor-pointer hover:underline"
              >
                Home{" "}
              </p>
              <p>/</p>
              <p>Catalog </p>
              <p>/</p>
              <p
                onClick={() =>
                  navigate(
                    `/catalog/${courseData?.category?.name}/${courseData?.category?._id}`
                  )
                }
                className="capitalize hover:underline cursor-pointer"
              >
                {courseData?.category?.name}
              </p>
              <p>/</p>
              <p className="text-yellow-50 capitalize cursor-pointer hover:underline">
                {courseData?.courseName}
              </p>
            </div>
            <div className="text-3xl font-semibold">
              {courseData?.courseName}
            </div>
            <div className="text-richblack-300 mb-2">
              {courseData?.courseDescription}
            </div>
            <div className="flex items-center gap-2 text-richblack-300">
              <div className="text-[#FFD60A]">{rating}</div>
              <div>
                <ReactStars
                  count={5}
                  edit={false}
                  value={rating}
                  size={24}
                  activeColor="#FFD60A"
                />
              </div>
              <div className="text-sm">
                ({courseData?.ratingAndReviews?.length} Ratings)
              </div>
              <div>
                {courseData?.studentsEnrolled?.length} Students Enrolled
              </div>
            </div>
            <div className="mt-2 text-richblack-300">
              Created By - {courseData?.instructor?.firstName}{" "}
              {courseData?.instructor?.lastName}
            </div>
            <div className="flex items-center gap-2 text-richblack-300 mt-2">
              <IoIosGlobe />
              <div>English</div>
            </div>
          </div>
          <div className="absolute p-4 w-[350px] rounded-xl min-h-[400px] bg-richblack-700 right-0 top-10">
            <div className="w-full h-[200px] overflow-hidden rounded-md ">
              <img
                className="w-full h-full object-contain"
                src={courseData?.thumbnail}
                alt="Course Thumbnail was Here"
              />
            </div>
            <div className="text-3xl font-semibold">
              Rs. {courseData?.price}
            </div>
            <div className="space-y-4 my-6">
              <button className="w-full text-center py-2 bg-yellow-100 text-black rounded-xl">
                Add To Cart
              </button>
              <button
                className="bg-yellow-50 w-full rounded-xl py-2 text-center text-richblack-900"
                onClick={
                  user &&
                  courseData?.studentsEnrolled.some(
                    (studentId) => studentId._id.toString() === user.id
                  )
                    ? () => navigate("/dashboard/enrolled-courses")
                    : handleBuyCourse
                }
              >
                {user &&
                courseData?.studentsEnrolled.some(
                  (studentId) => studentId._id.toString() === user._id
                )
                  ? "Go to Course "
                  : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {confirmationModal && (
        <ConfirmationModal
          open={open}
          handleClose={() => setOpen(false)}
          modalData={confirmationModal}
        />
      )}
    </div>
  );
}

export default CoursePage;
