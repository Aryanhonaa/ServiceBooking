import React from 'react'
import userStore from '../store/UserStore';
import { useState, useEffect } from "react";

import img1 from '../assets/slides/1.jpeg';
import img2 from '../assets/slides/2.jpg';
import img3 from '../assets/slides/3.jpg';
import img4 from '../assets/slides/4.jpg';
import { axiosInstance } from '../config/axios';


import categoryStore from '../store/categoryStore';
import HelpHome from './components/HelpHome';


const images = [
  img1,
  img2,
  img3,
  img4
];

const HomepageU = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const[top,setTop]=useState([]);
  const[category,setCategory]=useState([]);

  const{getCategory, categories}=categoryStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  useEffect(()=>{
    
    const fetchTopCategory =async()=>{
      const res = await axiosInstance.get('/admin/get-topCategory');

      if(res.data.success){
        
        return setTop(res.data.data);
        
    }
    }

    fetchTopCategory();

  },[])

  useEffect(()=>{
    getCategory();
  },[])

  useEffect(()=>{


    if(categories){
      setCategory(categories)
    }

  },[categories])
  
  
  console.log("data",category)
  const {authUser}=userStore();
  console.log(authUser);
  return (
    <>
    <div className=' bg-white'>

    <div className="relative w-full flex justify-center items-center">
      <div className="relative w-full ">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-[400px] object-cover rounded-lg transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 flex  bg-black bg-opacity-30 text-white text-center">
          <div className='  mt-40 ml-16'>
          <h1 className="text-2xl font-bold  font-k2d  ">
            Welcome {authUser?.name ? authUser.name : "Guest"}
          </h1>
          
          <h2>Book Your Service From Anywhere !!</h2>
          {/* <input className=" shadow-2xl shadow-white px-2 py-2 mt-2" placeholder=' Enter'></input> */}
          </div>
         
        </div>
      </div>
    </div>


  
    <div className='mt-9 ml-8'>
  <div className='flex items-center justify-between'>
    
    <div className='flex items-center'>
      <div className="w-6 h-8 bg-[#F89912] rounded-lg"></div>
      <h1 className='font-k2d font-semibold ml-2'>Top Category</h1>
    </div>

    
    <h1 className='text-black cursor-pointer mr-10  font-k2d hover:text-gray-600'>View All</h1>
  </div>
</div>


    <div className=' mt-4'>

      <ul className=' flex'>
        {top.map((data,index)=>(
          <div key={index} className=' bg-orange-200 px-0.5 py-0.5 m-1 cursor-pointer hover:bg-gray-100'>
            <div className=' border-black bg-yellow-400 text-center'>
            <img src={data.img} style={{width:500, height:100}}></img>
            <h1 className=' font-k2d '>{data.name}</h1>
            </div>
         
          </div>
          
        ))}
      </ul>
    </div>



      {/* Categories */}
    <div>
        <div className=' m-1 mt-2'>
        <ul>
          {category.slice(0,3).map((data)=>(
            <div key={data._id} className=' m-1 rounded-lg mt-4'>

              <div className=' flex justify-between mt-2'>
                <div>
                <div className="w-6 h-8 bg-[#F89912] rounded-lg absolute mt-4 ml-6"></div>
                <h1 className=' font-k2d  mt-5 ml-14 font-semibold '>{data.name}</h1>
                </div>
              
              <h1 className=' font-k2d mr-8 mt-5 cursor-pointer hover:text-orange-400'>View All</h1>
              </div>
   

              <div className=' flex justify-between bg-gray-100 mt-1 rounded-2xl'>
              {data.speciality?.slice(0, 4).map((specialityItem) => (
                specialityItem ? (
                  <div key={specialityItem?._id} className=' flex '>
                   
                    <div className=' p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition-all duration-300 ease-linear'>
                    <img 
                      src={specialityItem?.img} 
                      alt={specialityItem?.specialityName || "Speciality"} 
                      className="w-72 h-52 object-cover rounded-md" 
                    />
                    <h1 className=' text-center'>{specialityItem?.specialityName}</h1>
                    </div>
                 
                  </div>
                ) : null
               
              ))}
              </div>
             

            </div>
          ))}

        </ul>
        </div>
    </div>


    {/* Help */}
      <div>
        <HelpHome/>
      </div>


    </div>
    
    </>
   


  )
}

export default HomepageU
