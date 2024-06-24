import React from "react";
import { useSelector } from "react-redux";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom"
import { logout } from "../../services/operations/authAPI";

function ProfileDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handlelogout(){
    dispatch(logout(navigate));
  }

  const user = useSelector((state) => state.profile.user);
  return (
    <div className="flex items-center cursor-pointer text-white relative group">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img src={user?.image} className="object-contain" alt="img" />
      </div>
      <RiArrowDropDownLine size={25} />
      <div
        className="invisible absolute left-[50%]
                      translate-x-[-55%] translate-y-[40%]
                   top-[50%]
                  flex flex-col rounded-lg bg-richblack-700 p-4 text-richblack-5
                  opacity-0 transition-all duration-200 group-hover:visible
                  group-hover:opacity-100 lg:w-[150px] z-20"
      >
        <div
          className="absolute left-[50%] top-0
                  translate-x-[80%]
                  translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-700 z-20"
        ></div>
        <button onClick={handlelogout} className="text-sm font-semibold">Logout</button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
