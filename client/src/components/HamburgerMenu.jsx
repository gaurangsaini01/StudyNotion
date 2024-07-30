import React from "react";
import { NavbarLinks } from "../data/navbar-links";
import { NavLink } from "react-router-dom";
function HamburgerMenu({ open, setOpen }) {
  return (
    <div
      className={`w-full h-screen mt-14 absolute inset-0 z-50 bg-richblack-800 ${
        open ? "animate-slide-in" : "animate-slide-out"
      }`}
    >
      <div className="text-white flex flex-col items-center mt-3">
        {NavbarLinks.map((link, index) => (
          <div key={index} className="w-full flex flex-col items-center">
            <div
              className={`w-11/12 h-[0.1px] bg-richblack-500 ${
                index === 0 || index === 1 ? "hidden" : ""
              } my-4`}
            ></div>
            <NavLink
              to={link?.path}
              onClick={() => setOpen(false)}
              className={`w-full items-center justify-center flex py-1 px-4 text-2xl ${
                index === 1 ? "hidden" : ""
              }`}
            >
              {link?.title}
            </NavLink>
          </div>
        ))}
      </div>
      <div>

      </div>
    </div>
  );
}

export default HamburgerMenu;
