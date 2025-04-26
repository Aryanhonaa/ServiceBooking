import {create} from 'zustand';
import { axiosInstance } from '../config/axios';
import { toast } from 'react-toastify';

const authUserStore=create((set)=>({
    



    addCategory:async(data)=>{
        try{
            const res=await axiosInstance.post('/admin/addCategory',data,{
                headers:{
                    "Content-Type":"multipart/form-data",
                },
            });
            console.log("success",res.data);
        }catch(err){
            toast.error(err.respnse?.data?.message || " Error in adding Category");
            console.error(err);
        }
    },

    getTemp:async()=>{
        try{
            const data= await axiosInstance.get('/admin/get-temp-prov');
            
            if(data){
                return data.data;
            }
        }catch(err){
            console.error(err);
        }
    },

    addSpeciality:async(id,form)=>{
        try{  
            const res= await axiosInstance.post(`/admin/add-specialty/${id}`,form,{
                headers:{
                    "Content-Type":"multipart/form-data",
                }
            })
            return res.data;
        }catch(err){
            console.error(err);
        }
    },
    topCategory:async(data)=>{
        try{
            const res= await axiosInstance.post('/admin/top-category',data,{
                headers:{"Content-Type":"multipart/form-data"}
            });

            if(res.data.success){
                toast.success("Success Adding Top Category!!")
            }

        }catch(err){
            console.error(err);
            toast.error("Error In Server!!!")
        }
    },

    getUsers:async()=>{
        try{
            const res= await axiosInstance.get('/admin/get-users');
            return res.data;
        }catch(err){
            console.error(err);
        }
    },
    
    getProviders:async()=>{

        try{
            const res= await axiosInstance.get('/admin/get-serviceProvider');
            return res.data;
        }catch(err){
            console.error(err);
        }
    },
    getCategory:async()=>{
        try{
            const res= await axiosInstance.get('/admin/get-category');

            if(res.data.success){
                return res.data;
            }
        }catch(err){
            console.error(err);
        }
    },
    deleteUser:async(id)=>{
        try{
            const res= await axiosInstance.delete(`/admin/delete-user?id=${id}`);
            
            if(res.data.success){
                toast.success("User deleted successfully!");
            }
        }catch(err){
            console.error(err);
            toast.error("Failed To Delete User");
        }
    },
    deleteServiceProvider:async(id)=>{
        try{
            const res= await axiosInstance.delete(`/admin/delete-serviceProvider?id=${id}`);
            
            if(res.data.success){
                toast.success("User deleted successfully!");
            }
        }catch(err){
            console.error(err);
            toast.error("Failed To Delete User");
        }
    },

    getServiceProviderDetail:async(id)=>{

        try{
            const res= await axiosInstance.get(`/admin/get-detail-service-provider?id=${id}`)

            if(res.data.success){
                return res.data;
            }
        }catch(err){
            console.error(err);
        }
    },
    
    getSpecialites: async (categoryName) => {
        try {
          const encodedCategory = encodeURIComponent(categoryName.trim()); // trim just in case
          const res = await axiosInstance.get(`/admin/specialities/${encodedCategory}`); 
      
          if (res.data.success) {
            console.log("FETCHED",res.data)
            return res.data;
          } else {
            console.warn("API call succeeded, but response wasn't successful.");
          }
        } catch (err) {
          console.error("Error fetching specialities:", err);
        }
      },

      removeSpeciality:async(data)=>{

        try{
            console.log("DARAAA",data);
            const res= await axiosInstance.delete(`/admin/remove-speciality/${data.categoryId}/${data.specialtyId}` );
            if (res.data.success) {
                toast.success("Speciality removed successfully!");
            } else{
                toast.error("Failed to remove speciality.");
            }

        }catch(err){
            console.error("Error removing speciality:", err);
        }
      }
      
 

    
}));

export default authUserStore;