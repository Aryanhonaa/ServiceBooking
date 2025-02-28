import {create} from 'zustand';
import { axiosInstance } from '../config/axios';
// import { getCategory } from '../../../backend/controllers/admin.controller';
import { toast } from 'react-toastify';
import userStore from './UserStore';


const serviceP=create((set=>({
    isLogin:true,
    toogleLogin:()=>set((state) => ({ isLogin: !state.isLogin })),
    categories:[],
    

    getCategory:async()=>{
        try{
            const res=await axiosInstance.get('admin/getCategory');
            set({categories:res.data.categories});

        }catch(err){
            console.log("Cannot Fetch Error!!",err);
        }
    },

    verifyEmail:async(email)=>{
        try{
            const res=await axiosInstance.post('/serviceprovider/verify-email',{email});
            toast.success("Verification Code Sent!!")

            return res.data;
        }catch(err){
            console.log("Cannot Fetch Error!!",err);
            toast.error(err.response?.data?.message || "Cannot send code!!");
        }
    },

    verifyCode:async(email,verificationCode)=>{
        try{
            const res= await axiosInstance.post('/serviceprovider/verify-code', {email, verificationCode})
            toast.success("Verification Success!!")

            return res.data;
        }catch(err){
           
            toast.error("Verification failed! Invalid code.");

        }
    },
    signUp:async(data)=>{
        try{
            console.log(data);
            const res= await axiosInstance.post('/serviceprovider/add-prov',data,{
                headers:{
                    "Content-Type":"multipart/form-data",
                },
            });
           
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                // Show error message from the backend
                toast.error(err.response.data.message);
                console.error("Backend Error:", err.response.data.message);
              } else {
                // Generic error if no response from backend
                toast.error("Something went wrong! Please try again.");
                console.error("Error:", err.message);
              }
            }
        },
     

     
        sendCode:async(email)=>{
            try{
            const res= await axiosInstance.post('/serviceprovider/forgot-password',{email});
            toast.success(res.data.message || "Verification Code Sent");
            return res.data;
            
            }catch(err){
                console.log("Error!!",err);
                toast.error(err.response?.data?.message|| "Verification failed!");

            }
        },


        updateProfile:async(data)=>{
            try{
                const res= await axiosInstance.patch('/serviceprovider/update-profile',data,{
                    headers:{'Content-Type':'multipart/form-data'},
                })

                if(res.data.success){
                    toast.success( "Profile Updated");
                }else{
                    toast.error( "Failed to update profile");
                }
            }catch(err){
                toast.error("An error occurred while updating the profile");
            }
        },

      
        
 changePassword:async(email,password)=>{
    try{
      const res=await axiosInstance.patch('/serviceprovider/change-password',{email,password});
  
      if(res.data.success){
        toast.success("Password Changed Successfully");
        return res.data;
      }else{
        toast.error("Error");
      }
  
  
    }catch(err){
      console.log(err);
    }
   },
 verifyCodePass:async(email,verificationCode)=>{
    try{
      console.log("email: ",email);
      console.log("verify", verificationCode);
      const res = await axiosInstance.post('/serviceprovider/verify-forgotCode', {
        email,
        verificationCode
      });
  
     console.log(res);
      if (res.data.success) {
        toast.success("Verification successful! Please reset your password.");
        return res.data;
      } else {
        toast.error("Verification failed! Invalid code.");
      }
  
      
    }catch(err){
      toast.error("Verification failed!");
      console.log(err);
    }
  },
    })))


export default serviceP;