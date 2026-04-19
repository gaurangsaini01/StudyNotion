import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { buyCourse } from "../../../services/operations/studentFeaturesAPI";
import IconBtn from "../../reusable/IconBtn";

export default function RenderTotalAmount() {
  const { total, cart } = useAppSelector((state) => state.cart);
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleBuyCourse = () => {
    if (!token || !user) return;
    const courses = cart.map((course) => course._id);
    buyCourse(navigate, dispatch, courses, token, user);
  };

  return (
    <div className="md:min-w-[280px] min-w-full mt-12 md:mt-0 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-2 text-sm font-semibold text-richblack-300">Total:</p>
      <p className="mb-4 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}
