import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import userStore from "../store/UserStore";
import Logo from '../assets/Logo.png';
import {Link as ScrollLink} from 'react-scroll';
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { authUser, logout } = userStore();

  const [dropDownOpen, setDropDown] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const dropDownRef = useRef(null);

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

  return (
    <>
    
      




        {authUser==null && 
          (
            <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
              scrolling ? "bg-white shadow-md py-2" : "bg-transparent py-4"
            }`}
          >
            <div className="flex items-center justify-between px-10">
              
             
              
             
             
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
              <ul className="flex gap-10">
                <li>
                  <ScrollLink
                    className={`font-medium transition duration-300 ${
                      scrolling ? "text-black hover:text-yellow-600" : "text-white hover:text-yellow-300"
                    } hover:underline`}
                    to="service"
                    smooth={true}
                    duration={500}
                  >
                    Services
                  </ScrollLink>
                </li>
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
       




       {authUser?.role =="User" && (
        <div
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolling ? "bg-white shadow-lg " : "bg-gray-100 text-white border border-red shadow-xl"
          }`}
        >
          <div className="flex items-center justify-between px-10 ">
              
             
              
             
             
              <div className="flex items-center w-64">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Ghar Kaam Logo" className="h-8 mr-2 md:h-10 " />
          <h1
            className={`text-3xl font-bold cursor-pointer transition duration-300 ${
              scrolling ? "text-yellow-400" : "text-yellow-400"
            } sm:text-xl md:text-2xl`}
          >
            Ghar Kaam
          </h1>
        </Link>
      </div>

            <div className="flex items-center flex-grow justify-center gap-4">
              <ul className="flex gap-12">
                <li>
                  <Link
                    to="/homepage/user"
                    // className="text-black text-lg font-medium hover:text-yellow-600 transition duration-300"
                    className={`font-medium transition duration-300 ${
                      scrolling ? "text-black hover:text-yellow-600" : "text-black hover:text-yellow-300"
                    } hover:underline`}
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                  //  className="text-black text-lg font-medium hover:text-yellow-600 transition duration-300"
                  className={`font-medium transition duration-300 ${
                    scrolling ? "text-black hover:text-yellow-600" : "text-black hover:text-yellow-300"
                  } hover:underline`}
                  >
                  
                    SERVICES
                  </Link>
                </li>
                <li>
                  <Link
                  //  className="text-black text-lg font-medium hover:text-yellow-600 transition duration-300"
                  className={`font-medium transition duration-300 ${
                    scrolling ? "text-black hover:text-yellow-600" : "text-black hover:text-yellow-300"
                  } hover:underline`}
                  >
                    HELP
                  </Link>
                </li>
              </ul>
            </div>

            <div ref={dropDownRef} className="relative">
              <button onClick={() => setDropDown(!dropDownOpen)} className="flex items-center gap-2">
                <img className="w-10 h-10 rounded-full object-cover" src={authUser.image} alt="User" />
                <span className="text-black">{authUser.name}</span>
              </button>

              {dropDownOpen && (
                <div className="mt-2 absolute right-0 bg-white shadow-lg rounded-md z-10 w-40">
                  <Link to={"/profile/user"}>
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
       )  
      }


{authUser?.role =="ServiceProvider" && (

        <div className=" flex justify-between bg-white  border-gray-300 shadow-lg border-b-2 "> 
            <div className="flex items-center justify-between p-3">

<div className=" flex"> 
<img src={Logo} alt="Ghar Kaam Logo" className="h-8 mr-2 md:h-8 " />

<div>
<h1 className="text-3xl font-bold cursor-pointer transition duration-300 text-yellow-600 sm:text-xl md:text-xl">
  Ghar Kaam
</h1>
<h3 className=" text-xs font-k2d border-2 border-gray-500 rounded-lg flex justify-center">Service Provider</h3>
  </div>

</div>


  
</div>
  
  <div className="px-4 py-3">
  <button
    className="font-k2d text-lg bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-md"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
        </div>
      
       )  
      }


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
