import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../Component/SideBar";
import { FaCheckCircle, FaTimesCircle, FaUserCheck } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import authUserStore from "../../store/admin";
import { Link, useNavigate } from "react-router-dom";
import { LuRefreshCw } from "react-icons/lu";

const ServiceProviders = () => {
   
    const { getTemp } = authUserStore();
    const [tempData, setTempData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTemp();
            if (data?.success) {
                setTempData(data.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [getTemp]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProfile = (data) => {
        navigate(`/admin/service-providers/details/${data._id}`);
    };

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-grow p-6 md:p-8">
                {/* Main Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Verify Service Provider </h1>
                </div>

                {/* Dashboard View */}
                {/* {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[1, 2, 3].map((item) => (
                            <div 
                                key={item}
                                onClick={() => setStep(2)}
                                className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg hover:transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                                        <FaUserCheck className="text-blue-600" size={32} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">Verify Service Provider</h2>
                                    <p className="text-gray-500 mt-2">View and manage pending verifications</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )} */}

                {/* List View */}
               
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* List Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <button 
                                    onClick={() => setStep(1)}
                                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <Link
                                    className=" flex"
                                    to={'/admin'}>
                                    <IoMdArrowBack size={24} className="mr-2" />
                                    <span className="text-lg font-medium">Back to Dashboard</span>
                                    </Link>
                                    
                               
                                </button>
                            </div>
                            <button 
                                onClick={handleRefresh}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                title="Refresh data"
                            >
                                <LuRefreshCw size={20} />
                            </button>
                        </div>

                        {/* Data Table */}
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    Loading service providers...
                                </div>
                            ) : tempData.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verify Provider Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tempData.map((data, index) => (
                                            <tr 
                                                key={data._id} 
                                                onClick={() => handleProfile(data)}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {data.firstName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{data.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${data.validation === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                          data.validation === 'approved' ? 'bg-green-100 text-green-800' : 
                                                          'bg-red-100 text-red-800'}`}>
                                                        {data.validation}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No service providers found.
                                </div>
                            )}
                        </div>
                    </div>
            
            </div>
        </div>
    );
};

export default ServiceProviders;