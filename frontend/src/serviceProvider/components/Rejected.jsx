import React, { useState } from 'react';
import { FaClock, FaMapMarkerAlt, FaEllipsisV } from "react-icons/fa";

const Rejected = ({reject}) => {
    const sortReject=[...reject].sort((a,b)=> new Date(a.date)- new Date(b.date));

    const[currentPage, setCurrentPage]=useState(1);
    const itemsPerPage=5;

    const totalPages=Math.ceil(sortReject.length/itemsPerPage);
    const indexOfLastItem= currentPage * itemsPerPage;
    const indexOfFirstItem=indexOfLastItem - itemsPerPage;
    const currentItems=sortReject.slice(indexOfFirstItem,indexOfLastItem);
  return (
    <div>
      {
        reject.length ===0 ?
        <p>No Rejected Appointment</p>
        :(
            <>
              {currentItems.map((booking) => {
                              const bookingDate = new Date(booking.date);
                  
                              return (
                                <div key={booking._id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer hover:shadow-2xl m-4">
                                  {/* Left Section: Booking Date */}
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
                  
                                    {/* Booking Details */}
                                    <div className="text-gray-700">
                                      <div className="flex items-center gap-2">
                                        <FaClock className="text-blue-500" />
                                        <span>Booking Slot: <span className="font-bold">{booking.slot}</span></span>
                                      </div>
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <FaMapMarkerAlt className="text-red-500" />
                                        <span>{booking.address.street}, {booking.address.city}</span>
                                      </div>
                                    </div>
                                  </div>
                  
                                  {/* Middle Section: Booking Info */}
                                  <div className="text-gray-700">
                  
                                    <p className="text-sm text-gray-500">Fee: Rs {booking.fees}</p>
                                  </div>
                  
                                  {/* Right Section: Status & Edit */}
                                  <div className="flex items-center gap-4">
                                    <span
                                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                                        booking.status === "rejected"
                                          ? "bg-rose-300 text-rose-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      rejected
                                    </span>
                                    <button className="text-gray-500 hover:text-gray-700">
                                      <FaEllipsisV />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
            
            
            {totalPages > 1 && (
                        <div className="flex justify-center space-x-2 mt-4">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-lg border ${
                              currentPage === 1 ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            Previous
                          </button>
                          <span className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-lg border ${
                              currentPage === totalPages ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                  
            </>
        )
      }
    </div>
  )
}

export default Rejected;
