import React from "react";
import RenderSteps from "./RenderSteps";
import { AiTwotoneThunderbolt } from "react-icons/ai";
import { useSelector } from "react-redux";

function AddCourse() {
  const { editCourse } = useSelector((state) => state.course);
  return (
    <div className="text-richblack-5 p-6 w-full mx-auto">
      <h1 className="text-3xl">{editCourse ? "Edit Course" : "Add Course"}</h1>
      <div className="flex mt-6 justify-between">
        <div className="w-8/12">
          <RenderSteps />
        </div>
        <div className="w-4/12 h-fit bg-richblack-800 rounded-xl p-4 mr-10">
          <p className="text-xl flex items-center gap-2 font-semibold">
            <AiTwotoneThunderbolt color="#CFAB08" />
            <p>Code Upload Tips</p>
          </p>
          <ul className="list-disc pl-4 mt-2 text-sm gap-2 flex flex-col text-richblack-200">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
