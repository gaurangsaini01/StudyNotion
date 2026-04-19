import type { ComponentType } from "react";
import * as Icons from "react-icons/vsc";
import { NavLink, useLocation } from "react-router-dom";

import { useAppDispatch } from "../../redux/hooks";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../redux/slices/courseSlice";
import type { SidebarLinkItem } from "../../types/ui";

interface SidebarLinkProps {
  link: SidebarLinkItem;
}

type IconLibrary = Record<string, ComponentType<{ className?: string }>>;

const SidebarLink = ({ link }: SidebarLinkProps) => {
  const Icon = (Icons as unknown as IconLibrary)[link.icon];
  const location = useLocation();
  const dispatch = useAppDispatch();

  const matchRoute = (route: string) => {
    return location.pathname.includes(route);
  };
  return (
    <NavLink
      onClick={() => {
        dispatch(setEditCourse(false));
        dispatch(setCourse(null));
        dispatch(setStep(0));
      }}
      to={link.path}
      className={`transition-all duration-100 ease-in-out relative px-8 py-2 flex gap-4 text-sm font-medium ${
        matchRoute(link.path) ? "bg-yellow-700" : ""
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        } `}
      ></span>
      {Icon && <Icon className="text-richblack-5 text-lg" />}
      <p className="text-richblack-5">{link.name}</p>
    </NavLink>
  );
};

export default SidebarLink;
