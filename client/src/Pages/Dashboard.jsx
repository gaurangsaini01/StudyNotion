import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Dashboard.jsx/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </div>
  );
}
export default Dashboard;
