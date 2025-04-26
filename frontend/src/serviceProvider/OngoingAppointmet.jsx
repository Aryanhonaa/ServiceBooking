import React, { useEffect, useState } from 'react';
import serviceP from '../store/ServiceProviderStore';
import SideBarS from './components/SideBarS';
import userStore from '../store/UserStore';
import { GoEye } from "react-icons/go";
import { MdArrowBack, MdPerson, MdDateRange, MdAccessTime, MdAttachMoney, MdLocationOn, MdCheckCircle, MdSchedule, MdLocalPhone } from "react-icons/md";
import { TileLayer, Popup, Marker, MapContainer } from 'react-leaflet';
import { axiosInstance } from '../config/axios';
import { toast } from 'react-toastify';
// import 'react-leaflet/dist/leaflet.css';

const OngoingAppointments = () => {
    const { darkMode, getAccepted, getAcceptedDetails } = serviceP();
    const { authUser } = userStore();
    
    const [data, setData] = useState([]);
    const [groupedData, setGroupedData] = useState({});
    const [detail, setDetail] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAcceptedData = async () => {
            try {
                const res = await getAccepted(authUser._id);
                if (res.success) {
                    const grouped = res.data.reduce((acc, appointment) => {
                        const dateObj = new Date(appointment.date);
                        const formattedDate = dateObj.toISOString().split("T")[0];
                        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

                        if (!acc[formattedDate]) {
                            acc[formattedDate] = { day: dayName, appointments: [] };
                        }
                        acc[formattedDate].appointments.push(appointment);
                        return acc;
                    }, {});

                    const sortedGroupedData = Object.keys(grouped)
                        .sort((a, b) => new Date(a) - new Date(b))
                        .reduce((sortedAcc, key) => {
                            sortedAcc[key] = grouped[key];
                            return sortedAcc;
                        }, {});

                    setGroupedData(sortedGroupedData);
                    setData(res.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load appointments");
            }
        };

        fetchAcceptedData();
    }, [authUser._id]);

    const fetchAppointmentDetails = async (id) => {
        try {
            const res = await getAcceptedDetails(id);
            setDetail(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load appointment details");
        }
    };

    const handleComplete = async () => {
        try {
            setLoading(true);
            const status = "completed";
            const appointmentId = detail._id;
            const data = { appointmentId, status };

            const res = await axiosInstance.post("serviceprovider/post-status", data);
            if (res.data.success) {
                setStep(1);
                toast.success("Appointment marked as completed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to complete appointment");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setLoading(true);
            const status = "canceled";
            const appointmentId = detail._id;
            const data = { appointmentId, status };
            
            const res = await axiosInstance.post("serviceprovider/post-status", data);
            if (res.data.success) {
                setStep(1);
                toast.success("Appointment canceled");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to cancel appointment");
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        accepted: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        canceled: "bg-red-100 text-red-800"
    };

    return (
        <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <SideBarS />

            <div className="flex-1 p-6 overflow-auto">
                <h1 className={`text-3xl font-bold mb-8 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                    Upcoming Appointments
                </h1>

                {step === 1 && (
                    <div className="space-y-8">
                        {Object.keys(groupedData).length > 0 ? (
                            Object.keys(groupedData).map((date) => {
                                const { day, appointments } = groupedData[date];
                                return (
                                    <div key={date} className="space-y-4">
                                        <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                            {day}, {new Date(date).toLocaleDateString()}
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {appointments.map((appointment) => (
                                                <div
                                                    key={appointment._id}
                                                    className={`p-4 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer ${
                                                        darkMode 
                                                            ? "bg-gray-800 hover:bg-gray-700" 
                                                            : "bg-white hover:bg-gray-50"
                                                    }`}
                                                    onClick={() => {
                                                        fetchAppointmentDetails(appointment._id);
                                                        setStep(2);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                                                {appointment.slot}
                                                            </p>
                                                            <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                                                {appointment.userName}
                                                            </p>
                                                        </div>
                                                        <GoEye className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    No upcoming appointments
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && detail && (
                    <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <div className="p-6">
                            {/* Header with back button and actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className={`flex items-center ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"} transition-colors`}
                                >
                                    <MdArrowBack className="mr-2" size={20} />
                                    Back to Appointments
                                </button>

                                <h2 className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                                    Appointment Details
                                </h2>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleComplete}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            loading 
                                                ? "bg-green-700 text-white cursor-not-allowed" 
                                                : "bg-green-600 text-white hover:bg-green-700"
                                        }`}
                                    >
                                        {loading ? "Processing..." : "Complete"}
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            loading 
                                                ? "bg-red-700 text-white cursor-not-allowed" 
                                                : "bg-red-600 text-white hover:bg-red-700"
                                        }`}
                                    >
                                        {loading ? "Processing..." : "Cancel"}
                                    </button>
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left column - Customer info */}
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={detail.img || '/default-profile.jpg'}
                                            alt="Customer"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4"
                                            onError={(e) => (e.target.src = '/default-profile.jpg')}
                                        />
                                        <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                                            {detail.userName}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-sm mt-2 ${statusColors[detail.status] || "bg-gray-100 text-gray-800"}`}>
                                            {detail.status}
                                        </span>
                                    </div>

                                    <div className={`space-y-4 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                                        <div className="flex items-center">
                                            <MdDateRange className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`} size={20} />
                                            <div>
                                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Appointment Date</p>
                                                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>
                                                    {new Date(detail.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <MdAccessTime className={`mr-3 ${darkMode ? "text-purple-400" : "text-purple-500"}`} size={20} />
                                            <div>
                                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Time Slot</p>
                                                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>{detail.slot}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <MdAttachMoney className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`} size={20} />
                                            <div>
                                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Service Fee</p>
                                                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>Rs {detail.fees}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <MdLocalPhone className={`mr-3 ${darkMode ? "text-green-400" : "text-green-500"}`} size={20} />
                                            <div>
                                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Contact Number</p>
                                                <p className={darkMode ? "text-gray-200" : "text-gray-800"}>{detail.number}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column - Address and map */}
                                <div className="space-y-6">
                                    <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                                        <div className="flex items-center mb-3">
                                            <MdLocationOn className={`mr-3 ${darkMode ? "text-red-400" : "text-red-500"}`} size={20} />
                                            <h4 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Service Address</h4>
                                        </div>
                                        <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                                            {detail?.address?.street}, {detail?.address?.city}
                                        </p>
                                    </div>

                                    {detail?.address?.lat && detail?.address?.lng && (
                                        <div className="h-64 rounded-lg overflow-hidden shadow-sm">
                                            <MapContainer
                                                center={[detail.address.lat, detail.address.lng]}
                                                zoom={15}
                                                scrollWheelZoom={false}
                                                className="h-full w-full"
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />
                                                <Marker position={[detail.address.lat, detail.address.lng]}>
                                                    <Popup className="font-medium">Customer Location</Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OngoingAppointments;