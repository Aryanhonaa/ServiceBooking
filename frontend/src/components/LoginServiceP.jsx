import React from 'react'
import { useState } from 'react';
import userStore from '../store/UserStore';
import { toast } from 'react-toastify';
import ForgotPassService from './ForgotPassService';
import { useNavigate } from 'react-router-dom';

const LoginServiceP = () => {
   const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toggleForgot,setToggleForgot]=useState(false);
    const {loginOther}=userStore();
    const navigate = useNavigate();
    

    const handleSubmit=async (e)=>{
      e.preventDefault();
      try{
        if(!email || !password){
          return toast.error("Please Fill All Credentials")
        }
        const res= await loginOther(email,password , navigate);

        if(res.success){
          toast.success("Login Successfull");
        }
      }catch(err){
        console.log(err);
      }
    }
  return (
    <div>
    {!toggleForgot ? (
      <>
       <form onSubmit={handleSubmit} className=" p-8  w-80">
    <h1 className="text-center text-2xl font-bold text-gray-800 ml-10">Login</h1>

    {/* Email Input */}
    <div className="mt-7 ml-4">
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

    {/* Password Input */}
    <div className="mt-7 ml-4">
      <label htmlFor="password" className="text-gray-700 font-semibold">
        Password:
      </label>
      <input
        id="password"
        type="password"
        placeholder="Enter Password"
        className="w-full bg-transparent border-b-2 border-gray-400 outline-none text-gray-800 placeholder-gray-500 focus:border-yellow-500 transition-all p-1"
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full mt-6 bg-red-500 text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-red-600 active:scale-95 ml-4"
    >
      Sign In
    </button>
    <h3 className=" mt-3 text-xs underline text-red-500 font-k2d flex justify-end hover:text-black cursor-pointer"
    onClick={()=>setToggleForgot(prev =>!toggleForgot)}
    >
Forgot Password?
</h3>
    
  </form>
      </>
    ):(
      <>
     
      <ForgotPassService setToggleForgot={setToggleForgot} toggleForgot={toggleForgot}/>
      </>
    )}

     
    </div>
  )
}

export default LoginServiceP
