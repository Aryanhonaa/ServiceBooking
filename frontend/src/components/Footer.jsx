import React from 'react'
import googlePlay from '../assets/googleplay.png';
import appStore from '../assets/appStore.png';
import qr from '../assets/qr.png';
import { CiFacebook } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import userStore from '../store/UserStore';
import { Link } from 'react-router-dom';
const Footer = () => {
    const {authUser}=userStore();
    const date = new Date().getFullYear();

  return (
    <footer>

      {/* {authUser?(
        <>
        <div className='bg-[#BB9753] p-8 flex gap-44 text-white'>
        <div className=' ml-28'>
            <h1 className=' font-semibold'>Account</h1>
            <h3>My Account</h3>

            <Link to={'/profile/user'}>
            <h3 className=' cursor-pointer '>{authUser.name}</h3>
            </Link>
        
        </div>

        <div>
            <h1 className=' font-semibold'>Support</h1>
            <h3>Boudha, Kathmandu</h3>
            <a href="mailto:gharkaam@gmail.com" className="text-white hover:underline">gharkaam@gmail.com</a>
            <h3>01-5910229</h3>
        </div>

        <div>
            <h1 className=' font-semibold'>Quick Link</h1>
            <h3>Privacy Policy</h3>
            <h3>Terms of Use</h3>
        </div>
        <div>
            <h1 className=' font-semibold '>Social Media</h1>
            <div className=' flex gap-2 '>
            <CiFacebook size={30} className=' hover:text-blue-600'/>
            <CiInstagram size={30} className=' hover:text-red-800'/>
            <FaXTwitter size={30} className=' hover:text-gray-800'/>
            </div>
        
        </div>

        
        <div>
            <h1 className=' font-semibold '>Download App</h1>
            <img src={qr} className='w-16 absolute '></img>
            <img src={googlePlay} className='w-24  absolute right-10 '></img>
            <img src={appStore} className='w-24 absolute right-10 mt-9'></img>
        </div>
      </div>

      <h1 className='bg-[#BB9753] text-white text-center text-1xl'>&copy; {date} GharKaam. All rights reserved.</h1>
    </> 
    ):(
        <>
     
      </>
      )
    } */}
      

      {authUser === null &&(
        <>
         <div className='bg-[#464646] p-8 flex gap-44 text-white mb-0'>
        <div className=' ml-28'>
            <h1 className=' font-semibold'>Account</h1>
            <h3>My Account</h3>
            <h3>Login/ Register</h3>
        </div>

        <div>
            <h1 className=' font-semibold'>Support</h1>
            <h3>Boudha, Kathmandu</h3>
            <a href="mailto:gharkaam01@gmail.com" className="text-white hover:underline">gharkaam01@gmail.com</a>
            <h3>01-5910229</h3>
        </div>

        <div>
            <h1 className=' font-semibold'>Quick Link</h1>
            <h3>Privacy Policy</h3>
            <h3>Terms of Use</h3>
        </div>
        <div>
            <h1 className=' font-semibold '>Social Media</h1>
            <div className=' flex gap-2 '>
            <CiFacebook size={30} className=' hover:text-blue-600'/>
            <CiInstagram size={30} className=' hover:text-red-800'/>
            <FaXTwitter size={30} className=' hover:text-gray-800'/>
            </div>
        
        </div>

        
        <div>
            <h1 className=' font-semibold '>Download App</h1>
            <img src={qr} className='w-16 h-16  absolute '></img>
            <img src={googlePlay} className='w-24  absolute right-5 '></img>
            <img src={appStore} className='w-24 absolute right-5 mt-9'></img>
        </div>
      </div>

      <h1 className='bg-[#464646] text-white text-center text-1xl'>&copy; {date} GharKaam. All rights reserved.</h1>
        </>
      )}
      {authUser?.role ==="ServiceProvider" &&(
        <>
        <div className='bg-[#BB9753] p-3 flex gap-44 text-white'>
        <div className=' ml-28'>
            <h1 className=' font-semibold'>Account</h1>
            <h3>My Account</h3>

            <Link to={'/profile/user'}>
            <h3 className=' cursor-pointer '>{authUser.name}</h3>
            </Link>
        
        </div>

        <div>
            <h1 className=' font-semibold'>Support</h1>
            <h3>Boudha, Kathmandus</h3>
            <a href="mailto:gharkaam@gmail.com" className="text-white hover:underline">gharkaam@gmail.com</a>
            <h3>01-5910229</h3>
        </div>

        <div>
            <h1 className=' font-semibold'>Quick Link</h1>
            <h3>Privacy Policy</h3>
            <h3>Terms of Use</h3>
        </div>
        <div>
            <h1 className=' font-semibold '>Social Media</h1>
            <div className=' flex gap-2 '>
            <CiFacebook size={30} className=' hover:text-blue-600'/>
            <CiInstagram size={30} className=' hover:text-red-800'/>
            <FaXTwitter size={30} className=' hover:text-gray-800'/>
            </div>
        
        </div>

        
        <div>
            <h1 className=' font-semibold '>Download App</h1>
            <img src={qr} className='w-16 absolute '></img>
            <img src={googlePlay} className='w-24  absolute right-10 '></img>
            <img src={appStore} className='w-24 absolute right-10 mt-9'></img>
        </div>
      </div>

      <h1 className='bg-[#BB9753] text-white text-center text-1xl'>&copy; {date} GharKaam. All rights reserved.</h1>
        
        </>
      )}


      {authUser?.role ==="User" &&(
        <>
        <div className='bg-gray-700 p-3 flex gap-44 text-white'>
        <div className=' ml-28'>
            <h1 className=' font-semibold'>Account</h1>
            <h3>My Account</h3>

            <Link to={'/profile/user'}>
            <h3 className=' cursor-pointer '>{authUser.name}</h3>
            </Link>
        
        </div>

        <div>
            <h1 className=' font-semibold'>Support</h1>
            <h3>Boudha, Kathmandu</h3>
            <a href="mailto:gharkaam@gmail.com" className="text-white hover:underline">gharkaam@gmail.com</a>
            <h3>01-5910229</h3>
        </div>

        <div>
            <h1 className=' font-semibold'>Quick Link</h1>
            <h3>Privacy Policy</h3>
            <h3>Terms of Use</h3>
        </div>
        <div>
            <h1 className=' font-semibold '>Social Media</h1>
            <div className=' flex gap-2 '>
            <CiFacebook size={30} className=' hover:text-blue-600 cursor-pointer'/>
            <CiInstagram size={30} className=' hover:text-red-800 cursor-pointer'/>
            <FaXTwitter size={30} className=' hover:text-gray-800 cursor-pointer'/>
            </div>
        
        </div>

        
        <div>
            <h1 className=' font-semibold '>Download App</h1>
            <img src={qr} className='w-16 absolute '></img>
            <img src={googlePlay} className='w-24  absolute right-16 '></img>
            <img src={appStore} className='w-24 absolute right-16 mt-9'></img>
        </div>
      </div>

      <h1 className='bg-gray-700 text-white text-center text-1xl'>&copy; {date} GharKaam. All rights reserved.</h1>
        
        </>
      )}


    
    </footer>
  )
};

export default Footer
