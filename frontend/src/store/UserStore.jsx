import { create } from 'zustand';
import { axiosInstance } from '../config/axios';
import { toast } from 'react-toastify';

const userStore = create((set) => ({
  isLogin: true,
  toggleLogin: () => set((state) => ({ isLogin: !state.isLogin })),
  codeSent:false,

  authUser: JSON.parse(localStorage.getItem('authUser')) || null, 

  signUp: async (data, navigate) => {
    try {
      console.log('Sending data:', data); // Check data being sent
      const res = await axiosInstance.post('/users/addUser', data);
      console.log('Response:', res); // Check response from server
  
      if (res.data.success) {
        toast.success('SignUp Successful');
        set({ isLogin: false });
        console.log('Success:', res.data.success);
        console.log('Data:', data);
        // Redirect or handle success
        navigate('/auth'); // Change to the correct success route
      }
    } catch (err) {
      console.log('Error:', err); // Log full error for debugging
      if (err.response) {
        toast.error(err.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error or server not responding');
      }
    }
  },
  login: async (data, navigate) => {
    try {
      const res = await axiosInstance.post('/users/loginUser', data);
  
      // ✅ Update Zustand store with the authenticated user
      userStore.setState({ authUser: res.data.user });
  
      toast.success('Logged In', { autoClose: 500 });
  
      // ✅ Wait for state update, then navigate
      setTimeout(() => {
        navigate('/homepage/user');
      }, 1000); // Reduce timeout to 1s for faster transition
  
      console.log('Success', res.data.success);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      console.log(err);
    }
  },
  

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/admin/me');
      set({ authUser: res.data.user });
    } catch (err) {
      set({ authUser: null });
      console.log(err);
    }
  },

  loginOther:async(email,password,navigate)=>{
    try{
        const res= await axiosInstance.post('/admin/login',{email,password});
        
        userStore.setState({ authUser: res.data.user });

        toast.success('Logged In', { autoClose: 500 });
    
      
      if (res.data.user.role === "ServiceProvider") {
        
          navigate('/homepage/service-provider');
        
        
      } else if (res.data.user.role === "Admin") {
        navigate('/admin');
      } else {
        // Optional: Handle other roles or default case
        console.log();
      }
    
     
        return res.data;    

    }catch(err){
        toast.error("Something went wrong! Please try again.");
        console.log("Error!!",err);

    }
},

  logout: async (navigate) => {
    try {
      const res = await axiosInstance.post('/users/logout');

      if (res.status === 200) {
        set({ authUser: null });
        localStorage.removeItem('authUser');
      }
      navigate('/');
      toast.success('Logged Out Successfully', {
        position: 'top-right',
        autoClose: 1000,
      });
    } catch (err) {
      toast.error(err.response.data.message || 'Something went wrong');
      console.log(err);
    }
  },

  setAuthUser: async (user) => {
    set({ authUser: user });
    localStorage.setItem('authUser', JSON.stringify(user)); // Save user to localStorage
  },

  updateProfile:async(data)=>{
    try{
      const res=await axiosInstance.patch('/users/updateData',data,{
        headers:{
          "Content-Type":"multipart/form-data",
        }
      });
      console.log("Response:", res);
      set({authUser:res.data.user});
      toast.success('Profile Updated',{
        autoClose:1000
      });
    }catch(err){
      console.log(err);
      toast.error("Error",{
        autoClose:1000,
      })
    }
  },

  emailCode:async(email)=>{
    try{
  const res=await axiosInstance.post('/users/add-email',{email});
  toast.success("Code Sent!!")

  return res.data;
  
    }catch(err){
      console.log(err);
     
      toast.error(err.response?.data?.message || "Cannot send code!!");
    }

  },
  
  verifyCode:async(email,verificationCode)=>{
    try{
      const res=await axiosInstance.post('/users/verify-email',{email,verificationCode});
     console.log(res);
      if (res.data.success) {
        toast.success("Email Verified!!");
      } else {
        toast.error("Verification failed! Invalid code.");
      }

      return res.data;
    }catch(err){
      toast.error("Verification failed!");
      console.log(err);
    }
  },


  
 forgotPass:async(email)=>{
  try{
    const res=await axiosInstance.post('/users/forgot-password',{email})
    if(res.data.success){
      toast.success("Email Verification Code Sent");
      return res.data;
    }else{
      toast.error("Error");
    }

  }catch(err){
    toast.error(err.response?.data?.message|| "Verification failed!");
    console.log(err);
  }
 },
  
 
 verifyCodePass:async(email,verificationCode)=>{
  try{
    console.log("email: ",email);
    console.log("verify", verificationCode);
    const res = await axiosInstance.post('/users/verify-forgot', {
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
 changePassword:async(email,password)=>{
  try{
    const res=await axiosInstance.patch('/users/change-password',{email,password});

    if(res.data.success){
      toast.success("Password Changed Successfully");
      return res.data;
    }else{
      toast.error("Error");
    }


  }catch(err){
    console.log(err);
  }
 }
  
}));

export default userStore;
