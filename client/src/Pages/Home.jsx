import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/Home/reusable/HighlightText";
import CTAButton from "../components/Home/reusable/CTAButton";
import banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/Home/CodeBlocks";
import gradientyellow from "../assets/Images/gradientyellow.svg";
import gradientblue from "../assets/Images/gradientblue.svg";

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
        <div className="md:text-4xl text-3xl text-left md:text-center font-semibold mt-6">
          Empower Your Future With
          <HighlightText text={"Coding Skills"} />
        </div>
        <div className="mt-4 w-full md:w-[80%] text-left md:text-center text-base md:text-lg font-medium text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.{" "}
        </div>
        <div className="flex flex-row mt-8 gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>
        <div className="w-[90%] relative my-16 shadow-[0_-20px_40px_rgba(8,_112,_184,_0.7)]">
          <div className="absolute w-full h-full bg-white top-2 left-2 md:top-4 md:left-4 z-10"></div>
          <video className="z-50 relative" muted loop autoPlay>
            <source src={banner} />
          </video>
        </div>
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="md:text-4xl text-3xl leading-snug font-bold">
                Unlock Your{" "}
                <HighlightText text={"Coding Potential "}></HighlightText>
                With Our Online Courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              text: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{ text: "Learn More", linkto: "/login", active: false }}
            codeblock={`1. <!DOCTYPE html> \n2. <html> \n3. <head> \n4. <title>Study Notion</title> \n5. </head> \n6. <body> \n7. <h1 className="text-green-500">Learn New Coding Skills</h1> \n8. <p>From StudyNotion anytime , anywhere.</p> \n9. <nav><ahref="one/">One</a> <p> hello </p> \n10.  </body> \n11. </html>`}
            codeColor={`text-white`}
            gradientimg={gradientyellow}
          />
        </div>
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="md:text-5xl text-3xl leading-snug font-bold">
                Start{" "}
                <HighlightText text={"Coding In Seconds "}></HighlightText>
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              text: "Continue Lesson",
              linkto: "/login",
              active: true,
            }}
            ctabtn2={{ text: "Learn More", linkto: "/login", active: false }}
            codeblock={`1. <!DOCTYPE html> \n2. <html> \n3. <head> \n4. <title>Study Notion</title> \n5. </head> \n6. <body> \n7. <h1 className="text-green-500">Learn New Coding Skills</h1> \n8. <p>From StudyNotion anytime , anywhere.</p> \n9. <nav><ahref="one/">One</a> <p> hello </p> \n10.  </body> \n11. </html>`}
            codeColor={`text-white`}
            gradientimg={gradientblue}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
