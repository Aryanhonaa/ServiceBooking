import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import authUserStore from '../../store/admin';
import Sidebar from './SideBar';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWrench, FaMoneyBillWave, FaClock, FaIdCard, FaInfoCircle } from 'react-icons/fa';
import { MdVerified, MdNotInterested } from 'react-icons/md';

import { IoMdArrowBack } from "react-icons/io";

const ViewProvider = () => {
    const { id } = useParams();
    const { getServiceProviderDetail } = authUserStore();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getServiceProviderDetail(id);
                setData(res.data);
            } catch (err) {
                console.error("Error fetching provider details:", err);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, [id, getServiceProviderDetail]);

    if (loading) {
        return (
            <div className='flex min-h-screen bg-gray-50'>
                <Sidebar />
                <div className="flex-grow p-8 flex items-center justify-center">
                    <div className="text-gray-500">Loading provider details...</div>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className='flex min-h-screen bg-gray-50'>
                <Sidebar />
                <div className="flex-grow p-8 flex items-center justify-center">
                    <div className="text-gray-500">Provider not found</div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar />

            <div className="flex-grow p-6 md:p-8">
                <div className="max-w-6xl mx-auto">
                  <div className=' flex'> 
                    <Link to={'/admin/view-serviceProvider'}>
                    <IoMdArrowBack size={30} className=' mt-1 hover:text-yellow-600 cursor-pointer'/>
                    </Link>

                  
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 ml-9">Service    Provider Details</h1>
                  </div>
                

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6 overflow-hidden">
                                    {data.image ? (
                                        <img src={data.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUser className="text-blue-500 text-4xl" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {data.firstName} {data.middleName} {data.lastName}
                                    </h2>
                                    <div className="flex items-center mt-1">
                                        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                            {data.certified ? (
                                                <>
                                                    <MdVerified className="mr-1" /> Verified
                                                </>
                                            ) : (
                                                <>
                                                    <MdNotInterested className="mr-1" /> Not Verified
                                                </>
                                            )}
                                        </span>
                                        <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                            {data.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <DetailItem icon={<FaEnvelope className="text-blue-500" />} label="Email" value={data.email} />
                                <DetailItem icon={<FaPhone className="text-blue-500" />} label="Phone" value={data.phone.join(', ')} />
                                <DetailItem icon={<FaWrench className="text-blue-500" />} label="Speciality" value={data.speciality} />
                                <DetailItem icon={<FaMoneyBillWave className="text-blue-500" />} label="Service Fee" value={`Rs. ${data.fees}`} />
                                <DetailItem icon={<FaClock className="text-blue-500" />} label="Experience" value={`${data.experience} years`} />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <DetailItem 
                                    icon={<FaMapMarkerAlt className="text-blue-500" />} 
                                    label="Address" 
                                    value={`${data.address.street}, ${data.address.city}, ${data.address.country}`}
                                />
                                
                                {data.about && (
                                    <div className="flex items-start">
                                        <span className="mr-3 mt-1 text-blue-500">
                                            <FaInfoCircle />
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">About</p>
                                            <p className="text-gray-700">{data.about}</p>
                                        </div>
                                    </div>
                                )}

                                {/* ID Documents */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                        <FaIdCard className="mr-2 text-blue-500" /> ID Documents
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DocumentCard 
                                            title="Citizenship Front" 
                                            url={data.citizenF} 
                                        />
                                        <DocumentCard 
                                            title="Citizenship Back" 
                                            url={data.citizenB} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start">
        <span className="mr-3 mt-1">
            {icon}
        </span>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-gray-700">{value || 'Not provided'}</p>
        </div>
    </div>
);

const DocumentCard = ({ title, url }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">{title}</p>
        </div>
        <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            {url ? (
                <img src={url} alt={title} className="w-full h-full object-contain" />
            ) : (
                <div className="text-gray-400">No document available</div>
            )}
        </div>
    </div>
);

export default ViewProvider;