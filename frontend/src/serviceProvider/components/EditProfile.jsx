import React, { useState } from 'react';
import userStore from '../../store/UserStore';
import { CiEdit } from "react-icons/ci";
import AddressSelectService from './AddressSelectService';
import { IoMdArrowBack } from "react-icons/io";
import { toast } from 'react-toastify';
import serviceP from '../../store/ServiceProviderStore';

const EditProfile = ({step, setStep}) => {
  const { authUser } = userStore();
  const [image, setImage] = useState(authUser?.image || null);
  const [phoneNumbers, setPhoneNumbers] = useState(authUser?.phone || []);
  const [address,setAddress]=useState({street:authUser?.address.street, city:authUser?.address.city , country:authUser?.address.country, lat: authUser?.address.lat, lng:authUser?.address.lng});
  const [changeImg, setChangeImg] = useState(false);
  const[map,setMap]=useState(false);
  const[ dialog, setDialog]=useState(false);
  const{updateProfile}=serviceP();

  // Function to add a new phone number
  const addPhoneNumber = () => {
    if (phoneNumbers.length < 3) {
      setPhoneNumbers([...phoneNumbers, ""]);
    }
  };

  const updatePhoneNumber = (index, value) => {
    // Remove any non-digit characters
    const cleanedValue = value.replace(/\D/g, '');
  
    // Ensure the phone number starts with '9' and has exactly 10 digits
    if (cleanedValue.length === 0) {
      return; // Do nothing if the input is empty
    }
  
    // Check if the first character is '9' and the length is 10 digits
    if (cleanedValue[0] !== '9') {
      toast.error('Phone number must start with 9');  // Show error if it doesn't start with 9
      return;
    }
    
    if (cleanedValue.length > 10) {
      toast.error('Phone number must be 10 digits long');  // Show error if the length exceeds 10
      return;
    }
  
    const updatedPhones = [...phoneNumbers];
    updatedPhones[index] = cleanedValue;
    setPhoneNumbers(updatedPhones);
  };

  
  
  const handleSubmit= async()=>{
    try{
   
      const form= new FormData();

      form.append('image',image);
      form.append('phone', JSON.stringify(phoneNumbers)); // Send phone numbers as string array
      form.append('address',JSON.stringify(address)); 
      await updateProfile(form);
    }catch(err){
      console.log(err);
      
    }
  }

  // const dp=image?URL.createObjectURL(image):null;
  console.log(phoneNumbers);
  console.log(address);

  const removePhoneNumber = (index) => {
    const updatedPhones = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhones);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className=' flex justify-between'> 
      <div className=' flex mt-5'>
      <IoMdArrowBack size={30} 
       className="cursor-pointer hover:text-blue-500 transition duration-200"
      onClick={()=>setStep(1)}/>
      <h1 className=' font-k2d ml-6 font-medium text-xl'>Edit Account Information</h1>
    </div>
      </div>
     
      <form className="mt-10 space-y-6">
        {/* Display Picture */}
        <div className="space-y-4">
          <div className="flex items-center border-b pb-3">
            <span className="font-k2d text-gray-600 font-medium">Display Picture:</span>
            <div className="flex ml-10 items-center">
              <img
                src={image}
                alt="Display Picture"
                className="w-44 h-44 rounded-full object-cover ml-6 shadow-lg"
              />
              {changeImg && (
                <input
                  type="file"
                  onChange={(e) => setImage((e.target.files[0]))}
                  className="ml-6 mt-4 cursor-pointer"
                />
              )}
              <CiEdit
                size={25}
                className="ml-6 mt-10 cursor-pointer hover:text-blue-500"
                onClick={() => setChangeImg((s) => !s)}
              />
            </div>
          </div>
        </div>
{/* Phone Numbers Section */}
<div className="flex flex-col items-start border-b pb-3">
  <span className="font-k2d text-gray-600 font-medium">Phone Numbers:</span>
  <div className="ml-0 sm:ml-10 mt-2 sm:mt-0 space-y-2">
    {phoneNumbers.map((phone, index) => (
      <div key={index} className="flex items-center space-x-2">
        <input
          type="text"
          value={phone}
          onChange={(e) => updatePhoneNumber(index, e.target.value)}
          className="border rounded-lg p-2 w-60"
          placeholder={`Phone Number ${index + 1}`}
        />
        {phoneNumbers.length > 1 && (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700"
            onClick={() => removePhoneNumber(index)}
          >
            Remove
          </button>
        )}
      </div>
    ))}

    {/* Add Phone Number Button */}
    {phoneNumbers.length < 3 && (
      <button
        type="button"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={addPhoneNumber}
      >
        Add Phone Number
      </button>
    )}
  </div>
</div>



        <div>

          <div className=' flex' >
          <h1> Address:  {address.street}, {address.city}, {address.country} </h1>
        <CiEdit
                        size={25}
                        className="ml-6 cursor-pointer hover:text-blue-500"
                        onClick={()=>setMap((s)=>!s)}
                        
                      />
          </div>
     
          <div>

            
           {map && (
            <>
              <AddressSelectService
         onAddressSelect={(newAddress) => {
    console.log("Address selected in parent:", newAddress) // Debugging
    setAddress(newAddress);
  }}
  
/>
            </>
           )}
          
{console.log(address)}


          </div>
        </div>
      
          

      </form>

      <button className='px-3 py-3 bg-red-600 rounded-xl text-white hover:bg-red-900 transition-colors duration-300 mt-5 mx-auto'
       type='reset'
       onClick={()=>setDialog(true)}
        >
  Submit
</button>

      {dialog && (
  <>
    <div className="bg-slate-500 px-8 py-8 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <h1 className="text-white text-xl mb-4">Are You Sure?</h1>
      <div className="flex space-x-4 justify-center">
        <button className="bg-green-500 px-6 py-2 rounded-lg text-white hover:bg-green-600 transition duration-200"
        onClick={handleSubmit}
        >
          Yes
        </button>
        <button className="bg-red-600 px-6 py-2 rounded-lg text-white hover:bg-red-700 transition duration-200"
        onClick={()=>setDialog(false)}
        >
          No
        </button>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default EditProfile;
