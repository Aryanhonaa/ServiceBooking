import React, { useEffect, useState } from "react";
import SideBarS from "./components/SideBarS";
import SetAvailability from "./components/SetAvaliability";
import { motion } from "framer-motion";
import { FaUserTie, FaDollarSign, FaBriefcase, FaClock, FaStar, FaMoneyBillWave, FaEdit, FaTags } from "react-icons/fa";
import serviceP from "../store/ServiceProviderStore";
import userStore from "../store/UserStore";
import { Link } from "react-router-dom";
import Certify from "./components/Certified";
import PricingSetupModal from "./components/PricingSetupModal"; // New component for pricing setup

const HomepageServiceProvider = () => {
  const [step, setStep] = useState(1);
  const [reqlength, setReqLength] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { authUser } = userStore();
  const { darkMode, pendingRequests, getCompletedAppoinments, getReviews } = serviceP();
  const [data, setData] = useState([]);
  const [sum, setSum] = useState(null);
  const [review, setReview]=useState();

  const [pending, setPending]=useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!authUser?._id) return;

      try {
        const res = await pendingRequests(authUser._id);
        if (res?.success && res.data) {
          const appointments = Array.isArray(res.data) ? res.data : [res.data];
          setReqLength(appointments.length);
          setPending(res.data.slice(0,4))


        } else {
          setReqLength(0); 
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        setReqLength(0);
      }
    };

    fetchData();
  }, [authUser?._id]);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await getCompletedAppoinments(authUser._id);
        setData(res.data);
        const totalFees = res.data.reduce((acc, appointment) => acc + appointment.fees, 0);
        setSum(totalFees);
      } catch(err) {
        console.log(err);
      }
    };
    fetchCompleted();
  }, [authUser?._id]);


 
  useEffect(() => {
    const timer = setTimeout(() => {
      const getReviewss = async () => {
        try {
          const res = await getReviews(authUser._id);
          console.log(res);
          setReview(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      getReviewss();
    }, 3000); 
    return () => clearTimeout(timer); 
  }, [authUser._id]);

console.log("Pending", pending);

  console.log("REVV",review);


  let avgReviews=0;
  
  if(Array.isArray(review) && review.length > 0) {
    const total = review.reduce((acc, curr) => acc + curr.overallScore, 0);
    
  avgReviews=Math.round((total / review.length) * 10) / 10;


    console.log("AVG",avgReviews);
  }
 

  const currentPricing= authUser.pricing;
  console.log("CURRREM", currentPricing);
  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <SideBarS />
      <div className="flex-1 p-8 relative">
        {/* Dashboard */}


      {
        authUser.certified ===false &&(
          <Certify/>
        )
      }
       
        {step === 1 && (

          <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              darkMode
                ? "bg-gray-700 shadow-xl rounded-2xl p-8 text-white"
                : "bg-white shadow-xl rounded-2xl p-8"
            }`}
          >
            <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-2">
              <FaUserTie className="text-blue-500" />
              Welcome, {authUser?.name || 'Service Provider'} 🚀
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Earnings Card */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`${
                  darkMode
                    ? "bg-gray-800 shadow-lg p-6 rounded-xl border flex items-center space-x-4"
                    : "bg-white shadow-lg p-6 rounded-xl border flex items-center space-x-4"
                }`}
              >
                <FaMoneyBillWave className="text-green-400 text-4xl" />
                <div>
                  <h2 className="text-3xl font-bold">Rs {sum || '0'}</h2>
                  <p className="text-gray-400">Total Earnings</p>
                </div>
              </motion.div>

              {/* Completed Jobs */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`${
                  darkMode
                    ? "bg-gray-800 shadow-lg p-6 rounded-xl border flex items-center space-x-4"
                    : "bg-white shadow-lg p-6 rounded-xl border flex items-center space-x-4"
                }`}
              >
                <FaBriefcase className="text-blue-400 text-4xl" />
                <div>
                  <h2 className="text-3xl font-bold">{data.length}</h2>
                  <p className="text-gray-400">Completed Jobs</p>
                </div>
              </motion.div>

              {/* Pending Requests */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`${
                  darkMode
                    ? "bg-gray-800 shadow-lg p-6 rounded-xl border flex items-center space-x-4 cursor-pointer"
                    : "bg-white shadow-lg p-6 rounded-xl border flex items-center space-x-4 cursor-pointer"
                }`}
              >
                <FaClock className="text-yellow-400 text-4xl" />
                <div>
                  <h2 className="text-3xl font-bold">{reqlength || '0'}</h2>
                  <p className="text-gray-400">Pending Requests</p>
                </div>
              </motion.div>

              {/* Customer Ratings */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`${
                  darkMode
                    ? "bg-gray-800 shadow-lg p-6 rounded-xl border flex items-center space-x-4"
                    : "bg-white shadow-lg p-6 rounded-xl border flex items-center space-x-4"
                }`}
              >
                <FaStar className="text-yellow-500 text-4xl" />
                <div>
                  <h2 className="text-3xl font-bold">{review ==undefined ? "0":avgReviews}/5</h2>
                  <p className="text-gray-400">Customer Ratings</p>
                </div>
              </motion.div>

              <motion.div
  whileHover={{ scale: 1.03 }}
  onClick={() => setShowPricingModal(true)}
  className={`${
    darkMode
      ? "bg-gray-800 shadow-lg p-6 rounded-xl border flex items-center space-x-4 cursor-pointer"
      : "bg-white shadow-lg p-6 rounded-xl border flex items-center space-x-4 cursor-pointer"
  }`}
>
  <FaTags className="text-purple-500 text-4xl" />
  <div className="text-lg font-semibold text-gray-800">
    Set Pricing
    <div className=" flex">
    <p className="text-sm text-gray-500 dark:text-gray-300">
     
     Tap to update your current rates 
   </p>
    <FaEdit className="text-gray-500 ml-5" size={17}/>
    </div>
 
  </div>
</motion.div>
            </div>

            {/* Set Availability Button */}
            <div className="mt-6 flex justify-end" onClick={() => setStep(2)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 font-bold rounded-lg transition flex items-center ${
                  darkMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FaClock className="mr-2" />
                Set Availability
              </motion.button>
            </div>
          </motion.div>
          <div className=" bottom-0">
        <h1 className=" text-[20px] mt-6 font-k2d ">Pending Appointment</h1>

        {
          pending.length !==0? 
          <div>
          <table className="table-auto w-full border-collapse rounded-lg overflow-hidden shadow-2xl mt-2">
          <thead className={`${darkMode ? "bg-yellow-500 text-white" : "bg-yellow-300 text-gray-800"} text-left`}>
            <tr className="text-sm md:text-base font-semibold font-k2d">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Booking Date</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pending && pending.length > 0 ? (
              pending.map((data) => (
              
                <tr key={data._id} className={`${darkMode ? "bg-gray-800 text-white hover:bg-gray-500" : "bg-white"} border-b cursor-pointer hover:bg-gray-200`}>
                  <Link
                   to={`/user/${data._id}/${encodeURIComponent(data.user)}`}
                  >
                  <td className={`${darkMode ? "px-4 py-3 text-blue-500":"px-4 py-3 text-blue-600"}`}>{data?.userName}</td>
                  </Link>
                 
                 
                  <td className={`${darkMode ? "px-4 py-3 text-white":"px-4 py-3 text-black"}`}>{new Date(data.date).toLocaleDateString()}</td>
                  <td className={`${darkMode ? "px-4 py-3 text-white":"px-4 py-3 text-black"}`}>{data?.slot}</td>
                  <td className={`${darkMode ? "px-4 py-3 text-white":"px-4 py-3 text-black"}`}><div className="flex "><FaClock className=" text-yellow-400 mt-1"/>{data?.status}</div></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  No pending appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>

  <Link to={'/appointment/service-provider'}>
        <button className=" flex justify-center align-middle ml-[70vh] px-4 py-3 bg-yellow-400 mt-3 rounded-2xl hover:bg-yellow-500 ">
          View All
        </button>
          </Link>
        </div>
        :
        <>
        <h3>No Requested Appointments</h3>
        </>

        }
        
      </div>
              </div>
          
        )
        
        }

        {/* Set Availability Section */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`${darkMode ? "bg-gray-700 shadow-xl rounded-2xl p-8" : "bg-white shadow-xl rounded-2xl p-8"}`}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Set Availability</h1>
              <button
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
                onClick={() => setStep(1)}
              >
                Back to Dashboard
              </button>
            </div>
            <SetAvailability />
          </motion.div>
        )}

        {/* Pricing Setup Modal */}
        {showPricingModal && (
          <PricingSetupModal 
            currentPricing={currentPricing}

            onClose={() => setShowPricingModal(false)}
            darkMode={darkMode}
          />
        )}
      </div>

    
    </div>
  );
};

export default HomepageServiceProvider;