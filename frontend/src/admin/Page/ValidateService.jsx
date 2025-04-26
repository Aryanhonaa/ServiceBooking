import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../config/axios';
import Sidebar from '../Component/SideBar';
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaEnvelope, FaPhone, FaWrench, FaUser } from "react-icons/fa";
import { toast } from 'react-toastify';
import { IoMdArrowBack } from "react-icons/io";
import Map from '../Component/Map';

const ValidateService = () => {
    const { data } = useParams();
    const [serviceData, setDatas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
    const [showMap, setShowMap] = useState(true);
    const navigate = useNavigate();

    const rejectReasons = [
        "Unverified identity",
        "Mismatched details",
        "Suspicious activity",
        "Invalid Documentation (Citizenship)",
        "Policy violation",
        "Invalid contact details",  
        "Other"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/admin/temp-service/${data}`);
                if (response.data.success) {
                    setDatas(response.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load service provider details");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [data]);

    const verifyService = async (id) => {
        try {
            const res = await axiosInstance.get(`/admin/verifyTemp/${id}`);
            if (res.data.success) {
                toast.success("Service Provider Verified Successfully!");
                navigate('/admin/service-providers');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error verifying service provider");
        }
    }

    const rejectServiceProvider = async (id) => {
        if (!selectedReason) {
            toast.warning("Please select a rejection reason");
            return;
        }

        try {
            let reason = selectedReason === "Other" ? otherReason : selectedReason;
            const res = await axiosInstance.post(`/admin/reject-tempUser/${id}`, { reason });
            if (res.data.success) {
                toast.success("Service Provider Rejected");
                navigate('/admin/service-providers');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error rejecting service provider");
        }
    }

    const formatPhoneNumbers = (phone) => {
        if (!phone) return 'N/A';
        if (Array.isArray(phone)) return phone.join(', ');
        if (typeof phone === 'string') return phone;
        return 'N/A';
    };

    if (loading) {
        return (
            <div className='flex min-h-screen bg-gray-50'>
                <Sidebar />
                <div className="flex-grow p-8 flex items-center justify-center">
                    <div className="text-gray-500">Loading service provider details...</div>
                </div>
            </div>
        )
    }

    if (!serviceData) {
        return (
            <div className='flex min-h-screen bg-gray-50'>
                <Sidebar />
                <div className="flex-grow p-8 flex items-center justify-center">
                    <div className="text-gray-500">Service provider not found</div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar />
            
            <div className="flex-grow p-6 md:p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Header with back button */}
                    <div className="flex items-center mb-6">
                        <Link to="/admin/service-providers" className="mr-4 text-gray-600 hover:text-blue-500 transition-colors">
                            <IoMdArrowBack size={28} />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Service Provider Validation</h1>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6 overflow-hidden border-2 border-white">
                                    {serviceData.image ? (
                                        <img src={serviceData.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-blue-500 text-4xl">
                                            <FaUser />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {serviceData.firstName} {serviceData.middleName} {serviceData.lastName}
                                    </h2>
                                    <p className="text-blue-100">{serviceData.speciality}</p>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${serviceData.validation === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                                        {serviceData.validation}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <DetailItem label="Email" value={serviceData.email || 'N/A'} icon={<FaEnvelope />} />
                                <DetailItem label="Phone" value={formatPhoneNumbers(serviceData.phone)} icon={<FaPhone />} />
                                <DetailItem label="Category" value={serviceData.category || 'N/A'} icon={<FaWrench />} />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <DetailItem 
                                    label="Address" 
                                    value={
                                        serviceData.address ? 
                                        `${serviceData.address.street}, ${serviceData.address.city}, ${serviceData.address.country}` : 
                                        'N/A'
                                    } 
                                    icon={<FaMapMarkerAlt />}
                                />
                            </div>
                        </div>

                        {/* Map Section */}
                        {showMap && serviceData.address?.lat && serviceData.address?.lng && (
                            <div className="p-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                    Location
                                </h3>
                                <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                                    <Map serviceData={serviceData} />
                                </div>
                            </div>
                        )}

                        {/* ID Documents */}
                        <div className="p-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Identification Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DocumentCard 
                                    title="Citizenship Front" 
                                    url={serviceData.citizenF} 
                                />
                                <DocumentCard 
                                    title="Citizenship Back" 
                                    url={serviceData.citizenB} 
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => setIsOpen(true)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
                            >
                                <FaCheckCircle size={20} />
                                <span className="font-semibold">Approve</span>
                            </button>
                            
                            <button 
                                onClick={() => {
                                    setShowMap(false);
                                    setOpenReject(true);
                                    setSelectedReason("");
                                    setOtherReason("");
                                }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
                            >
                                <FaTimesCircle size={20} />
                                <span className="font-semibold">Reject</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Confirmation Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Approval</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to approve this service provider?</p>
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => verifyService(serviceData._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Confirm Approval
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {openReject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex items-center mb-4">
                            <button 
                                onClick={() => {
                                    setOpenReject(false);
                                    setShowMap(true);
                                }}
                                className="mr-2 text-gray-500 hover:text-gray-700"
                            >
                                <IoMdArrowBack size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">Select Rejection Reason</h2>
                        </div>

                        <div className="mb-6">
                            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {rejectReasons.map((reason, index) => (
                                    <li key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`reason-${index}`}
                                            name="rejectionReason"
                                            value={reason}
                                            checked={selectedReason === reason}
                                            onChange={(e) => {
                                                setSelectedReason(e.target.value);
                                                if (e.target.value !== "Other") {
                                                    setOtherReason("");
                                                }
                                            }}
                                            className="mr-3"
                                        />
                                        <label htmlFor={`reason-${index}`} className="cursor-pointer text-gray-700">
                                            {reason}
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            {selectedReason === "Other" && (
                                <textarea
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    placeholder="Please specify the reason..."
                                    className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                />
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => {
                                    setOpenReject(false);
                                    setShowMap(true);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => rejectServiceProvider(serviceData._id)}
                                disabled={!selectedReason || (selectedReason === "Other" && !otherReason)}
                                className={`px-4 py-2 rounded-lg text-white transition-colors ${(!selectedReason || (selectedReason === "Other" && !otherReason)) ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                Submit Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Reusable components
const DetailItem = ({ label, value, icon }) => (
    <div className="flex items-start">
        <span className="mr-3 mt-1 text-blue-500">
            {icon}
        </span>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-gray-700">{value}</p>
        </div>
    </div>
);

const DocumentCard = ({ title, url }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-700">{title}</h4>
        </div>
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            {url ? (
                <img src={url} alt={title} className="w-full h-full object-contain" />
            ) : (
                <div className="text-gray-400">Document not available</div>
            )}
        </div>
    </div>
);

export default ValidateService;