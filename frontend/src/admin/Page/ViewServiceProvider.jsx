import React, { useEffect, useState } from 'react';
import Sidebar from '../Component/SideBar';
import authUserStore from '../../store/admin';
import { FaUsers, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ViewServiceProvider = () => {
    const  {getProviders, deleteServiceProvider}=authUserStore();
    const [serviceP , setServiceP]=useState([]);
    const [loading, setLoading]=useState();
    const navigate= useNavigate();
    useEffect(()=>{
        const getData=async()=>{
            try{
                const res= await getProviders();
                setServiceP(res.data);

            }catch(err){
                console.error("Error fetching providers:", err);
            }
        }
        getData();
    },[]);

    console.log("service", serviceP);

    const handleDelete=async(id)=>{
        try{

            const res= await deleteServiceProvider(id);
        }catch(err){
            console.error("Error deleting provider:", err);
        }
    }

    const handleView=async(id)=>{
        try{
            navigate(`/admin/view/${id}`);

        }catch(err){
            console.error("Error viewing provider:", err);
        }
    }
    
      const [currentPage,setCurrentPage]=useState(1);
    
      const itemsPerPage=5;
      const totalItems = serviceP?.length || 0;
      const totalPage = Math.ceil(totalItems / itemsPerPage); 
    
      const indexOfLastItem=currentPage * itemsPerPage;
    
      const indexofFirstItem=indexOfLastItem - itemsPerPage;
    
      const currentUsers= serviceP.slice(indexofFirstItem, indexOfLastItem);
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <div className="p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Service Provider Management</h1>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Service Providers</p>
            <p className="text-2xl font-semibold text-gray-700">{serviceP.length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : (
            <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <FaUser />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.firstName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaPhone className="mr-2 text-gray-400" />
                        {user.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-between">
                    
                    <div>

                    <button className=' px-3 py-3 bg-rose-500 text-white rounded-2xl cursor-pointer'
                    onClick={()=>handleDelete(user._id)}
                    >Delete</button>
                    <button className=' px-3 py-3 bg-green-500 text-white rounded-2xl cursor-pointer ml-2'
                    onClick={()=>handleView(user._id)}
                    >View</button>
                    </div>
                    
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreVertical />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

                <div className=' bg-gray-100 flex justify-between'>
                <button className={`  ${currentPage ===1 ?" bg-gray-500 px-6 py-5 cursor-not-allowed rounded-r-2xl":"px-6 py-5 bg-yellow-300 rounded-r-2xl"}`}
                disabled={currentPage ===1}
                onClick={()=>setCurrentPage((prev)=>Math.min(prev-1))}
                >Back</button>
                <span className=' px-6 py-6 bg-gray-500 rounded-xl text-white'>{currentPage} / {totalPage}</span>
                <button className={`  ${currentPage ===totalPage ?" bg-gray-500 px-6 py-5 cursor-not-allowed rounded-r-2xl":"px-6 py-5 bg-yellow-300 rounded-r-2xl"}`}
                   onClick={()=>setCurrentPage((prev)=>Math.max(prev+1,0))}

                   disabled={currentPage ===totalPage}
                >Next</button>
                </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewServiceProvider
