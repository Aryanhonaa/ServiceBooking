import {create} from 'zustand';
import { axiosInstance } from '../config/axios';
import axios from 'axios';

const categoryStore=create((set)=>({
    categories:[],
    getCategory:async()=>{
        try{
            const response=await axiosInstance.get('/admin/getCategory');
            console.log(response.data.categories); 
            set({categories:response.data.categories});
        }catch(err){
            console.log(err);
        }
    }
}))



export default categoryStore;