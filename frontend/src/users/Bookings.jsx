import React, { useEffect, useState } from 'react';
import userStore from '../store/UserStore';
import { FaClock, FaMapMarkerAlt, FaEllipsisV } from "react-icons/fa";
import Pending from './components/Pending';
import Rejected from './components/Rejected';
import Completed from './components/Completed';
import Cancel from './components/Cancel';
import { Link } from 'react-router-dom';
import { MdPayment } from "react-icons/md";


const Bookings = () => {
  const{authUser, getBookings}=userStore();
  const[data, setData]=useState([]);

  const[complete,setComplete]=useState([]);
  const[pending,setPending]=useState([]);
  const[accepted,setAccepted]=useState([]);
  const[reject,setRejected]=useState([]);
  const[cancel,setCancel]=useState([]);
  const[step,setStep]=useState(1);

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const res= await getBookings(authUser._id);
        setData(res);

        const completedBookings = res.data.filter((d) => d.status === "completed");
        setComplete(completedBookings); 

        const pendingBookings= res.data.filter((p)=>p.status=="pending");
        setPending(pendingBookings);

        const acceptedBookings=res.data.filter((a)=>a.status==="accepted");
        setAccepted(acceptedBookings);

        const rejectBookings=res.data.filter((r)=>r.status==="rejected");
        setRejected(rejectBookings);

        const cancelBookings=res.data.filter((c)=>c.status==="canceled");
        setCancel(cancelBookings);

        console.log(acceptedBookings);
      }catch(err){
        console.log(err)
      }
    }

    fetchData();
  },[])

  console.log("complete",data);
  return (
    <div className='mt-16 min-h-screen m-8'>

      <div className=' m-12'>  
        <div>
        <h1 className='font-semibold text-3xl m-2 ml-12'>Bookings</h1>
        <p className='text-gray-600 mt-1 ml-12'>See your scheduled events from your calendar events links</p>
        </div>
       
       <div className=' flex gap-8 bg-gray-100 mt-12 justify-between py-4 rounded-2xl m-12 '>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===1?"bg-white":"text-gray-500"}`} onClick={()=>setStep(1)}>Upcoming Bookings</h2>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===2?"bg-white":"text-gray-500"}`} onClick={()=>setStep(2)}>Pending Bookings</h2>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===3?"bg-white":"text-gray-500"}`} onClick={()=>setStep(3)}>Rejected Bookings</h2>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===4?"bg-white":"text-gray-500"}`} onClick={()=>setStep(4)}>Complete Bookings</h2>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===5?"bg-white":"text-gray-500"}`} onClick={()=>setStep(5)}>Cancel Bookings</h2>
       </div>
      </div> 

      {step === 1 && (
  <div className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-4">
    {accepted.length === 0 ? (
      <div className="text-center text-gray-600">No upcoming bookings</div>
    ) : (
      accepted.map((booking) => {
        const bookingDate = new Date(booking.date);

        return (
          <Link
          to={`/view-booking-details/${booking._id}`}
            className='m-2'
          >
          <div key={booking._id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">

            <div className="flex items-center gap-6">
              <div className="text-orange-500 font-bold text-2xl text-center">
                {bookingDate.getDate()} {/* Day */}
                <div className="text-2xl text-gray-700 font-medium">
                  {bookingDate.toLocaleDateString("en-US", { month: "long" })}
                </div>
                <div className="text-xs text-gray-400">
                  {bookingDate.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
              </div>

             
              <div className="text-gray-700">
                <div className="flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  <span>Booking Slot: <span className=' font-bold'>{booking.slot}</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{booking.address.street}, {booking.address.city}</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Booking Details */}
            <div className="text-gray-700">
              <p className="font-medium">Booked By: {booking.userName}</p>
              <p className="text-sm text-gray-500">Fee: Rs{booking.fees}</p>
            </div>


            <div className=' flex'>
              <MdPayment size={25}/>
              Payment
            </div>
            {/* Right Section: Status & Edit */}
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  booking.status === "accepted"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Upcoming
              </span>
              <button className="text-gray-500 hover:text-gray-700">
                <FaEllipsisV />
              </button>
            </div>
          </div>
          </Link>
        );
      })
    )}
  </div>
)}

      {step===2 &&(
        <div className='m-10'>
        <Pending pending={pending}/>
        </div>
      )}

      {step ==3 &&(
        <div>
        <Rejected reject={reject}/>
        </div>
      )}

      {step ===4 &&(
        <div>
          <Completed complete={complete}/>
        </div>
      )}
      {
        step ===5 &&(
          <div>
            <Cancel cancel={cancel}/>
          </div>
        )
      }
      
    </div>
  )
}

export default Bookings;
