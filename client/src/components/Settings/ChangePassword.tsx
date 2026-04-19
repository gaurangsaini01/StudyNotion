import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAppSelector } from "../../redux/hooks";
import {
  changePasswordService,
  type ChangePasswordPayload,
} from "../../services/operations/settingsAPI";

function ChangePassword() {
  const token = useAppSelector((state) => state.auth.token);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordPayload>();

  function changePassword(data: ChangePasswordPayload) {
    if (!token) return;
    if (data.newPassword === data.oldPassword) {
      toast.error("New Password must be different");
    } else {
      changePasswordService(token, data);
    }
  }

  return (
    <div className="flex justify-between flex-col items-center w-full bg-richblack-800 p-4 rounded-md border-[1px] border-richblack-700 gap-5 ">
      <div className="w-full flex justify-between ">
        <p className="text-2xl text-richblack-25 font-bold">Change Password</p>
      </div>
      <form
        onSubmit={handleSubmit(changePassword)}
        className="flex w-full flex-col gap-5 lg:flex-row"
      >
        <div className="flex flex-col w-full gap-8">
          <div className="flex flex-col md:flex-row mx-auto  gap-5 w-full">
            <div className="flex flex-col gap-2 lg:w-[45%]">
              <label htmlFor="oldPassword" className="lable-style">
                Current Password
              </label>
              <input
                type="password"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register("oldPassword", {
                  required: {
                    value: true,
                    message: "Please enter your Current password.",
                  },
                  minLength: {
                    value: 4,
                    message: "Password must be greater than 4 digits",
                  },
                })}
              />
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.oldPassword.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[45%]">
              <label htmlFor="newPassword" className="lable-style">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register("newPassword", {
                  required: {
                    value: true,
                    message: "Password Cannot be Empty",
                  },
                  minLength: {
                    value: 4,
                    message: "Password must be greater than 4 digits",
                  },
                })}
              />
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please Fill New Password
                </span>
              )}
            </div>
          </div>

          <div>
            <button
              className="px-6 py-2  bg-yellow-100 rounded-md"
              type="submit"
            >
              Change
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
