import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../config/axios';
import Sidebar from '../Component/SideBar';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import Map from '../Component/Map';
const ValidateService = () => {

    const {data}=useParams();
    console.log(data);
    const [serviceData, setDatas]=useState([]);
    const [isOpen,setIsOpen]=useState(false);
    const [openReject,setOpenReject]=useState(false);
    const navigate =useNavigate();

    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const [rejectData,setRejectData]=useState(2);
    const [openMap,setOpenMap]=useState(true);
    
    useEffect(()=>{
        const fetchData= async()=>{
            try{
                const response=await axiosInstance.get(`/admin/temp-service/${data}`);

                if(response.data.success){
                    console.log("Data:" ,response.data.data);
                     await setDatas(response.data.data)
                }
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    },[])


    const verifyService=async(id)=>{
        try{
            const res= await axiosInstance.get(`/admin/verifyTemp/${id}`);

            if(res.data.sucess){
                navigate('/admin/service-providers');
                toast.success("Service Provide Verified Successfully!!");
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Error in verifing service provider");
        }
    }


    const rejectServiceProvider=async(id)=>{
        try{

            let reason= selectedReason;

            if(selectedReason ==="Other"){
                reason=otherReason;
            }
            const res= await axiosInstance.post(`/admin/reject-tempUser/${id}`,{reason});

            if(res.data.success){
                toast.success("Service Provider Rejected");
                navigate('/admin/service-providers');
            }
        }catch(err){
            console.log(err)
            toast.error(err.response?.data?.message || "Error in rejecting data")
        }
    }
  

    const rejectReasons=[
        "Unverified identity",
        "Mismatched details",
        "Suspicious activty",
        "Invalid Documentation(CitizenShip)",
        "Policy violation",
        "Invalid contact details",  
        "Other"
    ];


    const handleOther = (e) => {
        setOtherReason(e.target.value);
    
      
        if (selectedReason !== "Other") {
            setSelectedReason("Other");
        }
    };

    const[show,setShow]=useState(false);
    console.log(otherReason);
  return (
    <div className=' flex'>
        <Sidebar />
      <div className='felx'>
      <div className="p-6 pr-16 bg-white shadow-md rounded-lg w-2/3 mx-auto mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Service Provider Details</h1>

            <div className="flex items-center gap-6">
                <img
                    src={serviceData.image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-gray-300"
                />
                <div>
                    <h2 className="text-xl font-semibold">{serviceData.firstName} {serviceData.middleName} {serviceData.lastName}</h2>
                    <p className="text-gray-500">{serviceData.speciality}</p>
                </div>
            </div>

            <div className="mt-6 border-t pt-4">
                <p><strong>Email: </strong> {serviceData.email}</p>
                <p><strong>Phone: </strong> {serviceData.phone}</p>
                <p><strong>Experience: </strong> {serviceData.experience} years</p>
                <p><strong>Fees: </strong> NPR {serviceData.fees}</p>
                <p><strong>Address: </strong> <br/>
                        {/* {serviceData.address ? (
                            `Street: ${serviceData.address.street},
                            City: ${serviceData.address.city},Country: ${serviceData.address.country}`
                        ) : (
                            <span className="text-gray-500">No address provided</span>
                        )} */}
                {`Street:${serviceData.address?.street || "N/A"}`}<br/>
                {`City:${serviceData.address?.city|| "N/A"} `}<br/>
                {`Country:${serviceData.address?.country || "N/A"}`}<br/>
                    </p>

                <p><strong>Category: </strong>{serviceData.category}</p>
                <p><strong>Validation Status:</strong> <span className={`font-semibold ${serviceData.validation === "Pending" ? "text-yellow-500" : "text-green-500"}`}>{serviceData.validation}</span></p>
                    {console.log(serviceData.address?.lat, serviceData.address?.lng)}
                    
                    {
                        openMap ==true && (
                            <Map serviceData={serviceData}/>
                        )
                    }
                   
                  
                   
                    
            </div>


            {/* Show Citizenship Images */}
            {/* <div className="mt-6 flex gap-4">
                <div>
                    <p className="font-semibold">Citizenship (Front)</p>
                    <img src={serviceData.citizenF} alt="Citizen Front" className="w-48 h-32 object-cover rounded-md border" />
                </div>
                <div>
                    <p className="font-semibold">Citizenship (Back)</p>
                    <img src={serviceData.citizenB} alt="Citizen Back" className="w-48 h-32 object-cover rounded-md border" />
                </div>
            </div> */}
            <div className="mt-6 flex justify-between items-center">
                <div className=' cursor-pointer' onClick={()=>setIsOpen(true)}>
                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">
        <FaCheckCircle size={24} />
        <span className="font-semibold">Approve</span>
    </button>

                </div>
    {/* Approve Button */}
    
    {/* Reject Button */}

    <div onClick={()=>{setOpenMap(false); setOpenReject(true);}} className=' cursor-pointer'>
    <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300">
        <FaTimesCircle size={24} />
        <span className="font-semibold">Reject</span>
    </button>
    </div>
   
</div>
            
        </div>
       
      </div>
      <div className=' mt-11'>
      <h1>CitizenShip Front Side: </h1>
      <img src={serviceData.citizenF} className=' w-full h-80'></img>

      <h1>CitizenShip Back Side: </h1>
      <img src={serviceData.citizenB} className=' w-full h-80'></img>
      </div>


    {isOpen &&  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-slate-700 px-10 py-8 rounded-lg shadow-lg text-center">
    <h1 className="text-2xl font-bold text-white mb-4">Are You Sure?</h1>
    <h2 className="text-lg text-gray-300 mb-6">Do you want to <span className=' text-green-500'>Approve</span> this request?</h2>

    <div className="flex justify-center space-x-6">
      <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
      onClick={()=>verifyService(serviceData._id)}
      >
        Approve
      </button>
      <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition" onClick={()=>setIsOpen(false)}>
        Cancel
      </button>
    </div>
  </div>
</div>}
     

{openReject && 


    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  
  {rejectData ===1 && (
     <div className="bg-slate-700 px-10 py-8 rounded-lg shadow-lg text-center">
     <h1 className="text-2xl font-bold text-white mb-4">Are You Sure?</h1>
     <h2 className="text-lg text-gray-300 mb-6">Do you want to <span className=' text-red-600'>Disapprove </span>this request?</h2>
 
     <div className="flex justify-center space-x-6">
       <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
    //   
    onClick={()=>setRejectData(2)}
       >
         Approve
       </button>
       <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition" onClick={()=>{setOpenMap(true);setOpenReject(false)}}>
         Cancel
       </button>
     </div>
   </div>
  )}

{rejectData === 2 && (
  <div className="bg-slate-700 px-10 py-8 rounded-lg shadow-lg text-center">
    <div>
        <div className=' flex'>
        <IoMdArrowBack size={30} className=' text-white cursor-pointer' onClick={()=>setRejectData(1)} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}/>
            {show==true &&(
                <h1>Back</h1>
            )}
        <h1 className="text-2xl text-white font-k2d underline ml-7">Select Rejection Reason</h1>
        </div>

     
      <ul className="mt-6">
        {rejectReasons.map((reasons, index) => (
            <div className=' text-white text-xl font-k2d hover:bg-white hover:text-black p-3'>
                 <li key={index}>
            <input
              type="radio"
              id={`reasons-${index}`}
              value={reasons}
              checked={selectedReason === reasons}
              onChange={(e) => {
                setSelectedReason(e.target.value);
                if (e.target.value !== "Other") {
                  setOtherReason(""); // Clear custom reason when not "Other"
                }
              }}
            />
            <label htmlFor={`reasons-${index}`} className=' cursor-pointer'>{reasons}</label>
          </li>
            </div>
         
        ))}
      </ul>
    </div>

    {selectedReason === "Other" && (
      <textarea
        placeholder="Enter custom reason"
        className="mt-4 p-2 w-full bg-gray-800 text-white border rounded-lg"
        value={otherReason} // Bind textarea to state
        onChange={handleOther}
      ></textarea>
    )}

    <button  onClick={()=>rejectServiceProvider(serviceData._id)} className=' px-3 py-3 bg-red-500 rounded-xl  font-k2d hover:bg-red-700 mt'>Submit</button>
  </div>
  
)}
 
</div>}
    </div>
  )
}

export default ValidateService;
