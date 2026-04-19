import know_your_progress from "../../assets/Images/Know_your_progress.svg";
import compare_with_others from "../../assets/Images/Compare_with_others.svg";
import plan_your_lesson from "../../assets/Images/Plan_your_lessons.svg";
import CTAButton from "../reusable/CTAButton";

const LearningLanguageSection = () => {
  return (
    <div className="xl:mt-[130px] md:mt-2 mt-3 pb-32 w-11/12 mx-auto">
      <div className="flex flex-col gap-5 items-center">
        <div className="md:text-4xl text-3xl font-semibold text-left md:text-center">
          Built For
          <span className="font-bold text-transparent bg-gradient-to-t from-[#3a79ff] to-[#30c5fa] bg-clip-text">
            {" "}Progress-Aware Learning
          </span>
        </div>

        <div className="md:text-center text-left text-richblack-600 mx-auto text-base font-medium md:w-[60%] w-full">
          Track progress, unlock AI-generated quizzes at the right time, compare
          learning momentum, and move through lessons with a clearer sense of
          what to study next.
        </div>

        <div className="flex md:flex-row flex-col mx-auto items-center mt-5 ">
          <img src={know_your_progress} className="object-contain md:-mr-32 mr-0" />
          <img src={compare_with_others} className="object-contain " />
          <img src={plan_your_lesson} className="object-contain md:-ml-36 ml-0 block md:hidden xl:block" />
        </div>

        <div className="w-fit">
          <CTAButton active={true} linkto={"/signup"}>
            <div>See How It Works</div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
