import Reac , {useState} from 'react';
import SideBarS from './components/SideBarS';
import userStore from '../store/UserStore';
import { IoMdArrowBack } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { toast } from 'react-toastify';
import { axiosInstance } from '../config/axios';
import { BiUser } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import EditProfile from './components/EditProfile';
import { TiTick } from "react-icons/ti";

const ProfileService = () => {
  const { authUser } = userStore();
  const [step,setStep]=useState(1);
  const [open ,setOpen]=useState(false);

  const[about,setAbout]=useState(authUser?.about || null);


  const handleAbout=async()=>{
    try{
      const res= await axiosInstance.put(`/serviceprovider/update-about/${authUser._id}`,{about});

      if(res.data.success){
        setOpen(((s)=>!s));
        toast.success("About Updated Successfully!");
       
      }
    }catch(err){
      console.log(err);
      toast.error("Error In Updating!!");
    }

  }

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar */}
      <SideBarS />

      {/* Main Content */}
      <div className="flex-1 p-2">
        {/* Profile Header */}
        <div className="w-full bg-rose-600 rounded-lg shadow-lg">
          <h1 className="font-k2d text-3xl text-white text-center py-3">Profile</h1>
        </div>

       {step ===1 &&(
        <>
         {/* Profile Card */}
         <div className="mt-6 bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center">
          {/* Profile Image */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg">
            {authUser?.image ? (
              <img 
                src={authUser.image} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
          </div>



          {/* Profile Info */}
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-semibold text-gray-800">
              {authUser?.firstName || "UserName"}
            </h2>
            <p className="text-gray-600 text-lg">{authUser?.email || 'user@example.com'}</p>
            <p className="text-gray-500 mt-2"> {authUser?.speciality|| 'User'}</p>

          </div>
        </div>

          <div className="flex p-4 justify-between bg-white m-3 shadow-xl rounded-lg">
  <div className="bg-blue-600 px-6 py-3 rounded-lg cursor-pointer text-pretty font-k2d text-white hover:bg-blue-500 hover:shadow-lg shadow-md font-medium text-sm transition duration-300"
  onClick={()=>setStep(3)}
  >
    <h1>View Account Information</h1>
  </div>

  <div className="bg-blue-600 px-6 py-3 rounded-lg cursor-pointer text-pretty font-k2d text-white hover:bg-blue-500 hover:shadow-lg shadow-md font-medium text-sm transition duration-300">
    <h1>View Fees</h1>
  </div>

  <div className="bg-blue-600 px-6 py-3 rounded-lg cursor-pointer text-pretty font-k2d text-white hover:bg-blue-500 hover:shadow-lg shadow-md font-medium text-sm transition duration-300"
  onClick={()=>setStep(2)}
  >
    <h1>Edit Profile</h1>
  </div>

  <div className="bg-blue-600 px-6 py-3 rounded-lg cursor-pointer text-pretty font-k2d text-white hover:bg-blue-500 hover:shadow-lg shadow-md font-medium text-sm transition duration-300">
    <h1>View Analytics</h1>
  </div>

  <div className="bg-blue-600 px-6 py-3 rounded-lg cursor-pointer text-pretty font-k2d text-white hover:bg-blue-500 hover:shadow-lg shadow-md font-medium text-sm transition duration-300"
  onClick={()=>setStep(5)}
  >
    View CitizenShip
  </div>
</div>



        {/* Additional Sections */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className=' flex justify-between '>
            <h3 className="text-xl font-semibold text-gray-800">About</h3>
            <CiEdit size={30} className=' mr-6 cursor-pointer' onClick={()=>setOpen((s)=>!s)}/>
              </div>
          
          {
            open ===false ?(
              <>
               <p className="text-gray-600 mt-4">
              {authUser?.about || "Add information about yourself here. Let others know more about you!"}
             
            </p>
              </>
            ):(
              <>
              <textarea className=' w-full h-48 border-2 border-black' value={about} onChange={(e)=>setAbout(e.target.value)}></textarea>
              <div className=' flex justify-between'>
              <button className=' bg-gray-700 px-5 py-2 rounded-2xl text-white' onClick={()=>setOpen(false)}>Cancel</button>
              <button className=' bg-rose-700 px-5 py-2 rounded-2xl text-white' onClick={handleAbout}>Save</button>
              </div>
             
              </>
            )
          }
           
          </div>

          {/* Account Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800">Account Information</h3>
            <div className="mt-4">
              <p className=' text-gray-600'>
                  <span className=' text-gray-800 font-medium'> Full Name: </span>
                   {authUser?.firstName} {authUser?.middleName} {authUser?.lastName}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-800">Email: </span>
                {authUser?.email || 'user@example.com'}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-800">Role: </span>
                {authUser?.role || 'User'}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-800">Phone Number:  </span>
                {authUser?.phone|| 'N/A'}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-800">Address: </span>
                {authUser?.address.street || 'N/A'}, {authUser?.address.city}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-800">Joined: </span>
                {authUser?.createdAt || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        </>
       )}

{
  step === 2 && (
    <>
   <div>

   

   
    <EditProfile step={step} setStep={setStep}/>
   </div>
    </>
  )
}

{
  step === 3 && (
    <>
      <div className="mt-5 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex items-center mb-6">
          <IoMdArrowBack
            size={30}
            className="cursor-pointer hover:text-blue-500 transition duration-200"
            onClick={() => setStep(1)}
          />
          <h1 className="font-k2d ml-6 font-medium text-2xl text-gray-800">
            Account Information
          </h1>
        </div>

        <div className="space-y-4">
          <div className="flex  items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">First Name:</span>
            <span className="font-k2d text-gray-800 ml-44 text-xl">{authUser.firstName}</span>
          </div>



          <div className="flex  items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">Middle Name:</span>
            <span className="font-k2d text-gray-800 ml-40 text-xl">{authUser.middleName}</span>
          </div>
          <div className="flex  items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">Last Name:</span>
            <span className="font-k2d text-gray-800 ml-44 text-xl">{authUser.lastName}</span>
          </div>

          <div className="flex  items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">Email:</span>
            <span className="font-k2d text-gray-800 ml-52 text-xl">{authUser.email}</span>
          </div>

          <div className="flex  items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">Address:</span>
            <span className="font-k2d text-gray-800 ml-48 text-xl">
              {authUser.address?.street}, {authUser.address?.city}, {authUser.address?.country}
            </span>
          </div>

          <div className="flex  items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">Speciality: </span>
            <span className="font-k2d text-gray-800 ml-44 text-xl">{authUser.speciality}</span>
          </div>
        
          <div className="flex flex-col sm:flex-row items-start sm:items-center border-b pb-3">
  <span className="font-k2d text-gray-600 font-medium">Phone Number:</span>
  <div className="ml-0 sm:ml-10 mt-2 sm:mt-0">
    {authUser?.phone?.length > 0 ? (
      authUser.phone.map((data, index) => (
        <div key={index} className="font-k2d text-gray-800 text-xl ml-28">
          {data}
        </div>
      ))
    ) : (
      <span className="text-gray-500 italic">No phone numbers available</span>
    )}
  </div>
</div>

<div className="flex  items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">Verified: </span>
            <span className="font-k2d text-gray-800 ml-44 text-xl"><TiTick className=' text-green-600 ml-10'/></span>
          </div>

          
        </div>
      </div>
    </>
  )


}



{
  step ===5 &&(
    <>
    <div>
    <div className=' flex mt-5'>
      <IoMdArrowBack size={30} 
       className="cursor-pointer hover:text-blue-500 transition duration-200"
      onClick={()=>setStep(1)}/>
      <h1 className=' font-k2d ml-6 font-medium text-xl'>Documents</h1>
    </div>

    <div className='shadow-lg'>
      <div>
<h1>CitizenShip Front</h1>
        <img src={authUser?.citizenF}  className="w-1/2  h-72 object-cover rounded-lg shadow-md"></img>
      </div>
      <div>
<h1>CitizenShip Back</h1>
        <img src={authUser?.citizenB}  className="w-1/2  h-72 object-cover rounded-lg shadow-md"></img>
      </div>


    </div>
    </div>
    </>
  )
}
      </div>
    </div>
  );
};



export default ProfileService;
