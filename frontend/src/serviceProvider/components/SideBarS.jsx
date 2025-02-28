import React from 'react'
import { Link ,useLocation } from 'react-router-dom';
import {  FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { RiHome5Line } from "react-icons/ri";
import { LuUsersRound } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import userStore from '../../store/UserStore';


const SideBarS = () => {
    const {authUser}=userStore();
    const location = useLocation();
  return (
    <div className="bg-white w-80 h-screen border-r-2 border-gray-300 shadow-lg">
    <div className="flex flex-col space-y-6 px-5 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {authUser.firstName}!</h1>
        <img
          src={authUser.image}
          alt="User"
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
        />
      </div>
      <h3 className="text-gray-600">{authUser?.speciality}</h3>

      {/* Navigation Links */}
      <div className="space-y-3">
        <Link
          to="/homepage/service-provider"
          className={`flex items-center space-x-3 text-lg p-3 rounded-md hover:bg-gray-700 hover:text-white ${
            location.pathname === '/homepage/service-provider'
              ? 'bg-gray-700 text-white border-r-4 border-rose-600'
              : 'text-gray-800'
          }`}
        >
          <RiHome5Line />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/appointment/service-provider"
          className={`flex items-center space-x-3 text-lg p-3 rounded-md hover:bg-gray-700 hover:text-white ${
            location.pathname === '/appointment/service-provider'
              ? 'bg-gray-700 text-white border-r-4 border-rose-600'
              : 'text-gray-800'
          }`}
        >
          <SlCalender />
          <span>Appointment</span>
        </Link>

        <Link
          to="/profile/service-provider"
          className={`flex items-center space-x-3 text-lg p-3 rounded-md hover:bg-gray-700 hover:text-white ${
            location.pathname === '/profile/service-provider'
              ? 'bg-gray-700 text-white border-r-4 border-rose-600'
              : 'text-gray-800'
          }`}
        >
          <LuUsersRound />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  </div>
);
};


export default SideBarS;
