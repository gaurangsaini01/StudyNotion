import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Dashboard.jsx/Sidebar";

function Dashboard() {
//   const { loading: authLoading } = useSelector((state) => state.auth);
//   const { loading: profileLoading } = useSelector((state) => state.profile);

  return <>
    <Sidebar/>
  </>;
}
export default Dashboard;
