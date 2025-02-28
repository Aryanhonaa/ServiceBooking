import React, { useEffect, useState } from 'react';

import serviceP from '../store/ServiceProviderStore';
import { axiosInstance } from '../config/axios';
import {toast} from 'react-toastify';
import AddressSelector from './AddressSelector';
import axios from 'axios';

const SignUpForm = () => {
  
  const { categories, getCategory,signUp, verifyEmail , verifyCode} = serviceP();

  const [loading, setLoading]=useState(false);
  const [step, setStep] = useState(1);
  
  // Step 1: Verify Email
  const [email, setEmail] = useState('');

  //Step 2 : Verify Code
  const [verificationCode, setVerification]=useState("");

  //Step 3 :Category Selection
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');


  const[c, setC]=useState('');

  // Step 4: Speciality & Experience
  const [speciality, setSpeciality] = useState('');
  const [experience, setExperience] = useState('');
  const [filteredSpecialities, setFilteredSpecialities] = useState([]);

  // Step 3: Personal Details & Images
  
  
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [fees, setFees] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', country: '' ,lat:"", lng:""});
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [firstName,setFirstName]=useState("");
  const [middleName,setMiddlename]=useState("");
  const [lastName,setLastName]=useState("");
const[confirm, setConfirm]=useState("");
  // Fetch Categories and Specialities
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategory(categories);
    }
  }, [categories]);

  console.log(categories);
  // Fetch Specialities when a category is selected
  // const handleCategoryChange = async (e) => {
  //   const selected = e.target.value;
  //   setSelectedCategory(selected);

  //   // Find selected category and fetch its specialities
  //   const selectedCat = category.find(cat => cat.name === selected);
  //   if (selectedCat && selectedCat._id) {
  //     try {
  //       const { data } = await axiosInstance.get(`admin/specialities/${selectedCat.name}`);
  //       setFilteredSpecialities(data);
  //     } catch (err) {
  //       console.error("Error fetching specialities:", err);
  //     }
  //   }
  // };
  const handleChange = async (name) => {
    try {
      setSelectedCategory(name); // Update state, but remember it's async!
  
      // Fetch specialities directly using the `name` parameter
      const { data } = await axiosInstance.get(`admin/specialities/${name}`);
      setFilteredSpecialities(data);

      setStep(4)
  
      console.log("Selected Category:", name); // Debugging
      console.log("Fetched Specialities:", data); // Debugging
  
    } catch (err) {
      console.error("Error fetching specialities:", err);
    }
  };
  
  console.log("Name",c);
  console.log("Filter",filteredSpecialities)

  // Handle Image Selection
  const handleImageChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  

  // Handle Form Submission
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('middleName', middleName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('speciality', speciality);
    formData.append('experience', experience);
    formData.append('phone', phone);
    formData.append('about', about);
    formData.append('fees', fees);
    formData.append('category',selectedCategory);
    formData.append('address', JSON.stringify(address)); // Send the address as an object
    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('image3', image3);

    signUp(formData);
    setStep(8);
  };

  const handleNext1 =()=>{
    if(!selectedCategory || selectedCategory =="Select a Category"){
      toast.error('Please select category to proceed!!',{
        autoClose:500,
        position:'top-center',
      });
      return;
    }

    setStep(4);
  };

  const handleNext2=()=>{
    if(!speciality || !experience){
      toast.error("Please Enter All Credentials",{
        autoClose:500,
        position:"top-center"
      });
      return;
    }
    setStep(5);
  };


  const handleNext3=()=>{
    if(!firstName ||!lastName  || ! password || ! confirm ||!phone || !image1){
      toast.error("Please Provide All Credentials",{
        autoClose:500,
        position:"top-center"
      })
    return ;
    }

    if(password.length <=6){
      toast.error('Password must be more than 6 characters', {
        autoClose: 500,
        position: 'top-center',
        });
        return;
    }

    if (password !== confirm) {
      toast.error('Passwords do not match!', {
        autoClose: 500,
        position: 'top-center',
      });
    return;
    }

    const phoneRegex = /^[0-9]{10}$/; 

  if (!phoneRegex.test(phone)) {
    toast.error('Please enter a valid 10-digit phone number.', {
      autoClose: 5000,
      position: 'top-center',
    });
    return;
  }

  

    setStep(6);
    };
  
  

   
    const handleNext4=()=>{
      if(!fees || !address){
        toast.error("Please Provide All Credentials",{
          autoClose:500,
          position:"top-center"
          })
          return ;
      }
      
      setStep(7);
    }
    const handleEmail=async()=>{
      try{
        setLoading(true);
        const res= await verifyEmail(email);
        if(res.success){
          setStep(2);
          setLoading(false);
        }
      }catch(err){
        console.log(err);
      }finally{
        setLoading(false);
      }

    }

    const handleVerify=async()=>{
      try{
        const res= await verifyCode(email,verificationCode);

        if(res.success){
          setStep(3);
        }
      }catch(err){
        console.log(err);
      }
    } 
    console.log("S",speciality)

    const imagePreview= image1 ? URL.createObjectURL(image1) :null;
    const citizenFront=image2 ? URL.createObjectURL(image2):null;
    const citizenBack=image3 ? URL.createObjectURL(image3):null;
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

    {step ===1 && (
      <>
      <h1 className=' text-center mt-5 font-k2d'>Create New Service Provider Account!!</h1>
      <h2 className=' font-bold mt-6'>Step: Email Address</h2>
       <div className="flex flex-col">
      <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" className="mt-1 p-2 border border-gray-300 rounded-md"/>
      </div>
      <button type="button" 
   className={`bg-blue-600 text-white py-2 px-4 text-sm rounded-md mt-3 ${!email ? 'opacity-50 cursor-not-allowed' : ''} ${loading ? 'opacity-50 cursor-not-allowed':""}`}
   onClick={handleEmail}
  >{loading ? "Loading..." : "Next"}</button>
  
      <br/>
      </>
       
       
    )}

    {
      step ===2 &&(
        <>
        <div className="flex flex-col items-center mt-6">
    <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
    <p className="text-gray-600 mt-2 text-center">
      We’ve sent a verification code to your email. Please enter it below.
    </p>
    <div className="mt-4 w-full max-w-sm">
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerification(e.target.value)}

        placeholder="Enter the verification code"
        className="w-full px-4 py-2 text-lg border rounded-lg text-center tracking-widest border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <button
      type="button"
      className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
    onClick={handleVerify}
   >
      Verify
    </button>
    <p className="mt-2 text-gray-500 text-sm">
      Didn’t receive a code?{" "}
      <button className="text-blue-600 hover:underline" onClick={()=>setStep(1)}>Resend</button>
    </p>
  </div>
        </>
      )
    }

   {step === 3 && (
        <>
          <h2 className=' font-bold mt-6'>Step 1: Select Category</h2>
          <div className='flex flex-col mt-5'>
         
          {/* <select value={selectedCategory} onChange={handleCategoryChange}  className="mt-1 p-2 border border-gray-300 rounded-md">
            <option value=""  className="mt-1 p-2 border border-gray-300 rounded-md">Select a Category</option>
            {category.map((cat, index) => (
              <option key={index} value={cat.name}>{cat.name}</option>
            ))}
          </select> */}

        
<ul>

{category.map((cat) => (
  <div
    key={cat.name}
    className={`cursor-pointer flex items-center gap-4 border-2 p-4 rounded-lg transition-all m-2
    ${
      selectedCategory === cat.name
        ? "border-blue-500 bg-blue-100 shadow-lg"
        : "border-gray-300 bg-white hover:bg-gray-100"
    }`}
    onClick={() => handleChange(cat.name)}
  >
    <img
      src={cat.img}
      alt={cat.name}
      className="w-20 h-20 object-cover rounded-md border"
    />
    <li className="text-lg font-semibold">{cat.name}</li>
  </div>
))}
</ul>
           
          </div>
         
          <br />
          
         
  <button 
    type="button" 
    onClick={handleNext1} 
    
    className={`bg-blue-600 text-white py-1 px-3 rounded-md ${!selectedCategory || selectedCategory =="Select a Category" ? 'opacity-50  cursor-not-allowed':""}`}
  >
    Next
  </button>  
  

         
        </>
      )}

      {step === 4 && (
        <>
          <h2 className=' font-bold mt-6'> Step 2: Speciality & Experience</h2>
          
          <div className=' mt-6 flex flex-col'>
            <h2 className=' font-semibold'>Category:<span className=' underline ml-6'>{selectedCategory}</span></h2>
          <label className='font-k2d font-semibold'>Select Speciality</label>
         
          </div>
    
    <ul>
      {filteredSpecialities.map((fil,index)=>
        (
        <div key={index} onClick={()=>setSpeciality(fil.specialityName)} className={`flex border-2 transition-all cursor-pointer gap-4 m-3 rounded-lg  border-black
        ${
          speciality === fil.specialityName
          ?" bg-blue-200 border-blue-500  border-r-4":"bg-gray-300 "
        }
        `}>
          <img src={fil.img} className=' w-24 h-24 p-1 object-cover rounded-md '></img>
          <li className=' font-semibold items-center flex'>{fil.specialityName}</li>
          
        </div>)
      )}
    </ul>
    <h1>Selected Speciality: <span className=' underline text-red-500 font-semibold'>{speciality}</span></h1>
          <br />

          <div className='flex flex-col'>
          <label>Experience:</label>
          <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Enter Experience (in year)" className='mt-1 p-2 border border-gray-300 rounded-md' />
          </div>
         
          <br />
          <div className=' flex justify-between mt-7 text-white '>
          <button type="button" onClick={() => setStep(3)} className=' cursor-pointer  bg-gray-500  py-1 px-3 rounded-md '>Back</button>
          <button type="button" onClick={handleNext2}   className={`bg-blue-600 text-white py-1 px-3 rounded-md ${!speciality || !experience? 'opacity-50 cursor-not-allowed' : ''}`}
          >Next</button>
          </div>
          
        </>
      )}

      {step === 5 && (
        <>
        
          <h2 className=' font-bold mt-6'>Step 3: Personal Details & Images</h2>
          
         
    <div className="flex flex-col mt-4">
      <label>First Name:</label>
      <input 
        type="text" 
        value={firstName} 
        onChange={(e) => {
          const value = e.target.value;
          setFirstName(value.charAt(0).toUpperCase() + value.slice(1));
        }} 
        placeholder="First Name" 
        className="mt-1 p-2 border border-gray-300 rounded-md"
      />
    </div>  
    <br/>
    <div className="flex flex-col">
      <label>Middle Name:</label>
      <input 
        type="text" 
        value={middleName} 
        onChange={(e) => {
          const value = e.target.value;
          setMiddlename(value ? value.charAt(0).toUpperCase() + value.slice(1) : "");
        }} 
        placeholder="Enter Middle Name" 
        className="mt-1 p-2 border border-gray-300 rounded-md"
      />
    </div>
    <br/>
    <div className="flex flex-col">
      <label>Last Name:</label>
      <input 
        type="text" 
        value={lastName} 
        onChange={(e) => {
          const value = e.target.value;
          setLastName(value ? value.charAt(0).toUpperCase() + value.slice(1) : "");
        }} 
        placeholder="Enter Last Name" 
        className="mt-1 p-2 border border-gray-300 rounded-md"
      />
      <br/>
     

      <div className="flex flex-col">
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className="mt-1 p-2 border border-gray-300 rounded-md" />
      </div>
      <br />

      <div className="flex flex-col">
      <label>Confirm Password:</label>
      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Enter Password" className="mt-1 p-2 border border-gray-300 rounded-md" />
      </div>
      <br />
      <div className="flex flex-col">
      <label>Phone Number:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone" className="mt-1 p-2 border border-gray-300 rounded-md"/>
      </div>
      <br />
      
      <div className='flex flex-col'>
        <label>Upload Profile Picture: </label>
      <input type="file" onChange={(e) => handleImageChange(e, setImage1)} />
      </div>

      <img src={imagePreview}></img>
    </div>

    
    <div className=' flex justify-between mt-7 text-white '>
    <button type="button" onClick={() => setStep(4)} className=' cursor-pointer  bg-gray-500  py-1 px-3 rounded-md '>Back</button>
    <button type="button" onClick={handleNext3}
     className={`bg-blue-600 text-white py-1 px-3 rounded-md ${!firstName ||!lastName  || ! password || ! confirm ||!phone || !image1 ? 'opacity-50 cursor-not-allowed' : ''}`}
    >Next</button>
    </div>
          
          
         
        
        </>
      )}

