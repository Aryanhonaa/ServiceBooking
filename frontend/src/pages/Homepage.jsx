import React from 'react';
import bg from '../assets/bb.jpg'; // Ensure this image is high-quality and relevant
import HomeCategories from '../components/HomeCategories';
import { FaRegClock, FaUsers, FaHeadset } from 'react-icons/fa'
import {Link} from 'react-router-dom';
import MyMapComponent from '../components/MyMapComponent';
import Category from '../components/Category';


const Homepage = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative w-full ">
        {/* Background Image */}
        <img
          src={bg}
          alt="Background"
          className="w-full h-full object-cover"
        />

      
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

    
        <div className="absolute inset-0 flex flex-col justify-center items-start p-10 text-white" >
          {/* <h1 className="font-k2d text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl leading-tight">
            Services made easy, all in one place.
          </h1> */}
          <h2 className="k2d-bold text-4xl md:text-4xl lg:text-9xl font-bold text-white opacity-80 ml-5 " >
            Your Service, <br />
            Our Priority
          </h2>
          <Link to={'/auth'}>
          <button className="mt-32 text-2xl font-bold bg-[#F89912] px-8 py-4 rounded-3xl text-white hover:bg-[#333333] transition duration-300 transform hover:scale-105 ml-7">
            Book Now
          </button>
          </Link>
          
        </div>
      </div>

      <div className="py-16 bg-gray-50 mb-10 relative" id='service'>
        <h1 className="text-4xl font-bold text-center ">
        Seamless Booking, One Click Away
        </h1>
        <h3 className=' justify-center text-center text-gray-500 text-xl'>
        Your perfect service is just one booking away—reserve now and relax!
        </h3>
        <HomeCategories />
      </div>
      

      <div className='flex'>
      {/* Why Choose Us Section */}
      <div className="py-16 bg-white w-1/2" >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4" >Easy Booking</h3>
              <p className="text-gray-600">
                Book your services in just a few clicks. Fast, simple, and hassle-free.
              </p>
              <FaRegClock className='mx-auto text-4xl text-yellow-600 mt-10' size={50}/>
            </div>
            <div className="text-center" id='services'>
              <h3 className="text-2xl font-bold mb-4">Trusted Professionals</h3>
              <p className="text-gray-600">
                We work with certified and experienced professionals to ensure quality service.
              </p>
              <FaUsers className="mx-auto text-4xl text-yellow-600 mt-3" size={50}/>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Our support team is always available to assist you with any queries.
              </p>
              <FaHeadset className="mx-auto text-4xl text-yellow-600 mt-10" size={50}/> 
            </div>
          </div>
        </div>
      </div>

      {/* Become a Service Provider Section */}
     

      {/* Call-to-Action Section */}
      <div className="py-16 bg-[#F89912] text-white text-center w-1/2">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-8">
          Join thousands of satisfied customers and service providers who trust us.
        </p>
        <Link to={'/auth'}>
        <button className="text-2xl font-bold bg-white text-[#F89912] px-8 py-4 rounded-full hover:bg-[#333333] hover:text-white transition duration-300 transform hover:scale-105">
          Sign Up Now
        </button>
        </Link>
        
      </div>
      </div>

      <MyMapComponent/>
    </div>
  );
};

export default Homepage;