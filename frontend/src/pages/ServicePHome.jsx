import React from "react";
import imgs from "../assets/servicePAuth.jpg";
import serviceP from "../store/ServiceProviderStore";
import SignUpForm from "../components/SignUpForm";
// import AddCategory from "../admin/AddCategory";
import LoginServiceP from "../components/LoginServiceP";
import { FaBriefcase, FaDollarSign, FaStar } from "react-icons/fa";
// import KathmanduMapWithCustomSearch from "../users/KathmanduMapWithCustomSearch";
const ServicePHome = () => {
  const{isLogin ,toogleLogin}=serviceP();
  return (
    <>
    
    
    <div className="relative h-[90vh]">
      {/* Background Image */}
      <img
        src={imgs}
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Service Provider Background"
      />

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-end mb-72 ">
        <h1 className="k2d-bold text-4xl md:text-4xl lg:text-8xl font-bold text-white opacity-80 ml-5 ">
        Get discovered, 
        <br/>
        get booked!
        </h1>
      </div>
    </div>



    <div className=" p-6">

      <h1 className="text-4xl font-bold text-center">Connect. Serve. Grow.</h1>
      <h3 className=" justify-center text-center text-gray-500 text-xl">Your services, their needs—seamlessly matched!</h3>
    </div>


    

    <div className="flex min-h-screen bg-gray-100">
  {/* LOGIN / SIGNUP (Left Side) */}
  <div className="w-1/2 flex justify-center items-center p-8">
    <div className="relative bg-white p-8 max-w-md w-full border border-gray-300 shadow-lg rounded-lg">
      <h1 className="text-3xl font-k2d font-bold text-center">
        {isLogin ? "Welcome back" : "Join Us!"}
      </h1>

      <div>{isLogin ? <LoginServiceP /> : <SignUpForm />}</div>

      <h1 className="text-center mt-4 text-gray-600">
        {isLogin ? "Create a new service provider account" : "Already a service provider!"}
      </h1>

      <div className="flex justify-center mt-5">
        <button
          className="rounded-lg bg-red-600 text-white font-semibold transition duration-300 hover:bg-blue-700 px-5 py-2"
          onClick={toogleLogin}
        >
          {isLogin ? "Create new account!" : "Sign In"}
        </button>
      </div>
    </div>
  </div>

  {/* OTHER UI (Right Side) */}
  <div className="w-1/2 flex justify-center items-center">
  <div className="bg-gray-100 py-16 px-6 flex justify-center">
      <div className="max-w-3xl text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-800">Why Become a Service Provider?</h2>
        <p className="text-lg text-gray-600 mt-3">
          Grow your business, reach more clients, and increase your earnings.
        </p>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaBriefcase size={40} className="text-blue-600 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Work on Your Terms</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Set your own schedule and choose the services you want to offer.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaDollarSign size={40} className="text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Earn More</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Increase your income by reaching a larger audience.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaStar size={40} className="text-yellow-500 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Build Your Reputation</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Gain client trust and grow your business through positive reviews.
            </p>
          </div>
        </div>

        {/* Call-to-Action Button */}
        <div className="mt-8">
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition hover:bg-blue-700">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
    
  
      {/* <AddCategory/> */}
      

    
    </>
  );
};

export default ServicePHome;
