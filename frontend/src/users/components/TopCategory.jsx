import React from 'react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axios';
import { Link } from 'react-router-dom';

const TopCategory = () => {
      const[top,setTop]=useState([]);
      
        useEffect(()=>{
          
          const fetchTopCategory =async()=>{
            const res = await axiosInstance.get('/admin/get-topCategory');
      
            if(res.data.success){
              
              return setTop(res.data.data);
              
          }
          }
      
          fetchTopCategory();
      
        },[])

        console.log("Top",top)
  return (
    <div>
      
    <div className='mt-9 ml-8'>
  <div className='flex items-center justify-between'>
    
    <div className='flex items-center'>
      <div className="w-6 h-8 bg-[#F89912] rounded-lg"></div>
      <h1 className='font-k2d font-semibold ml-2 font-14px'>Top Category</h1>
    </div>

    
    <h1 className='text-black cursor-pointer mr-10  font-k2d hover:text-gray-600'>View All</h1>
  </div>
</div>


    <div className=' mt-4'>

      <ul className=' flex'>
        {top.map((data,index)=>(
            <Link to={`/service/providers/${encodeURIComponent(data.name)}`}>
              <div key={index} className=' px-0.5 py-0.5 m-1 cursor-pointer hover:bg-gray-100 rounded-fulls'>
            <div className=' border-black  text-center'>
            <img src={data.img} style={{width:500, height:100}} className='rounded-full '></img>
            <h1 className=' font-robotoCondensed '>{data.name}</h1>
            </div>
         
          </div>
            </Link>
        
          
        ))}
      </ul>
    </div>

    </div>
  )
}

export default TopCategory;
