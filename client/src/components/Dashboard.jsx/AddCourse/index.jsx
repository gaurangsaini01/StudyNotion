import React from "react";
import RenderSteps from "./RenderSteps";
import { useSelector } from "react-redux";

function AddCourse() {
  const {editCourse} = useSelector((state)=>state.course)
  return (
    <div className="text-richblack-5 p-6  w-[80%] mx-auto">
      <h1 className="text-3xl">{editCourse?"Edit Course":"Add Course"}</h1>
      <div className="flex gap-6 mt-6 justify-between">
        <div className="">
          <div>
            <RenderSteps />
          </div>
        </div>
        <div className="w-[50%]">
          <p>Code Upload Tips</p>
          <ul>
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