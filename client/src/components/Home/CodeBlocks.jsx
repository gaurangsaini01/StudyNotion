import React from "react";
import { FaArrowRight } from "react-icons/fa";
import CTAButton from "./reusable/CTAButton";
import { TypeAnimation } from "react-type-animation";
function CodeBlocks({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  gradientimg,
  codeColor
}) {
  return (
    <div className={`flex md:flex-row flex-col md:my-16 my-10 ${position}  gap-10 `}>
      <div className="md:w-[50%] w-full flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-medium">{subheading}</div>

        <div className="flex gap-7  mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.text}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.text}
          </CTAButton>
        </div>
      </div>
      <div className="md:w-1/2  w-full relative bg-[#050f1d] p-4 rounded-md flex">
        <img
          className="absolute left-[-150px] top-[-100px]"
          width={500}
          src={gradientimg}
          alt=""
        />
        <div
          className={`w-full font-mono flex flex-col gap-2 font-bold ${codeColor}`}
        >
          <TypeAnimation
            sequence={[codeblock, 2000]}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeBlocks;
