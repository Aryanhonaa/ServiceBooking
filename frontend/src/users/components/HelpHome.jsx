import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";

const HelpHome = () => {
    const[open1,setOpen1]=useState(false);
    const[open2,setOpen2]=useState(false);
    const[open3,setOpen3]=useState(false);
  return (
    <main>
      <div className='mt-9 m-20'>

        <div className={`border border-black  flex py-2 cursor-pointer ${open1 ? "border-yellow-500":""}`} onClick={()=>{setOpen1((s)=>!s), setOpen2(false),setOpen3(false)}}>
        {
            open1 ? (
                <>
                <div className=' w-full '>
                    <div className='flex '>
                    <FiMinus size={14}  className='mt-1 ml-1 text-yellow-600'/>
                    <h1 className=' ml-2 text-yellow-500 font-semibold font-k2d text-center mb-4'>Welcome To GharKaam</h1>
                    </div>

                   <div className=' border-t-2 border-yellow-500 w-full  '>
                    <h1 className=' mt-2 ml-7 font-k2d'>Who we are? <br/>

                    GharKaam is one of the leading new and emerging home service booking websites available in .</h1>
                   </div>
                </div>
                </>
            ):(
                <>
                 <FaPlus size={14} className='mt-1 ml-1 '/>
                 <h1 className=' ml-2'>Welcome To GharKaam</h1>
                </>
            )
        }
        </div>



        <div className={`border border-black shadow-sm flex py-2 cursor-pointer ${open2 ? "border-red-500":""}`} onClick={()=>{setOpen2((s)=>!s), setOpen1(false), setOpen3(false)}} >
        {
            open2 ? (
                <>
                <div className=' w-full'>
                    <div className='flex'>
                    <FiMinus size={14}  className='mt-1 ml-1 text-yello2-600'/>
                    <h1 className=' ml-2 text-yellow-500 font-semibold font-k2d'>What we do ??</h1>
                    </div>

                   <div className=' border-t-2 border-yellow-500 w-full  font-k2d '>
                    <h1 className=' mt-2 ml-7'>

                    We at GharKaam provide an easy to use platform for both service providers and service customers can register their accounts for free.<br/>

Here, service providers can register themselves as author and submit their list of services (each service as a separate listing) which are available for booking online to do the needful of our service customers.<br/>

Service customers can register themselves as user and search for their needful services and book the selected service upon availability and get their service done by our verified service experts.</h1>
                   </div>
                </div>
                </>
            ):(
                <>
                 <FaPlus size={14} className='mt-1 ml-1 font-k2d'/>
                 <h1 className=' ml-2' >What we do?</h1>
                </>
            )
        }
       
        </div>


        <div className={`border border-black shadow-xl flex py-2 cursor-pointer ${open3 ? "border-yellow-500":""}`} onClick={()=>{setOpen3((s)=>!s), setOpen1(false), setOpen2(false)}} >
        {
            open3 ? (
                <>
                <div className=' w-full'>
                    <div className='flex'>
                    <FiMinus size={14}  className='mt-1 ml-1 text-yellow-600'/>
                    <h1 className=' ml-2 text-yellow-500 font-semibold font-k2d'>What choose us??</h1>
                    </div>

                   <div className=' border-t-2 border-yellow-500 w-full  '>
                    <h1 className=' mt-2 ml-7 font-k2d'>

                    We are offering an easy to use platform for our service providers such as electricians, carpenters, plumbers, painters, appliance repair technicians etc., to list their services and receive unlimited <br/> direct leads, inquiries and service bookings from our website visitors or service customers for free for life time.

                    <br/>We are also providing a free platform to our website visitors to find their needful services in their locality and book the selected service upon availability and pay the service fee after getting the service done!
                  </h1>
                   </div>
                </div>
                </>
            ):(
                <>
                 <FaPlus size={14} className='mt-1 ml-1 '/>
                 <h1 className=' ml-2 font-k2d'>What we do?</h1>
                </>
            )
        }
       
        </div>

        


        
      </div>
    </main>
  )
}

export default HelpHome;
