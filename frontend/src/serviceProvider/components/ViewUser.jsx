import React, { useEffect, useState } from "react";
import SideBarS from "./SideBarS";
import serviceP from "../../store/ServiceProviderStore";
import { useParams } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { MdOutlineCancel, MdCheckCircle } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaCalendarAlt, FaClock, FaRegClock,FaHistory } from "react-icons/fa";
import userStore from "../../store/UserStore";
import { useNavigate } from "react-router-dom";

import { Link as ScrollLink } from "react-scroll";
import { axiosInstance } from "../../config/axios";
import { toast } from "react-toastify";

import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ViewUser = () => {
  const { id, name } = useParams();
  const [data, setData] = useState({});
  const [appointment, setAppointments] = useState({}); // State for appointments (assuming it's an object)
  const { darkMode, getUserData, getHistory } = serviceP();
  const [historyData, setHistorData]=useState([]);
  const {authUser}= userStore();
  const [dialog,setDialog]=useState(false);
  const [Acceptdialog, setAcceptDialog]=useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserData(name, id);
        setData(res.data.data);
        setAppointments(res.data.appointment || {}); // Ensure appointment is an object
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);




  const  serviceProviderId= appointment.providerId;
   const userId= appointment.user;
  useEffect(() => {
    const fetchHistory = async () => {
      if (!serviceProviderId || !userId) return; 
  
      try {
        const res = await getHistory(serviceProviderId, userId);

        setHistorData(res.data);
        console.log("history", historyData);
        
      } catch (err) {
        console.log(err.response ? err.response.data : err.message);
      }
    };
  
    fetchHistory();
    // const timeout = setTimeout(fetchHistory, 2000);

    // return () => clearTimeout(timeout);
  }, [serviceProviderId, userId]); 

  console.log("serId",serviceProviderId)
  console.log("usId",userId);
  console.log("HIstoy",appointment.user);

  


  const hasAddress = data.address && data.address.lat && data.address.lng;


  
  const rejectStatus={
    serviceProvider:`${authUser.firstName} ${authUser.middleName} ${authUser.lastName}`,
    slot:appointment.slot,
    date:appointment.date,
    userEmail:data.email,
    appointmentId:appointment._id,
    status:"rejected",
    providerId:appointment.providerId,
    userId:appointment.user
  }

  const handleReject= async()=>{
    try{
      setRejectLoading(true);
    const res= await axiosInstance.post('serviceprovider/reject-appointment',rejectStatus);
      console.log(res);

      if(res.data.success){
        toast.success('Appointment Rejected Successfully');
        navigate('/appointment/service-provider')

      }
    }catch(err){
      console.log(err);
    }finally{
      setRejectLoading(false);
    }
  }
  
  const acceptedStatus={
    serviceProvider:`${authUser.firstName} ${authUser.middleName} ${authUser.lastName}`,
    slot:appointment.slot,
    date:appointment.date,
    userEmail:data.email,
    appointmentId:appointment._id,
    status:"accepted",
    providerId:appointment.providerId,
    userId:appointment.user
  }

  const handleAccepted= async()=>{
    try{
      setLoading(true)
    const res= await axiosInstance.post('serviceprovider/reject-appointment',acceptedStatus);
      console.log(res);

      if(res.data.success){
        toast.success('Appointment Accepted Successfully');
        navigate('/appointment/service-provider')

      }
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false)
    }
  }

  
    const renderStatus = (status) => {
      switch (status) {
        case 'completed':
          return <span className="text-green-600 text-center"><FaCheckCircle  className=" flex absolute ml-16 mt-1" /> Completed</span>;
        case 'rejected':
          return <span className="text-red-600  text-center"> <FaTimesCircle className=" flex absolute ml-16 mt-1"/>Rejected</span>;
        default:
          return <span className="text-yellow-500 flex items-center"><FaClock className="mr-2" /> Pending</span>;
      }
    };

    const [loading,setLoading]=useState(false);
    const [loadingReject,setRejectLoading]=useState(false);



    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage=5;

    const indexOfLastRow=currentPage * itemsPerPage;
    const indexOfFirstRow= indexOfLastRow- itemsPerPage;

    const currentAppointment= historyData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPage= Math.ceil(historyData.length/itemsPerPage);
    
  return (
    <div
    className={`${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    } flex min-h-screen transition-colors duration-300`}
  >
    {/* Sidebar */}
    <SideBarS />
  
    {/* Main Content */}
    <div className="flex-1 md:p-2">
      <div className="flex ml-3">
       
        <div className="hidden md:block w-1/5 sticky top-20 self-start pl-7 pr-14">
          <div
            className={`${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } shadow-lg rounded-xl p-4 border transition-colors duration-300`}
          >
           
            <h2
              className={`${
                darkMode ? "text-gray-200" : "text-gray-900"
              } text-lg font-bold mb-4 uppercase tracking-wide transition-colors duration-300`}
            >
              Sections
            </h2>
  
            
            <div className="space-y-3">
              {[
                { name: "Schedule", icon: <FaClock className="w-10 h-10 text-blue-500" /> },
                { name: "Info", icon: <FaUser className="w-4 h-10 text-green-500" size={20} /> },
                { name: "Address", icon: <FaMapMarkerAlt className="w-6 h-6 text-red-500" /> },
                { name: "History", icon: <FaHistory className="w-6 h-6 text-purple-500" /> },
              ].map((section) => (
                <ScrollLink
                  key={section.name}
                  to={section.name.toLowerCase()}
                  smooth={true}
                  duration={500}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-md font-semibold ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                  } transition-all duration-300 ease-in-out cursor-pointer`}
                >
                  {section.icon}
                  <span>{section.name}</span>
                </ScrollLink>
              ))}
            </div>
          </div>
        </div>
  
        {/* Content Area */}
        <div className="flex-1 ml-2">
          <div
            className={`${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } shadow-lg rounded-xl p-4 w-full max-w-5xl mx-auto transition-colors duration-300`}
          >
            {/* Appointments Section */}
            <div className="mb-4">
              <h3
                id="schedule"
                className={`${
                  darkMode ? "text-gray-200" : "text-gray-800"
                } text-2xl font-bold mb-3 mt-2 transition-colors duration-300`}
              >
                Appointment
              </h3>
              <div
                className={`${
                  darkMode ? "bg-gray-700 hover:shadow-gray-600" : "bg-gray-50 hover:shadow-md"
                } p-3 rounded-xl shadow-sm transition-shadow duration-300 ease-in-out`}
              >
                <div className="flex justify-between items-center space-x-3">
                  {/* Left Side: Appointment Details */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaCalendarAlt className={`${darkMode ? "text-gray-400" : "text-gray-500"} mr-2 w-4 h-4`} />
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          <span className="font-medium">Date:</span>{" "}
                          {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <FaClock className={`${darkMode ? "text-gray-400" : "text-gray-500"} mr-2 w-4 h-4`} />
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          <span className="font-medium">Slot:</span> {appointment.slot || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <FaRegClock className={`${darkMode ? "text-gray-400" : "text-gray-500"} mr-2 w-4 h-4`} />
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          <span className="font-medium">Created At:</span>{" "}
                          {appointment.createdAt ? new Date(appointment.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
  
                  {/* Right Side: Status Badge */}
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                        appointment.status === "pending"
                          ? darkMode
                            ? "bg-yellow-700 text-yellow-200 hover:bg-yellow-600"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : appointment.status === "accepted"
                          ? darkMode
                            ? "bg-green-700 text-green-200 hover:bg-green-600"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                          : darkMode
                          ? "bg-red-700 text-red-200 hover:bg-red-600"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {appointment.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* User Info Section */}
            <div className="mb-4">
              {/* Header with Image */}
              <div className="flex items-center space-x-2 mt-10">
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                />
                <h3
                  id="info"
                  className={`${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  } text-xl font-bold transition-colors duration-300`}
                >
                  User Information
                </h3>
              </div>
  
              {/* Name and Email */}
              <div className="mb-3 mt-3">
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } flex items-center space-x-2 p-2 rounded-lg transition-colors duration-300`}
                >
                  <FaUser className="text-purple-500 w-4 h-4" />
                  <div>
                    <h4 className={`text-md font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {`${data.name} ${data.middleName} ${data.lastName}` || "N/A"}
                    </h4>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {data.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Other Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Phone */}
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } flex items-center space-x-2 p-2 rounded-lg transition-colors duration-300`}
                >
                  <FaPhoneAlt className="text-blue-500 w-4 h-4" />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {data.phone || "N/A"}
                  </span>
                </div>
  
                {/* Gender */}
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } flex items-center space-x-2 p-2 rounded-lg transition-colors duration-300`}
                >
                  <FaUser className="text-purple-500 w-4 h-4" />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {data.gender || "N/A"}
                  </span>
                </div>
  
                {/* Address */}
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } flex items-center space-x-2 p-2 rounded-lg col-span-2 transition-colors duration-300`}
                >
                  <FaMapMarkerAlt className="text-red-500 w-4 h-4" />
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {appointment.address?.street || "N/A"}, {appointment.address?.city || "N/A"}, {data.address?.country || "N/A"}
                  </span>
                </div>
              </div>
            </div>
  
            {/* Map Section */}
            {(hasAddress || dialog === false) && appointment?.address && (
              <div className="mt-10 h-64 rounded-xl overflow-hidden shadow-sm">
                <h1
                  id="address"
                  className={`${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  } text-xl font-bold mb-2 transition-colors duration-300`}
                >
                  Address
                </h1>
                <MapContainer
                  center={[appointment.address.lat, appointment.address.lng]}
                  zoom={14}
                  className="w-full h-56"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[appointment.address.lat, appointment.address.lng]}>
                    <Popup>{data.name}'s Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
  
            {/* History Section */}
            <div className="mt-10">
              <h3
                id="history"
                className={`${
                  darkMode ? "text-gray-200" : "text-gray-800"
                } text-xl font-bold mt-4 transition-colors duration-300`}
              >
                History
              </h3>
              <div
                className={`${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } p-3 rounded-xl shadow-sm transition-colors duration-300`}
              >
                <div className="overflow-auto max-h-72">
                  <table className="table-auto w-full border-collapse rounded-lg overflow-hidden shadow-2xl">
                    <thead>
                      <tr>
                        <th>
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Booked Date
                          </span>
                        </th>
                        <th>
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Slot
                          </span>
                        </th>
                        <th>
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Fee
                          </span>
                        </th>
                        <th>
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Status
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.length > 0 ? (
                        currentAppointment.map((data) => (
                          <tr key={data.id}>
                            <td className={`text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {new Date(data.date).toLocaleDateString()}
                            </td>
                            <td className={`text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {data.slot}
                            </td>
                            <td className={`text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {data.fees}
                            </td>
                            <td className={`text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {renderStatus(data.status)}
                            </td>
                          </tr>
                      )
                    )
                      ) : (
                        <tr>
                          <td colSpan="4" className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} py-4`}>
                            No history data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="flex justify-center mt-4 gap-2">
                    <button
                    onClick={()=>setCurrentPage(currentPage -1)}
                    disabled={currentPage ===1}
                    className={`px-3 py-1 rounded ${
                      darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
                    } disabled:opacity-50`}
                    > 
                      Prev
                    </button>

                    
  {Array.from({ length: totalPage }, (_, index) => (
    <button
      key={index}
      onClick={()=>setCurrentPage(index +1)}
      className={`px-3 py-1 rounded ${
   
        currentPage === index + 1
          ? darkMode
            ? "bg-blue-500 text-white"
            : "bg-blue-200 text-black"
          : darkMode
          ? "bg-gray-600 text-white"
          : "bg-gray-200 text-black"
      }`}
    >
      {index + 1}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPage}
    className={`px-3 py-1 rounded ${
      darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
    } disabled:opacity-50`}
  >
    Next
  </button>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="mt-4 flex justify-start space-x-2">
              <button className={`flex items-center space-x-1 px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-300`}>
                <MdCheckCircle className="w-4 h-4" /> <span className="text-sm" onClick={()=>setAcceptDialog(true)}>{`${loading ?"Loading..." :"Accept"}`}</span>
              </button>
              <button className="flex items-center space-x-1 px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300">
                <MdOutlineCancel className="w-4 h-4" /> <span className="text-sm" onClick={() => setDialog(true)}>
                  Reject
                </span>
              </button>
            </div>
  
            {/* Reject Dialog */}
            {dialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-8 rounded-lg shadow-lg max-w-sm w-full transition-colors duration-300`}
                >
                  <h3 className={`text-lg font-bold text-center mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Are you sure?
                  </h3>
                  <h4
                    className={`text-sm text-center mb-5 font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-bold text-red-600 underline font-k2d">Reject</span> Appointment
                  </h4>
                  <div className="flex justify-around">
                    <button
                      
                      className={`${loadingReject ?"text-gray-500 cursor-not-allowed":""}px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300`}
                      onClick={handleReject}
                    >
                      {loadingReject?"Loading":"Sure"}
                    </button>
                    <button
                      className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300"
                      onClick={() => setDialog(false)}
                    >
                       Nope
                    </button>
                  </div>
                </div>
              </div>
            )}
  
            {/* Accept Dialog */}
            {Acceptdialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-8 rounded-lg shadow-lg max-w-sm w-full transition-colors duration-300`}
                >
                  <h3 className={`text-lg font-bold text-center mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Are you sure?
                  </h3>
                  <h4
                    className={`text-sm text-center mb-5 font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-bold text-green-600 underline font-k2d">Accept</span> Appointment
                  </h4>
                  <div className="flex justify-around">
                    <button
                    
                      className={`${loading ?"text-gray-500 cursor-not-allowed":""}px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300`}
                      onClick={handleAccepted}
                    >
                   {`${loading ?"Loading..." :"Accept"}`}
                    </button>
                    <button
                      className={`px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300`}
                     
                      onClick={() => setAcceptDialog(false)}
                    >
                      
                Nope    
                   </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ViewUser;