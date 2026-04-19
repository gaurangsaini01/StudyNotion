import { Outlet } from "react-router-dom";

import Sidebar from "../components/Dashboard.jsx/Sidebar";
import { useAppSelector } from "../redux/hooks";

function Dashboard() {
  const { loading: authLoading } = useAppSelector((state) => state.auth);
  const { loading: profileLoading } = useAppSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="flex w-full relative h-full">
      <div className="flex-shrink-0 fixed md:block hidden">
        <Sidebar />
      </div>
      <div className="h-full w-full md:ml-[222px]">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
