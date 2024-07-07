import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../reusable/IconBtn";
import { MdAddCircleOutline } from "react-icons/md";
import { BiAddToQueue } from "react-icons/bi";
import { BiRightArrow } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setStep,
  setCourse,
  setEditCourse,
} from "../../../../redux/slices/courseSlice";

function CourseBuilder() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [editSectionName, setEditSectionName] = useState(null);
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("UPDATED");
  }, [course]);
  return (
    <div>
      <button onClick={() => dispatch(setStep(0))} className="text-white">
        back
      </button>
    </div>
  );
}

export default CourseBuilder;
