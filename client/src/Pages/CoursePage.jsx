import React from 'react'
import { useParams } from 'react-router-dom';

function CoursePage() {
    const {courseid:courseId} = useParams();
    function handleBuy(){
        if(token){
            buyCourse();
            return;
        }
        else{
            navigate("/login")
        }
    }
  return (
    <div>
        <button onClick={handleBuy} className='bg-yellow-50 text-black px-4 py-2 rounded-md text-center' >Buy Now</button>
    </div>
  )
}

export default CoursePage