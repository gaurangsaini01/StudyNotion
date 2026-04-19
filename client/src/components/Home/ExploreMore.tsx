import { useState } from "react";

import { HomePageExplore } from "../../data/homepage-explore";
import type { ExploreCourse } from "../../types/ui";
import HighlightText from "../reusable/HighlightText";
import CourseCard from "./CourseCard";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState<string>(tabsName[0]);
  const [courses, setCourses] = useState<ExploreCourse[]>(
    HomePageExplore[0].courses
  );
  const [currentCard, setCurrentCard] = useState<string>(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value: string) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    }
  };

  return (
    <div>
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Explore the
          <HighlightText text={" CourseNova AI Experience"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
            Structured learning, AI support, and practical outcomes in one place
          </p>
        </div>
      </div>

      <div className="hidden lg:flex gap-3 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((tab, index) => (
          <div
            className={` text-[16px] flex flex-row items-center gap-2 ${
              currentTab === tab
                ? "bg-richblack-900 text-richblack-5 font-medium"
                : "text-richblack-200"
            } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
            key={index}
            onClick={() => setMyCards(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="hidden lg:block lg:h-[300px]"></div>

      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[80px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => (
          <CourseCard
            key={index}
            cardData={ele}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
