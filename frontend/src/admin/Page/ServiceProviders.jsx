import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../Component/SideBar";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import authUserStore from "../../store/admin";
import { useNavigate } from "react-router-dom";
import { LuRefreshCw } from "react-icons/lu";

const ServiceProviders = () => {
    const [step, setStep] = useState(1);
    const { getTemp } = authUserStore(); // Zustand store function
    const [tempData, setTempData] = useState([]); // State to store fetched data
    const navigate=useNavigate();


    const fetchData = useCallback(async () => {
        try {
            const data = await getTemp(); 
            if (data?.success) {
                setTempData(data.data);
            } else {
                console.error("Error fetching data:", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [getTemp]);
    useEffect(() => {
       

        fetchData();
    }, [fetchData]); // Added dependency


    const handleProfile=async(data)=>{
        try{
            navigate(`/admin/service-providers/details/${data._id}`)
        }catch(err){
            console.log(err)
        }

    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-grow p-6">
                
                <h1 className="text-3xl font-bold mt-16">Service Provider</h1>

                <div>
                    {step === 1 && (
                        <>
                            <div>
                                <div className="flex justify-between mt-16 cursor-pointer" onClick={() => setStep(2)}>
                                    <div className="bg-stone-600 px-10 py-10 rounded-2xl">
                                        <FaPersonCircleQuestion className="text-yellow-400 ml-12" size={80} />
                                        <h1 className="text-white font-semibold">Verify Service Provider</h1>
                                    </div>
                                    <div className="bg-stone-600 px-10 py-10 rounded-2xl">
                                        <FaPersonCircleQuestion className="text-yellow-400 ml-12" size={80} />
                                        <h1 className="text-white font-semibold">Verify Service Provider</h1>
                                    </div>
                                    <div className="bg-stone-600 px-10 py-10 rounded-2xl mr-28">
                                        <FaPersonCircleQuestion className="text-yellow-400 ml-12" size={80} />
                                        <h1 className="text-white font-semibold">Verify Service Provider</h1>
                                    </div>
                                </div>

                                <FaCheckCircle className="text-green-500" size={30} />
                                <FaTimesCircle className="text-red-500" size={30} />
                            </div>
                        </>
                    )}

                    {/* Step 2 - Displaying the fetched data */}
                    {step === 2 && (
                        <>
                            <div className="mt-10">
                            <div className="flex justify-between items-center">
        <div className="flex items-center">
            <IoMdArrowBack size={35} onClick={() => setStep(1)} className="cursor-pointer" />
            <h1 className="font-k2d text-3xl ml-4">Verify Service Provider</h1>
        </div>
        <LuRefreshCw className="cursor-pointer mr-20 text-gray-700 hover:animate-spin" size={30} onClick={navigate('/admin/service-providers')}/>
    </div>

                                {/* Display fetched data */}
                                <div className="mt-6 p-4 bg-gray-200 rounded-lg shadow-md">
                                    {tempData.length > 0 ? (
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-300 text-gray-700 font-semibold">
                                                    <th className="p-2 border border-gray-400 text-left">#</th>
                                                    <th className="p-2 border border-gray-400 text-left">Name</th>
                                                    <th className="p-2 border border-gray-400 text-left">Email</th>
                                                    <th className="p-2 border border-gray-400 text-left">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tempData.map((data, index) => (
                                                    <tr key={data._id} className="bg-white border border-gray-300 cursor-pointer" onClick={()=>handleProfile(data)}>
                                                        <td className="p-2 border border-gray-400">{index + 1}</td>
                                                        <td className="p-2 border border-gray-400 font-medium">{data.firstName}</td>
                                                        <td className="p-2 border border-gray-400 text-blue-600">{data.email}</td>
                                                        <td className="p-2 border border-gray-400 text-yellow-600 font-medium">{data.validation}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-gray-500">No service providers found.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceProviders;
