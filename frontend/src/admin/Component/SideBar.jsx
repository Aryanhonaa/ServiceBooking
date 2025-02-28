import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { TbCategory } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import userStore from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';
import { MdContactPhone } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const {logout}=userStore();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`flex ${isOpen ? "w-64" : "w-20"} h-screen bg-gray-800 text-white transition-all duration-300`}>
      <div className="flex flex-col w-full h-full p-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-white mb-8 px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500"
        >
          {isOpen ? "Close" : "Open"} Sidebar
        </button>

        {/* Sidebar Content */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-xl font-bold mb-6">Welcome Admin!</h1>
          <Link to="/admin" className="flex items-center space-x-3 text-lg hover:bg-gray-700 p-3 rounded-md">
            <FaHome />
             <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-3 text-lg hover:bg-gray-700 p-3 rounded-md">
            <FaUsers />
            <span>Users</span>
          </Link>

          <Link to={'/admin/category'} className="flex items-center space-x-3 text-lg hover:bg-gray-700 p-3 rounded-md">
          <TbCategory/>
          <span>Category</span>
            </Link>
          <Link to="/admin/service-providers" className="flex items-center space-x-3 text-lg hover:bg-gray-700 p-3 rounded-md">
            <GrUserWorker/>
            <span>Service Provider</span>
          </Link>
          <Link to="/admin/contacts" className="flex items-center space-x-3 text-lg hover:bg-gray-700 p-3 rounded-md">
            <MdContactPhone/>
            <span>Contact</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-3 text-lg hover:bg-gray-700 p-3 rounded-md">
            <FaCog />
            <span>Settings</span>
          </Link>
          <Link  className="flex items-center space-x-3 text-lg hover:bg-gray-700 p-3 rounded-md" onClick={()=>logout(navigate)}>
            <FaSignOutAlt />
             <span >Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
