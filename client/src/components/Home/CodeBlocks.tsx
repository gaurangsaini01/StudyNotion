import { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

import CTAButton from "../reusable/CTAButton";

interface CodeBlockButton {
  text: string;
  active: boolean;
  linkto: string;
}

interface CodeBlocksProps {
  position: string;
  heading: ReactNode;
  subheading: ReactNode;
  ctabtn1: CodeBlockButton;
  ctabtn2: CodeBlockButton;
  codeblock: string;
  gradientimg: string;
}

function CodeBlocks({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  gradientimg,
}: CodeBlocksProps) {
  return (
    <div
      className={`flex md:flex-row flex-col md:my-16 my-10 ${position}  gap-10 `}
    >
      <div className="md:w-[50%] w-full flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-medium">{subheading}</div>

        <div className="flex gap-7  mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 text-sm md:text-base items-center">
              {ctabtn1.text}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.text}
          </CTAButton>
        </div>
      </div>
      <div className="md:w-[50%] min-h-[370px] md:min-h-[300px] w-full relative bg-[#050f1d] p-4 rounded-md flex">
        <img
          className="absolute left-[-150px] top-[-100px]"
          width={500}
          src={gradientimg}
        />
        <TypeAnimation
          sequence={[codeblock, 2000, ""]}
          speed={75}
          repeat={Infinity}
          deletionSpeed={45}
          cursor={true}
          style={{
            whiteSpace: "pre-line",
          }}
          className="font-mono font-bold text-transparent bg-gradient-to-r from-[#ffffff] to-[#3fd1c2] bg-clip-text"
        />
      </div>
    </div>
  );
}

export default CodeBlocks;
