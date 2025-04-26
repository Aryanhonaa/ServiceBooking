import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../config/axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import userStore from '../../store/UserStore';
import { toast } from "react-toastify";
import Loading from "../../pages/Loading";
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaArrowLeft, FaEdit, FaMapMarkerAlt } from "react-icons/fa";
import { GoSun, GoMoon } from "react-icons/go";
import AddressSelectorUser from "./AddressSelectorUser";

const BookAppointment = ({ dataImg }) => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [slots, setSlots] = useState();
    
    const { authUser } = userStore();
    const [address, setAddress] = useState({
        street: authUser?.address.street, 
        city: authUser?.address.city, 
        country: authUser?.address.country, 
        lat: authUser?.address.lat, 
        lng: authUser?.address.lng
    });
    const [newAddress, setNewAddress] = useState(null);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [date, setDate] = useState(new Date());

    const [openDialog, setOpenDialog] = useState(false);
    const [openMap, setOpenMap] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await axiosInstance.get(`/users/service/profile/${id}`);
                if (fetchedData.data.success) {
                    setData(fetchedData.data.data);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!data._id) return;

        const fetchSchedule = async () => {
            setScheduleLoading(true);
            try {
                const response = await axiosInstance.get(`/serviceprovider/get-time-table?providerId=${data._id}`);
                if (response.data.schedule) {
                    setSchedule(response.data.schedule);
                } else {
                    setError("No schedule data available.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch schedule data.");
            } finally {
                setScheduleLoading(false);
            }
        };

        fetchSchedule();
    }, [data._id]);

    const handleDateChange = (selectedDate) => {
        const dayOfWeek = selectedDate.toLocaleString("en-US", { weekday: "long" });
        setDate(selectedDate);
        setSelectedDay(dayOfWeek);
    };

    const renderTimeSlots = () => {
        if (!selectedDay || !schedule[selectedDay] || schedule[selectedDay].length === 0) {
            return <p className="text-gray-600">No slots available for {selectedDay}.</p>;
        }
        
        const availableSlots = schedule[selectedDay].filter((slot) => {
            if (slot.bookingDate) {
                const bookingDate = new Date(slot.bookingDate);
                const selectedDate = new Date(date);
                const isSameDay = bookingDate.toISOString().split("T")[0] === selectedDate.toISOString().split("T")[0];
                return !isSameDay;
            }
            return true;
        });
        
        const amSlots = availableSlots.filter((slot) => slot.time.toLowerCase().includes("am"));
        const pmSlots = availableSlots.filter((slot) => slot.time.toLowerCase().includes("pm"));
        
        return (
            <div className="space-y-6">
                {amSlots.length > 0 && (
                    <div>
                        <div className="flex items-center mb-3">
                            <GoSun className="text-yellow-500 mr-2" size={18} />
                            <h3 className="text-md font-medium text-gray-700">Morning Slots</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {amSlots.sort((a, b) => {
                                const timeToMinutes = (time) => {
                                    const [hourMin, period] = time.split(" ");
                                    const [hours, minutes] = hourMin.split(":").map(Number);
                                    const isPM = period.toLowerCase() === "pm";
                                    return (hours % 12) * 60 + minutes + (isPM ? 12 * 60 : 0);
                                };
                                return timeToMinutes(a.time) - timeToMinutes(b.time);
                            }).map((slot) => (
                                <button
                                    key={slot._id}
                                    onClick={() => (setSlots(slot.time), setOpenDialog(true))}
                                    className={`p-2 rounded-md text-sm font-medium transition-all ${
                                        slot.isBooked 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    }`}
                                    disabled={slot.isBooked}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {pmSlots.length > 0 && (
                    <div>
                        <div className="flex items-center mb-3">
                            <GoMoon className="text-gray-600 mr-2" size={18} />
                            <h3 className="text-md font-medium text-gray-700">Afternoon Slots</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {pmSlots.sort((a, b) => {
                                const timeToMinutes = (time) => {
                                    const [hourMin, period] = time.split(" ");
                                    const [hours, minutes] = hourMin.split(":").map(Number);
                                    const isPM = period.toLowerCase() === "pm";
                                    return (hours % 12) * 60 + minutes + (isPM ? 12 * 60 : 0);
                                };
                                return timeToMinutes(a.time) - timeToMinutes(b.time);
                            }).map((slot) => (
                                <button
                                    key={slot._id}
                                    onClick={() => (setSlots(slot.time), setOpenDialog(true))}
                                    className={`p-2 rounded-md text-sm font-medium transition-all ${
                                        slot.isBooked 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    }`}
                                    disabled={slot.isBooked}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleSendData = async () => {
        try {
            if (!date || !slots) {
                toast.error("Please select a date and time slot");
                return;
            }
    
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const name = `${authUser?.name} ${authUser?.lastName}`.trim();
            const appointmentAddress = newAddress || address;
    
            const formData = new FormData();
            formData.append("providerId", id);
            formData.append("date", formattedDate);
            formData.append("slot", slots);
            formData.append("user", authUser._id);
            formData.append("userName", name);
            formData.append("fees", data.fees);
            formData.append("address", JSON.stringify(appointmentAddress));
            formData.append("img", authUser.image);
            formData.append("number", authUser.phone);
            formData.append("image", dataImg);
    
            const response = await axiosInstance.post('/users/send-appointment', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    
            if (response.data.success) {
                toast.success("Appointment booked successfully!");
                setOpenDialog(false);
            } else {
                toast.error("Failed to book appointment");
            }
        } catch (err) {
            console.error(err?.response?.data?.message || "Something went wrong!");
            if (err.response?.status === 409) {
                toast.warning(err.response.data.message || "Appointment already exists");
            } else {
                toast.error(err?.response?.data?.message || "Something went wrong!");
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
            {openDialog ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">Confirm Appointment</h3>
                        <button 
                            onClick={() => setOpenDialog(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FaArrowLeft size={18} />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FaCalendarAlt className="text-blue-600" size={16} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">{date.toDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FaClock className="text-blue-600" size={16} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium">{slots}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FaMoneyBillWave className="text-blue-600" size={16} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fee</p>
                                <p className="font-medium">Rs {data.fees}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                                <FaMapMarkerAlt className="text-blue-600" size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">Your Address</p>
                                        <p className="font-medium">
                                            {address.street}, {address.city}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setOpenMap(!openMap)}
                                        className="text-blue-600 hover:text-blue-800 ml-2"
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                </div>
                                {openMap && (
                                    <div className="mt-3">
                                        <AddressSelectorUser 
                                            onAddressSelect={(newAddress) => {
                                                setAddress(newAddress);
                                                setNewAddress(newAddress);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                        <button
                            onClick={() => setOpenDialog(false)}
                            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSendData}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Date</h3>
                        <Calendar
                            onChange={handleDateChange}
                            value={date}
                            minDetail="month"
                            maxDetail="month"
                            activeStartDate={new Date(currentYear, currentMonth, 1)}
                            tileDisabled={({ date }) => (
                                date.getMonth() !== currentMonth || date < new Date().setHours(0, 0, 0, 0)
                            )}
                            className="border-0 shadow-sm rounded-lg p-3 w-full"
                        />
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {selectedDay ? `Available Slots for ${selectedDay}` : "Select a date to see available slots"}
                        </h3>
                        {selectedDay && renderTimeSlots()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookAppointment;