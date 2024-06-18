import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/Home/reusable/HighlightText";
import CTAButton from "../components/Home/reusable/CTAButton";
import banner from "../assets/Images/banner.mp4"

const Home = () => {
  return (
    <div className="w-full">
      <div className="relative w-11/12 mx-auto flex flex-col max-w-maxContent items-center text-white justify-between">
        <Link to="/signup">
          <div className="mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex hover:bg-richblack-900  items-center px-10 py-[6px] gap-2 rounded-full transition-all duration-200">
              <p className="text-white">Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="text-4xl text-center font-semibold mt-6">
          Empower Your Future With
          <HighlightText text={"Coding Skills"} />
        </div>
        <div className="mt-4 w-[80%] text-center text-lg font-medium text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.{" "}
        </div>
        <div className="flex flex-row mt-8 gap-7">
          <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
          <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
        </div>
        <div>
            <video muted loop autoPlay>
                <source src={banner} />
            </video>
        </div>
      </div>
    </div>
  );
};

export default Home;
