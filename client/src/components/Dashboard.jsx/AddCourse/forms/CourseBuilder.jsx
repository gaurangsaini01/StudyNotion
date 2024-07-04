import React from 'react'
import { useDispatch } from 'react-redux'
import { setStep } from "../../../../redux/slices/courseSlice";

function CourseBuilder() {
  const dispatch=useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(setStep(0))} className='text-white'>back</button>
    </div>
  )
}

export default CourseBuilder