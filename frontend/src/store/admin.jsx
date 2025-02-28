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
    }

    
    
 

    
}));

export default authUserStore;