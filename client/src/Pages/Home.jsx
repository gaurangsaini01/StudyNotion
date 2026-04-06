import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/reusable/HighlightText";
import CTAButton from "../components/reusable/CTAButton";
import banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/Home/CodeBlocks";
import gradientyellow from "../assets/Images/gradientyellow.svg";
import gradientblue from "../assets/Images/gradientblue.svg";
import TimeLine from "../components/Home/TimeLine";
import Footer from "../components/Footer";
import LearningLanguageSection from "../components/Home/LearningLanguageSection";
import InstructorSection from "../components/Home/InstructorSection";
import ExploreMore from "../components/Home/ExploreMore";
import ReviewSlider from "../components/reusable/ReviewSlider";

const Home = () => {
  return (
    <div className="w-full">
      {/* //section 1 */}
      <div className="relative w-11/12 mx-auto flex flex-col max-w-maxContent items-center text-white justify-between">
        <Link to="/signup">
          <div className="md:mt-16 mt-8  p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex hover:bg-richblack-900 items-center px-10 py-[6px] gap-2 rounded-full transition-all duration-200">
              <p className="text-white">Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="md:text-4xl text-3xl text-left md:text-center font-semibold mt-6">
          Learn Smarter With
          <HighlightText text={"AI-Powered Courses"} />
        </div>
        <div className="mt-4 w-full md:w-[80%] text-left md:text-center text-base md:text-lg font-medium text-richblack-300">
          CourseNova AI combines structured courses with AI-generated quizzes,
          personalized course recommendations, progress-based learning flows,
          and instructor-led content so learners can move from watching lessons
          to actually understanding them.
        </div>
        <div className="flex flex-row mt-8 gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Start Learning
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Explore Courses
          </CTAButton>
        </div>
        <div className="w-[90%] relative mb-8 mt-12 md:my-16 ">
          <div className="absolute w-full h-full bg-white top-2 left-2 md:top-4 md:left-4 z-10"></div>
          <video className="z-40 relative" muted loop autoPlay>
            <source src={banner} />
          </video>
        </div>
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="md:text-4xl text-3xl leading-snug font-bold">
                Turn Course Progress Into
                <HighlightText text={" AI-Guided Practice "}></HighlightText>
              </div>
            }
            subheading={
              "As learners progress through a course, CourseNova AI can generate quizzes from course context to help them assess retention and build confidence with practical feedback."
            }
            ctabtn1={{
              text: "Explore AI Quizzes",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{ text: "See Platform", linkto: "/login", active: false }}
            codeblock={`1. course: "MERN Bootcamp"\n2. progress: 68%\n3. feature: "AI Quiz Unlocked"\n4. input: courseName + courseDescription\n5. AI service: generate MCQs\n6. learner: attempts quiz\n7. platform: evaluates instantly\n8. result: score + retry flow`}
            codeColor={`text-white`}
            gradientimg={gradientyellow}
          />
        </div>
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="md:text-5xl text-3xl leading-snug font-bold">
                Discover Your Next Course With
                <HighlightText text={" Personalized AI Recommendations "}></HighlightText>
              </div>
            }
            subheading={
              "Instead of forcing learners to browse endlessly, CourseNova AI can surface relevant course suggestions with recommendation reasons based on profile context and platform data."
            }
            ctabtn1={{
              text: "View Recommendations",
              linkto: "/login",
              active: true,
            }}
            ctabtn2={{ text: "Browse Catalog", linkto: "/login", active: false }}
            codeblock={`1. user logs in\n2. recommendation API runs\n3. response returns courseIds + reasons\n4. client hydrates full course cards\n5. catalog shows personalized picks\n6. learner gets relevant discovery,\n7. not just static listings`}
            codeColor={`text-white`}
            gradientimg={gradientblue}
          />
        </div>
        <ExploreMore />
      </div>

      {/* Section 2 */}

      <div className="bg-puregreys-25 text-richblack-700 ">
        <div className="homepage_bg flex h-[150px] md:h-[300px]">
          <div className="w-11/12 max-w-maxContent flex justify-center items-center gap-5 mx-auto">
            <div className="flex gap-7 text-sm md:text-base text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex gap-2 items-center">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>
        <TimeLine />
        <LearningLanguageSection />
      </div>

      {/* //section3 */}

      <div className="w-11/12 mx-auto max-w-maxContent flex flex-col gap-24 my-10 items-center bg-richblack-900 text-white mb-8">
        <div>
          <InstructorSection />
        </div>
        <div>
          <h2 className="text-center text-4xl font-semibold">
            What Learners Are Saying
          </h2>
          <ReviewSlider />
        </div>
      </div>

      {/* //footeer */}
      <Footer />
    </div>
  );
};

export default Home;
