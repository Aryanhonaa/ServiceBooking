import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import userStore from "../store/UserStore";
import Logo from '../assets/logos.png';
import {Link as ScrollLink} from 'react-scroll';
import { useNavigate } from "react-router-dom";
import serviceP from "../store/ServiceProviderStore";
import {FaMoon, FaSun, FaBell } from "react-icons/fa";


const Navigation = () => {
  const { authUser, logout } = userStore();

  const [dropDownOpen, setDropDown] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const dropDownRef = useRef(null);

  const {darkMode, pendingRequests, isDarkMode}=serviceP();
  const [req,setReq]=useState(0);

  const navigate=useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(navigate);  // Pass navigate to logout
  };

  useEffect(() => {
    if (authUser?.role === "ServiceProvider") {
      const fetchReq = async () => {
        try {
          const res = await pendingRequests(authUser._id);
          setReq(res.data.length)
        } catch (err) {
          console.log(err);
        }
      };
  
      fetchReq();
    }
  }, []);
  return (
    <>
    
      




        {authUser==null && 
          (
            <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
              scrolling ? "bg-white shadow-md py-2" : "bg-transparent py-4"
            }`}
          >
            <div className="flex items-center justify-between px-10 ml-10">
              
             
              
             
             
              <div className="flex items-center w-64">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Ghar Kaam Logo" className="h-8 mr-2 md:h-10 " />
          <h1
            className={`text-3xl font-bold cursor-pointer transition duration-300 ${
              scrolling ? "text-yellow-600" : "text-yellow-400"
            } sm:text-xl md:text-2xl`}
          >
            Ghar Kaam
          </h1>
        </Link>
      </div>
      
              {/* Navigation Links */}
              <ul className="flex gap-10 ml-[600px]">
               
                <li>
                  <Link to={'/service-provider'}
                    className={`font-medium transition duration-300 ${
                      scrolling ? "text-black hover:text-yellow-600" : "text-white hover:text-yellow-300"
                    } hover:underline`}
                    
                  >
                    Earn With GharKaam
                  </Link>
                </li>
                <li>
                  <Link
                    className={`font-medium transition duration-300 ${
                      scrolling ? "text-black hover:text-yellow-600" : "text-white hover:text-yellow-300"
                    } hover:underline`}
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
      
              {/* Login Button */}
              <Link to="/auth">
                <button className="px-6 py-2 rounded-lg font-semibold shadow-md transition duration-300 bg-red-500 text-white hover:bg-yellow-500 hover:scale-105 animate-bounce">
                  LOG IN
                </button>
              </Link>
            </div>
          </div>
          )
        }
       



{authUser?.role === "User" && (
  <div
    className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolling ? "bg-white shadow-lg" : "bg-gray-100 text-white border border-red shadow-xl"
    }`}
  >
    <div className="flex items-center justify-between px-10">
      {/* Logo Section */}
      <div className="flex items-center w-64">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Ghar Kaam Logo" className="h-8 mr-2 md:h-10" />
          <h1 className="text-3xl font-bold cursor-pointer text-yellow-400 transition duration-300 sm:text-xl md:text-2xl">
            Ghar Kaam
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center flex-grow justify-center gap-6">
        <ul className="flex gap-8">
          <li>
            <Link
              to="/homepage/user"
              className={`font-robotoCondensed font-normal transition duration-300 ${
                scrolling ? "text-black hover:text-yellow-600" : "text-black hover:text-yellow-300"
              } hover:underline`}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`font-medium transition duration-300  font-robotoCondensed ${
                scrolling ? "text-black hover:text-yellow-600" : "text-black hover:text-yellow-300"
              } hover:underline`}
            >
              SERVICES
            </Link>
          </li>
        
          <li>
            <Link
              to="/bookings"
              className={`font-medium transition duration-300 font-robotoCondensed ${
                scrolling ? "text-black hover:text-yellow-600" : "text-black hover:text-yellow-300"
              } hover:underline`}
            >
              BOOKINGS
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className={`font-medium transition duration-300 ${
                scrolling ? "text-black hover:text-yellow-600" : "text-black hover:text-yellow-300"
              } hover:underline`}
            >
              HELP
            </Link>
          </li>
        </ul>
      </div>

      {/* User Dropdown Menu */}
      <div ref={dropDownRef} className="relative">
        <button onClick={() => setDropDown(!dropDownOpen)} className="flex items-center gap-2">
          <img className="w-10 h-10 rounded-full object-cover" src={authUser.image} alt="User" />
          <span className="text-black">{authUser.name}</span>
        </button>

        {dropDownOpen && (
          <div className="mt-2 absolute right-0 bg-white shadow-lg rounded-md z-10 w-44">
            <Link to="/profile/user">
              <span className="block px-4 py-2 hover:bg-gray-500 text-black">Profile</span>
            </Link>
          
            <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-500">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}



{authUser?.role === "ServiceProvider" && (
 <div
 className={`${
   darkMode
     ? "bg-gray-900 border-gray-700"
     : "bg-white border-gray-300"
 } flex justify-between items-center px-6 py-3 shadow-lg border-b-2`}
>
 {/* Left Section (Logo & Branding) */}
 <div className="flex items-center space-x-3">
   <img src={Logo} alt="Ghar Kaam Logo" className="h-10 md:h-12" />
   <div>
     <h1 className="text-2xl font-extrabold text-yellow-600 sm:text-xl md:text-2xl">
       Ghar Kaam
     </h1>
     <span
       className="text-xs font-semibold border border-gray-500 rounded-md px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
     >
       Service Provider
     </span>
   </div>
 </div>

 {/* Right Section (Icons & Logout) */}
 <div className="flex items-center space-x-6">
   {/* Notification Icon */}
   <div className="relative">
    <Link to={'/appointment/service-provider'}>
     <FaBell className="text-2xl text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-black transition" />
     {req > 0 && (
       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
         {req}
       </span>
     )}
     </Link>
   </div>

   {/* Dark Mode Toggle */}
   <button
     onClick={isDarkMode}
     className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-200 transition"
   >
     {darkMode ? (
       <FaSun className="text-yellow-400" size={22} />
     ) : (
       <FaMoon className="text-gray-600" size={22} />
     )}
   </button>

   {/* Logout Button */}
   <button
     className="bg-red-500 text-white px-5 py-2 text-sm md:text-base font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
     onClick={handleLogout}
   >
     Logout
   </button>
 </div>
</div>

)}


      {
        authUser ?.role== 'admin' && (
          <>
          
          </>
        )
      }

    
    </>
  );
};

export default Navigation;
