import React from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, NavLink } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  return (
    <div className="bg-richblack-800 flex items-center h-14 border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12  max-w-maxContent items-center justify-between mx-auto">
        <div>
          <Link to={"/"}>
            <img src={logo} width={160} height={60} loading="lazy" alt="logo" />
          </Link>
        </div>
        <nav>
          <ul className="flex gap-5">
            {NavbarLinks.map((item, index) => (
              <li key={index} className="text-white">
                {item?.title === "Catalog" ? (
                  <div></div>
                ) : (
                  <NavLink to={item?.path}>
                    <p>{item?.title}</p>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex gap-4 items-center">
          {user && user.accountType !== "instructor" && (
            <Link to={"/dashboard/cart"} className="relative text-white">
              <AiOutlineShoppingCart size={25} className="relative z-0" />
              {totalItems > 0 ? (
                <span className="absolute z-10 top-[-10px] right-[-10px] text-white rounded-full text-sm px-[6px] bg-pure-greys-400">
                  1
                </span>
              ) : (
                <span></span>
              )}
            </Link>
          )}
          {token === null && (
            <div className="flex items-center gap-2">
              <Link to={"/login"}>
                <button className="px-3 text-richblack-25 border border-richblack-300 rounded-md py-1 bg-richblack-700 ">
                  Login
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="px-3 border border-richblack-300 rounded-md py-1 bg-richblack-700 text-richblack-25">
                  Signup
                </button>
              </Link>
            </div>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
