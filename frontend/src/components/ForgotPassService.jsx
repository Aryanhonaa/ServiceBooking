import React from 'react'
import { useState } from 'react';
import userStore from '../store/UserStore';
import { toast } from 'react-toastify';
import serviceP from '../store/ServiceProviderStore';

const ForgotPassService = ({ setToggleForgot ,toggleForgot}) => {
    const [step, setStep]=useState(1);
    const [verificationCode, setVerificationCode]=useState("");
    const [password,setPassword]=useState("");
    const[confirm ,setConfirm]=useState("");
    const {forgotPass}=userStore();
    const [email ,setEmail]=useState("");
    const {sendCode, verifyCodePass, changePassword}=serviceP();
    const [load,setLoad]=useState(false);
    const handleContinue=async()=>{
        try{
          setLoad(true);
            const res= await sendCode(email);

            if(res?.success){
                setStep(2);
            }
        }catch(err){
            console.log(err);
        }finally{
          setLoad(false);
        }
    }

    const handleVerify=async ()=>{
        try{
            const res= await verifyCodePass(email, verificationCode);

            if(res?.success){
                setStep(3);
            }
        }catch(err){
            console.log(err);
        }    
    }

    const handlePassword=async()=>{
        try{
            if(!password || !confirm){
                toast.error("Please Fill All Credentials!!")
                return;
            }

            if(password !== confirm){
                toast.error("Passwords Do Not Match!!");
                return;
            }

            const res= await changePassword(email ,password);

            if(res.success){
               
                setToggleForgot(false);
            }

        }catch(err){
            console.log(err);
        }
    }

  return (
    <div>
       <div>
       {step==1 && (
      <>
      <h1 className=' text-center mt-4 font-k2d font-bold'>Forgot Password Verification!!</h1>
       {/* Email Input */}
    <div className="mt-4">
      <label htmlFor="email" className="text-gray-700 font-semibold">
        Email:
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter Email"
        className="w-full bg-transparent border-b-2 border-gray-400 outline-none text-gray-800 placeholder-gray-500 focus:border-yellow-500 transition-all p-1"
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div className="mt-4 flex justify-between items-center w-full gap-4">
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
    onClick={() => setToggleForgot((prev) => !prev)}
  >
    Back
  </button>

  <button
    className={`bg-blue-600 text-white py-2 px-4 text-sm rounded-md transition duration-300 hover:bg-blue-700 ${
      !email ? 'opacity-50 cursor-not-allowed hover:bg-blue-600' : ''
    }`}
    onClick={handleContinue}
    disabled={!email}
  >
    {load ? "Loading....":"Continue"}
    
  </button>
</div>
    
      </>
    )}


    {/* STEP 2 */}
    {step ===2 &&(
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
        onChange={(e) => setVerificationCode(e.target.value)}

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
    )}

    {
        step ===3 &&(
            <>
            
{/* Password */}
<div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">New Password:</label>
  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>

{/* Confirm Password */}
<div className=" flex-col flex">
  <label className="text-gray-700 font-semibold">Confirm New Password:</label>
  <input type="password" 
  value={confirm} 
  onChange={(e) => setConfirm(e.target.value)}
   placeholder="Confirm Password"  className="mt-1 p-2 border border-gray-300 rounded-md" />
</div>

<button   className={`bg-blue-600 text-white py-2 px-4 text-sm rounded-md mt-3 ${!password || !confirm ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handlePassword}>Continue</button>


            </>
        )
    }

    </div>
    </div>
  )
}

export default ForgotPassService