{step === 6 && (
  <>
    <h2 className="font-bold mt-6">Step 4: Fees & Address</h2>
    <div className="mt-5 flex flex-col space-y-4">
      <label>Fees:</label>
      <input
        type="text"
        value={fees}
        onChange={(e) => setFees(e.target.value)}
        placeholder="Enter Fees (in rupees)"
        className="mt-1 p-2 border border-gray-300 rounded-md"
      />
      <label>Address:</label>
      <input
        type="text"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        placeholder="Enter Street"
        className="mt-1 p-2 border border-gray-300 rounded-md"
      />
      <AddressSelector onAddressSelect={(selectedAddress) => setAddress(prev => ({ ...prev, ...selectedAddress }))} />
    </div>

    <div className="flex justify-between mt-7">
      <button
        onClick={() => setStep(5)}
        className="bg-gray-500 text-white py-1 px-3 rounded-md"
      >
        Back
      </button>
      <button
        onClick={handleNext4}
        
        className={`bg-blue-600 text-white py-1 px-3 rounded-md ${!fees || !address.street ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Next
      </button>
    </div>
  </>
)}


      {step === 7 && (
        <>
        <h1 className=' font-bold mt-6'>Step 5: Verification</h1>

        <div className=' mt-1 flex flex-col'>
        <label className='font-bold'>Upload CitizenShip(Nagrita) Photo:</label>
        <div className=' mt-4 flex-col'>
          <label>Front Side: </label>
        <input type="file" onChange={(e) => handleImageChange(e, setImage2)} />
        <img src={citizenFront}></img>
        </div>
       
       <div className=' mt-4 flex-col'>
        <labell>Back Side: </labell>
       <input type="file" onChange={(e) => handleImageChange(e, setImage3)} />
        <img src={citizenBack}></img>
        <button type="submit"   className="bg-blue-500 text-white py-1 px-3 rounded-md ml-16 mt-9">Submit</button>
       </div>
        
        </div>
       
        </>
      )}

{step === 8 && (
  <div className="flex flex-col items-center justify-center min-h-[60vh] rounded-xl shadow-lg p-8 text-center">
    <div className="animate-pulse">
      <svg
        className="w-16 h-16 text-red-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m9-3c0 7-5.373 12-12 12S0 18 0 11 5.373 0 12 0s12 5.373 12 12z"
        ></path>
      </svg>
    </div>

    <h1 className="text-2xl font-semibold text-gray-800 mt-4">
      Please Wait for Verification
    </h1>
    
    <p className="text-gray-600 mt-2">
      Your details are under review. Once verified, you'll be notified via email.
    </p>

    <div className="mt-4">
      <span className="inline-block w-6 h-6 rounded-full bg-blue-500 animate-ping"></span>
      <span className="inline-block w-6 h-6 rounded-full bg-blue-400 animate-pulse ml-2"></span>
      <span className="inline-block w-6 h-6 rounded-full bg-blue-300 animate-bounce ml-2"></span>
    </div>
  </div>
)}

    </form>
  );
};

export default SignUpForm;
