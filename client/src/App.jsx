import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./components/navbar/Navbar";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import ErrorPage from "./Pages/Error";
import Contact from "./Pages/Contact";
import MyProfile from "./components/Dashboard.jsx/MyProfile";
import MyCourses from "./components/Dashboard.jsx/MyCourses";
import MySettings from "./components/Dashboard.jsx/MySettings";

function App() {
  return (
    <>
      <div className="min-h-screen w-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/update-password/:resetPasswordToken"
            element={<UpdatePassword />}
          />
          <Route path="/about" element={<About />} />
          <Route element={<Dashboard />}>
            <Route path="/dashboard/enrolled-courses" element={<MyCourses />} />
            <Route path="/dashboard/my-profile" element={<MyProfile />} />
            <Route path="/dashboard/my-settings" element={<MySettings />} />
          </Route>
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
