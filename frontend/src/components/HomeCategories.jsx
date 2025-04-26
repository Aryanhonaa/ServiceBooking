import React from 'react'
import categoryStore from '../store/categoryStore';
import {useEffect, useState} from 'react';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
const HomeCategories = () => {
  const {getCategory}=categoryStore();

  const [categories,setCategories]=useState([]);
  useEffect(()=>{
    const getData=async()=>{
      const res= await getCategory();
      setCategories(res);
    }
    getData()
  
  },[getCategory]);

  console.log("CAT",categories);

  return (
    <div className=' m-10 p-14 bg-[#F8F8F8]'>

      <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration:2 }}
      viewport={{ once: true, amount: 0.2 }}
      >
      <div className="flex items-center space-x-4">
    
    <div className="w-6 h-8 bg-[#F89912] rounded-lg"></div>
    
    {/* Text */}
    <span className="text-[#F89912] font-bold text-2xl">
      Hot Services
    </span>
  </div>





  <div className=' mt-6'>
<ul className="flex flex-wrap gap-8 justify-center md:gap-28">
{categories.slice(0, 4).map((category, index) => (
    <li
      key={index}
      className="w-full sm:w-1/2 md:w-60 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative h-48 ">
        <img
          src={category.img}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="mt-3 text-center">
        <h1 className="text-gray-500 text-[16px] mt-2 font-k2d">{category.name}</h1>
      </div>
    </li>
  ))}
</ul>
</div>

      </motion.div>
       
    </div>
  )
}

export default HomeCategories;
