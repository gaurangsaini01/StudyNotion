import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileUpdate from "../Settings/ProfileUpdate";
import DeleteAccount from "../Settings/DeleteAccount";

function MySettings() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className=" p-7 flex flex-col gap-5 w-[70%] mx-auto">
      <div
        onClick={() => navigate("/dashboard/my-profile")}
        className="flex gap-2 items-center text-richblack-300 cursor-pointer"
      >
        <IoIosArrowBack />
        <p className="text-sm">Back</p>
      </div>
      <h1 className="text-3xl text-center font-bold tracking-wider text-richblack-5">
        Edit Profile
      </h1>
      <div className="min-w-[70%] mx-auto flex flex-col gap-3 ">
        {/* section 1 */}
        <div className="flex gap-6 w-full items-center bg-richblack-800 p-4 rounded-md border-[1px] border-richblack-700">
          <div className="flex items-center gap-3">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[78px] rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-richblack-5 font-medium">Change Profile Picture</div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-yellow-50 text-black rounded-md">
                Change
              </button>
              <button className="bg-richblack-700 text-richblack-5 px-4 py-2 rounded-md">
                Remove
              </button>
            </div>
          </div>
        </div>

        <ProfileUpdate/>
        <DeleteAccount/>

      </div>
    </div>
  );
}

export default MySettings;
