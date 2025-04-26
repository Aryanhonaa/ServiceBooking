import React, { useState } from "react";
import userStore from "../store/UserStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddressSelector from "./AddressSelector";


const SignupUser = () => {
  const[step,setStep]=useState(1);
  const [name, setName] = useState("");
  const [middleName,setMiddlename]=useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [address,setAddress]=useState({street:"", city:"",country:"",lat:"",lng:""});
  const { signUp, emailCode , codeSent, verifyCode} = userStore();

  const [verificationCode, setVerification]=useState("");
  const navigate = useNavigate();

  const[loading,setLoading]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    
    try {
      const data = { name,middleName,lastName, email, password, phone, gender, address};
      signUp(data, navigate);
     
    } catch (err) {
      console.log(err);
     
    }
  };

  const handleNext2=()=>{
    // if(!name || !email || password || confirmPassword || !phone){
    //   toast.error("Please enter all the credentials", { autoClose: 2000 });
    //   return;
    // }
    if ( !phone|| !password || !confirmPassword  ) {
      toast.error("Please enter all the credentials", { autoClose: 2000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 2000 });
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters", { autoClose: 2000 });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be 10 digits", { autoClose: 2000 });
      return;
    }

    setStep(4);
  }

  const handleNext3=()=>{
    try{
      if(!name || !lastName || !gender || gender =="Select Gender"){
        toast.error("Please select all the credentials", { autoClose: 2000 });
        return ;
      }
      setStep(5);
    }catch(err){
      console.log(err);
    }
  }
 

  const handleEmail= async(email)=>{
    try{
      if(!email){
        toast.error("Please enter your email", { autoClose: 2000 });
        return ;
      }

      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!regex.test(email)) {
        toast.error("Invalid email", { autoClose: 2000 });
        return ;
        };


        try{
          setLoading(true);
          const res= await emailCode(email);
    
          if(res?.success){
             setStep(2);
          }
       
        }catch(err){
          console.log(err);
        }finally{
          setLoading(false);
        }
   

    
    }catch(err){
      console.log(err);
    }
  }

  const handleVerify= async(email,verificationCode)=>{
    try{
      if(!verificationCode){
        toast.error("Please enter your verification code", { autoClose: 2000 });
      }

      const res= await verifyCode(email,verificationCode);
    
      if (res?.success) {
        setEmail(res.email)
        setStep(3); // Move to the next step
      } 
    }catch(err){
        console.log(err);
      }
  }


  return (
  
    <div>
      <form onSubmit={handleSubmit}  >

      <div className=' mt-6 '>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>

      {
        step===1 &&(
          <>
          {/* Email */}
<div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">Email:</label>
  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email"  className="mt-1 p-2 border border-gray-300 rounded-md"  />
</div>
          
<button type="button" onClick={()=>handleEmail(email)}
   className={`bg-blue-600 text-white py-2 px-4 text-sm rounded-md mt-3 ${!email ? 'opacity-50 cursor-not-allowed' : ''}`}
  > {loading ? "Loading....":"Next"}</button>
 
          
          </>
        )
      }


{step === 2 && (
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
    onClick={()=>handleVerify(email,verificationCode)}
   >
      Verify
    </button>
    <p className="mt-2 text-gray-500 text-sm">
      Didn’t receive a code?{" "}
      <button className="text-blue-600 hover:underline" onClick={()=>setStep(1)}>Resend</button>
    </p>
  </div>
)}


      
        {step ===3 && (
        <>
        



{/* Password */}
<div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">Password:</label>
  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>

{/* Confirm Password */}
<div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">Confirm Password:</label>
  <input type="password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>

{/* Phone */}
<div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">Phone Number:</label>
  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone Number"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>



<button type="button" onClick={handleNext2} className={`bg-blue-600 text-white py-2 px-4 text-sm rounded-md mt-3 ${!password ||!confirmPassword || !phone ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
     </> )}
<div >
 


{step ===4 &&(
  <>

   {/* Name */}
   <div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">First Name:</label>
  <input type="text" value={name} onChange={(e) =>{
     const value= e.target.value
     
     setName(value ?value.charAt(0).toUpperCase()+value.slice(1): "")
  }
   } placeholder="Enter FirstName"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>

{/* MiddleName */}
  <div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">Middle Name:</label>
  <input type="text" value={middleName} onChange={(e) =>{
     const value= e.target.value
     
     setMiddlename(value ?value.charAt(0).toUpperCase()+value.slice(1): "")
  }
   } placeholder="Enter Middle Name"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>

{/* LastName */}
  <div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">Last Name:</label>
  <input type="text" value={lastName} onChange={(e) =>{
     const value= e.target.value
     
     setLastName(value ?value.charAt(0).toUpperCase()+value.slice(1): "")
  }
   } placeholder="Enter LastName"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>

 {/* Gender */}
 <div>
  <label className="text-gray-700 font-semibold">Gender:</label>
  <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md">
    <option value="" disabled>Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>

<div className="flex justify-between mt-7 text-white ">
<button onClick={()=>setStep(3)} type="button" className='bg-gray-600 text-white py-2 px-4 text-sm rounded-md mt-3 '> Back</button>
<button onClick={handleNext3} type="button" className={`bg-blue-600 text-white py-2 px-4 text-sm rounded-md mt-3 ${!name  || !lastName || !gender ? 'opacity-50 cursor-not-allowed' : ''}`}> Next</button>
</div>


  </>
)}
 
 {step === 5 && (
  <>
    {/* Address */}
    <h1 className="text-lg font-semibold text-gray-800 mt-4">Address:</h1>
    <input
      type="text"
      value={address.street}
      onChange={(e) => setAddress({ ...address, street: e.target.value })}
      placeholder="Enter Street"
      className="mt-2 p-2 border border-gray-300 rounded-md w-full max-w-xs" // Limited width and reduced margin
    />

    <AddressSelector
      onAddressSelect={(selectedAddress) => setAddress((prev) => ({ ...prev, ...selectedAddress }))}
    />

    
{/* Back Button */}
<button
  onClick={() => setStep(4)}
  type="button"
  className="bg-gray-600 text-white py-1.5 px-4 text-sm rounded-md mt-4 transition-all duration-200"
>
  Back
</button>
  </>
)}


{/* Submit Button */}
<button
  type="submit"
  className={`${
    step === 5
      ? "w-full mt-6 bg-indigo-500 text-white font-semibold py-2 rounded-lg transition hover:bg-indigo-600 shadow-md"
      : "hidden"
  }`}
  onClick={handleSubmit}
>
  Sign Up
</button>
</div>



        </div>
       
      </form>
    </div>
  );
};

export default SignupUser;
