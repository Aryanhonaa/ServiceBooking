import React, {useEffect, useState} from 'react';
import SideBarS from './components/SideBarS';
import serviceP from '../store/ServiceProviderStore';
import userStore from '../store/UserStore';
import Complete from './components/Complete';
import { axiosInstance } from '../config/axios';
import Rejected from './components/Rejected';
import Cancel from './components/Cancel';
const History = () => {
    const{darkMode, historyAppointment}=serviceP();
    const {authUser}=userStore()

    const[data,setData]=useState([]);
    const [reject,setReject]=useState([]);
    const [complete,setComplete]=useState([]);
    const [cancel, setCancel]= useState([]);
   
    const[step, setStep]=useState(1);


    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const res= await axiosInstance.get(`serviceprovider/history-appointment?providerId=${authUser._id}`);
                setData(res.data.data);

                const rejectData= res.data.data.filter((r)=>r.status ==="rejected");
                setReject(rejectData);

                const completeData= res.data.data.filter((r)=>r.status ==="completed");
                setComplete(completeData);

                const cancelData= res.data.data.filter((c)=>c.status ==="canceled");
                setCancel(cancelData);
            }catch(err){
                console.log(err)
            }
        }

        fetchData();
    },[])

    console.log("DATA",cancel);
  return (
    <div className={`${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-100 to-gray-200"} flex min-h-screen`}>

    <SideBarS/>

    <div className="p-6 w-full">
    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-500">History Appointments</h1>


     <div className=' m-10'>  
        <div>
        <p className='text-gray-600 mt-3'>See your history</p>
        </div>
       
       <div className=' flex gap-8 bg-gray-100 mt-3 justify-between py-4 rounded-2xl'>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===1?"bg-white":"text-gray-500"}`} onClick={()=>setStep(1)}>Completed Bookings</h2>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===2?"bg-white":"text-gray-500"}`} onClick={()=>setStep(2)}>Rejected Bookings</h2>
        <h2 className={`font-semibold text-xl  hover:bg-white ml-2  cursor-pointer py-2 rounded-xl px-2 ${step===3?"bg-white":"text-gray-500"}`} onClick={()=>setStep(3)}>Cancel Bookings</h2>
       </div>


       {
        step ===1 &&(
            <div className=' mt-10'>
            <Complete complete={complete}/>
            </div>
        )
        }

        {
          step ===2 &&(
            <div>
              <Rejected reject={reject}/>
            </div>
          )
        }

        {
          step ===3 &&(
            <div>
              <Cancel cancel={cancel}/>
            </div>
          )
        }
      </div> 
    </div>

  
    </div>
  )
}

export default History;
