import React from "react";
import * as Icons from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ link }) => {
  const Icon = Icons[link.icon];
  const location = useLocation();

  const matchRoute = (route) => {
    return location.pathname.includes(route);
  };
  return (
    <NavLink
      to={link.path}
      className={`transition-all duration-100 ease-in-out relative px-8 py-2 flex gap-4 text-sm font-medium ${
        matchRoute(link.path) ? "bg-yellow-700" : null
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        } `}
      ></span>
      <Icon className="text-richblack-5 text-lg" />
      <p className="text-richblack-5">{link.name}</p>
    </NavLink>
  );
};

export default SidebarLink;
