import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesAPI";

function CoursePage() {
  const { courseid: courseId } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleBuy() {
    if (token) {
      buyCourse(navigate, dispatch, [courseId], token, user);
      return;
    } else {
      navigate("/login");
    }
  }
  return (
    <div>
      <button
        onClick={handleBuy}
        className="bg-yellow-50 text-black px-4 py-2 rounded-md text-center"
      >
        Buy Now
      </button>
    </div>
  );
}

export default CoursePage;
