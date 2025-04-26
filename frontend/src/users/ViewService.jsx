import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import userStore from '../store/UserStore';
import { FaArrowLeft } from "react-icons/fa";
import { MdPerson, MdDateRange, MdAccessTime, MdAttachMoney, MdLocationOn, MdCheckCircle, MdSchedule, MdLocalPhone } from 'react-icons/md';
import { TileLayer, Popup, Marker, MapContainer } from 'react-leaflet';
import { ScrollLink } from "react-scroll";
import Rating from './components/Rating';
import { toast } from 'react-toastify';
// import 'react-leaflet/dist/leaflet.css';

const ViewService = () => {
    const { id } = useParams();
    const { getDetails, getProviderDetails, cancelAppointment } = userStore();
    const [data, setData] = useState([]);
    const [provDetail, setProvDetail] = useState([]);
    const [cancelDialog, setCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDetails(id);
                setData(res.data);
            } catch (err) {
                console.log(err);
                toast.error("Failed to load appointment details");
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchProvider = async () => {
            if (!data?.providerId) return;
            try {
                setLoading(true);
                const res = await getProviderDetails(data.providerId);
                setProvDetail(res.data);
            } catch (err) {
                console.log(err);
                toast.error("Failed to load provider details");
            } finally {
                setLoading(false);
            }
        };
        fetchProvider();
    }, [data]);

    const handleCancel = async () => {
        try {
            setLoad(true);
            const status = "canceled";
            const appointmentId = data._id;
            const cancelData = { appointmentId, status };
            await cancelAppointment(cancelData);
            toast.success("Appointment cancelled successfully");
            navigate('/bookings');
        } catch (err) {
            console.log(err);
            toast.error("Failed to cancel appointment");
        } finally {
            setLoad(false);
        }
    };

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        accepted: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        canceled: "bg-red-100 text-red-800"
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header and Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <Link 
                        to="/bookings" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" size={18} />
                        <span className="font-medium">Back to Bookings</span>
                    </Link>

                    {data.status === "completed" && (
                        <ScrollLink to="ratings" smooth={true} duration={500}>
                            <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold px-4 py-2 rounded-lg transition-colors animate-pulse">
                                Add Your Rating
                            </button>
                        </ScrollLink>
                    )}

                    {data.status === "pending" && (
                        <button 
                            onClick={() => setCancelDialog(true)}
                            className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            Cancel Appointment
                        </button>
                    )}
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Provider Information Section */}
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Provider Profile */}
                                <div className="md:col-span-1 flex flex-col items-center md:items-start">
                                    <img
                                        src={data.serviceProviderImage || '/default-profile.jpg'}
                                        alt="Provider"
                                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md mb-4"
                                        onError={(e) => (e.target.src = '/default-profile.jpg')}
                                    />
                                    <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">
                                        {`${provDetail.firstName || ''} ${provDetail.middleName || ''} ${provDetail.lastName || ''}`}
                                    </h2>
                                    <p className="text-gray-600 mb-2">{provDetail.speciality}</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[data.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {data.status}
                                    </span>
                                </div>

                                {/* Contact Information */}
                                <div className="md:col-span-1 space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
                                    <div className="space-y-3">
                                        <p className="flex items-center text-gray-700">
                                            <MdLocalPhone className="text-green-500 mr-3" size={20} />
                                            <span>{data.number || 'Not provided'}</span>
                                        </p>
                                        <p className="flex items-center text-gray-700">
                                            <MdLocationOn className="text-red-500 mr-3" size={20} />
                                            <span>
                                                {data?.address?.street ? `${data.address.street}, ${data.address.city}` : 'Address not provided'}
                                            </span>
                                        </p>
                                        <p className="flex items-center text-gray-700">
                                            <MdAttachMoney className="text-yellow-500 mr-3" size={20} />
                                            <span>Service Fee: Rs {data.fees || '0'}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="md:col-span-1 space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Appointment Details</h3>
                                    <div className="space-y-3">
                                        <p className="flex items-center text-gray-700">
                                            <MdDateRange className="text-purple-500 mr-3" size={20} />
                                            <span>{new Date(data.date).toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex items-center text-gray-700">
                                            <MdAccessTime className="text-blue-500 mr-3" size={20} />
                                            <span>{data.slot}</span>
                                        </p>
                                        <p className="flex items-center text-gray-700">
                                            <MdPerson className="text-indigo-500 mr-3" size={20} />
                                            <span>Booked by: {data.userName}</span>
                                        </p>
                                        <p className="flex items-center text-gray-700">
                                            <MdSchedule className="text-gray-500 mr-3" size={20} />
                                            <span>Created: {new Date(data.createdAt).toLocaleString()}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Section */}
                            {data?.address?.lat && data?.address?.lng && (
                                <div className="p-6 pt-0">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Location</h3>
                                    <div className="h-64 rounded-lg overflow-hidden shadow-sm border">
                                        <MapContainer
                                            center={[data.address.lat, data.address.lng]}
                                            zoom={15}
                                            scrollWheelZoom={false}
                                            className="h-full w-full"
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <Marker position={[data.address.lat, data.address.lng]}>
                                                <Popup className="font-medium">Service Location</Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                </div>
                            )}

                            {/* Rating Section */}
                            {data.status === "completed" && (
                                <div id="ratings" className="p-6 border-t">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Rate Your Experience</h3>
                                    <Rating 
                                        serviceProvider={provDetail._id} 
                                        appointment={data._id} 
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Dialog */}
            {cancelDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Cancellation</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to cancel this appointment?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setCancelDialog(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                No, Keep It
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={load}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
                            >
                                {load ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewService;