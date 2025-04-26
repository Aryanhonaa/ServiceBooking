import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { RiHome5Line, RiMoneyDollarCircleLine, RiMessage3Line } from 'react-icons/ri';
import { LuUsersRound } from 'react-icons/lu';
import { SlCalender } from 'react-icons/sl';
import { FaStar, FaBars, FaTimes } from 'react-icons/fa';
import userStore from '../../store/UserStore';
import serviceP from '../../store/ServiceProviderStore';

import { MdDashboard, MdHistory, MdEventAvailable, MdAttachMoney, MdMessage, MdRateReview, MdPerson } from "react-icons/md";


const SideBarS = () => {
  const { authUser } = userStore();
  const { darkMode } = serviceP();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`relative h-screen transition-all duration-300 ${isOpen ? "w-64" : "w-20"} md:w-64`}>
      
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-5 -right-5 bg-rose-600 text-white p-2 rounded-full shadow-md focus:outline-none md:hidden"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} h-full shadow-xl border-r transition-all duration-300`}>
        
        
        <div className="flex flex-col items-center py-6">
          <img
            src={authUser.image}
            alt="User"
            className="w-14 h-14 rounded-full border-2 border-gray-500"
          />
          {isOpen && (
            <>
              <h1 className="text-lg font-bold mt-2">{authUser.firstName}</h1>
              <h3 className="text-sm text-gray-400">{authUser?.speciality}</h3>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2 px-4">
  <SidebarLink to="/homepage/service-provider" icon={<MdDashboard />} text="Dashboard" isOpen={isOpen} location={location} />
  <SidebarLink to="/appointment/service-provider" icon={<MdEventAvailable />} text="Pending Appointments" isOpen={isOpen} location={location} />
  <SidebarLink to="/appointment/upcoming/service-provider" icon={<MdEventAvailable />} text="Appointments" isOpen={isOpen} location={location} />
  <SidebarLink to="/history-appointments" icon={<MdHistory />} text="Appointment History" isOpen={isOpen} location={location} />
  <SidebarLink to="/earnings" icon={<MdAttachMoney />} text="Earnings" isOpen={isOpen} location={location} />
  <SidebarLink to="/reviews" icon={<MdRateReview />} text="Reviews" isOpen={isOpen} location={location} />
  <SidebarLink to="/profile/service-provider" icon={<MdPerson />} text="Profile" isOpen={isOpen} location={location} />
</nav>

      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, isOpen, location }) => {
  const {darkMode}= serviceP();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out ${
        isActive ? "bg-yellow-500 text-white shadow-md" : "hover:bg-gray-200 dark:hover:bg-gray-800"
      } ${darkMode ?"text-lg " :" text-lg hover:text-white"}`}
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span className={`${darkMode ?"text-lg " :" text-lg hover:text-white"}`}>{text}</span>}
    </Link>
  );
};

export default SideBarS;
