import React, { useEffect,useState } from 'react';
import Sidebar from '../Component/SideBar';
import {
  FaUsers,
  FaTools,
  FaClipboardList,
  FaCheckCircle,
  FaUserShield,
  FaListAlt
} from 'react-icons/fa';
import authUserStore from '../../store/admin';
import { Link } from 'react-router-dom';

const Home = () => {
  const {getUsers, getProviders, getCategory}=authUserStore();
  const [users,setUsers]=useState([]);
  const [providers,setProviders]=useState([]);
  const [category,setCategory]=useState([]);

  useEffect(()=>{
    const getUser=async()=>{
      try{
        const res= await getUsers()
        setUsers(res.data)
      }catch(err){
        console.log(err);
      }
    }

    getUser();
  },[])

  useEffect(()=>{
    const getProvider=async()=>{
      try{
        const res= await getProviders()
        setProviders(res.data)
      }catch(err){
        console.log(err);
      }
    }

    getProvider();
    },[])


    useEffect(()=>{
      try{
        const getData=async()=>{
          try{
            const res= await getCategory();
            setCategory(res.data);
          }catch(err){
            console.log(err);
          }
        }

        getData();
      }catch(err){
        console.log(err);
      }
    },[])

    console.log("Category",category);
  console.log("USERS",users);

  // const userNum= users.length;
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Welcome, Admin</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <FaUsers className="text-4xl text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold">{users.length}</h2>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <FaTools className="text-4xl text-green-500" />
            <div>
              <h2 className="text-2xl font-bold">{providers.length}</h2>
              <p className="text-gray-600">Service Providers</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <FaClipboardList className="text-4xl text-red-500" />
            <div>
              <h2 className="text-2xl font-bold">{category.length}</h2>
              <p className="text-gray-600">Categories</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link
          to={'/admin/service-providers'}
          >
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <FaListAlt className="text-xl text-purple-600" />
              <h3 className="text-lg font-semibold">Verify Service Provider</h3>
            </div>
            <p className="text-gray-600">See the full list of service provider needs to be verified..</p>
          </div>
          </Link>
         

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <FaUserShield className="text-xl text-blue-700" />
              <h3 className="text-lg font-semibold">Manage Users</h3>
            </div>
            <p className="text-gray-600">Edit, remove or monitor user activities.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <FaTools className="text-xl text-green-600" />
              <h3 className="text-lg font-semibold">Manage Providers</h3>
            </div>
            <p className="text-gray-600">Approve, remove, or update service provider info.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <FaCheckCircle className="text-xl text-teal-500" />
              <h3 className="text-lg font-semibold">Approve Requests</h3>
            </div>
            <p className="text-gray-600">Verify pending provider registrations or changes.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <FaClipboardList className="text-xl text-yellow-600" />
              <h3 className="text-lg font-semibold">System Logs</h3>
            </div>
            <p className="text-gray-600">Track system changes and admin activity logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
