import {create} from 'zustand';
import { axiosInstance } from '../config/axios';
// import { getCategory } from '../../../backend/controllers/admin.controller';
import { toast } from 'react-toastify';
import userStore from './UserStore';


const serviceP=create((set=>({
    isLogin:true,
    toogleLogin:()=>set((state) => ({ isLogin: !state.isLogin })),
    categories:[],
    darkMode:false,
    isDarkMode:()=>set((state)=>({darkMode: !state.darkMode})),

    getCategory:async()=>{
        try{
            const res=await axiosInstance.get('admin/getCategory');
            set({categories:res.data.categories});
            return res.data.data;

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


  requestLength: null,
  pendingRequests: async(providerId)=>{
    try{
    const res= await axiosInstance.get(`serviceprovider/get-appointments?providerId=${providerId}`);

    if(res.data.success){
      set({requestLength:res.data.data.length})
      return res.data;
    }else {
      toast.error("Failed to fetch pending requests!");
      return { success: false, data: [] }; // Ensure a return value
    }
    }catch(err){
      console.log(err);
      toast.error("Cannot Fetch Pending Requests!!")
    }
  },

  getUserData:async(name,id)=>{
    try{
      const res= await axiosInstance.get(`serviceprovider/get-user-data?nameId=${name}&id=${id}`);
      console.log("res",res.data);
      if(res.data.success){
        return res;
      }else{
        toast.error("Failed to fetch user data!");
        return { success: false, data: [] }; 
      }

    }catch(err){
      console.log(err);
    }

  },

  getHistory:async(serviceProviderId, userId)=>{
    try{
      const res = await axiosInstance.get(`serviceprovider/get-history/${userId}/${serviceProviderId}`);
  

      if(res.data.success){
        return res.data;
      }
      
    }catch(err){
      console.log(err);
    }
  },

  getAccepted:async(serviceProviderId)=>{
    try{
      const res=await axiosInstance.get(`serviceprovider/get-accepted-appointment?serviceProvider=${serviceProviderId}`);

      if(res.data.success){
        return res.data;
      }
    }catch(err){
      console.log(err);
    }
  },
  getAcceptedDetails:async(id)=>{
    try{
      const res=await axiosInstance.get(`serviceprovider/get-accepted-appointment-details?appointmentId=${id}`);
      if(res.data.success){
        return res.data;
        }
    }catch(err){
      console.log(err);
    }
  },

  getCompletedAppoinments:async(id)=>{
    try{
      const res= await axiosInstance.get(`serviceprovider/get-completed-appointment?providerId=${id}`);
      if(res.data.success){
        return res.data;
      }
    }catch(err){
      console.log(err);
    }
  },
  historyAppointment:async(id)=>{
    try{
      const res= await axiosInstance.get(`serviceprovider/history-appointment?providerId=${id}`);
      if(res.data){
        console.log("RES",res.data)
        return res.data;
        }
    }catch(err){

    }
  },

  getReviews:async(id)=>{
    try{
      const res= await axiosInstance.get(`serviceprovider/get-reviews?serviceProvider=${id}`);
      console.log("AAAA",res);
      if(res.data.success){
        console.log("RES",res)
        return res.data;
      }

    }catch(err){
      console.log(err);
    }
  },
  sendCertifyData:async(data)=>{
    try{
      const res= await axiosInstance.post('serviceprovider/certify-serviceProvider',data);
      if(res.data.success){
        return res.data;
        }
    }catch(err){
       console.log(err);
    }
  },
  updatePrice:async(data)=>{
    try{
      const res= await axiosInstance.post('serviceprovider/update-price',data);

      if(res.data.success){
        toast.success("Price Updated Successfully!!");
        return res.data;
      }
    }catch(err){
      console.log(err);
    }
  }
    })))


export default serviceP;