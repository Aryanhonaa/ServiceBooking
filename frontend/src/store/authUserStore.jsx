import {create} from 'zustand';
import { axiosInstance } from '../config/axios';

const authUserStore=create((set)=>({
    signUp:async(data)=>{
        try{
            const res= await axiosInstance.post('/serviceprovider/addProv',data,{
                headers:{
                    "Content-Type":"multipart/form-data",
                },
            });
            console.log("Success",res.data);
        }catch(err){
            console.error(err);
        }
    }
}));

export default authUserStore;