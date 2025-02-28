import React from 'react'
import categoryStore from '../store/categoryStore';
import {useEffect, useState} from 'react';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import {Link} from 'react-router-dom'
const HomeCategories = () => {
  const {categories,getCategory}=categoryStore();


  useEffect(()=>{
    getCategory();
  },[getCategory]);

  console.log(categories);

  return (
    <div className=' m-2 p-16 bg-[#F8F8F8]'>
        <div className="flex items-center space-x-4">
    
      <div className="w-6 h-8 bg-[#F89912] rounded-lg"></div>
      
      {/* Text */}
      <span className="text-[#F89912] font-bold text-2xl">
        Categories
      </span>
    </div>

    <div className="flex items-center justify-between w-full p-10">
  <h1 className="font-bold text-3xl">Hot Products</h1>
  <Link to={'/auth'}>
  <FaRegArrowAltCircleRight size={30} className="text-[#F89912]" />
  </Link>
  
</div>



    <div>
  <ul className="flex flex-wrap gap-8 justify-center md:gap-28">
    {categories.slice(0,4).map((category, index) => (
      
      <li
        key={index}
        className="w-full sm:w-1/2 md:w-60 p-2 border rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      >
        <h1 className="text-lg font-bold mb-2">{category.name}</h1>
        <img
          src={category.img}
          alt="Category"
          className="w-full h-72 object-cover rounded-md"
        />
      </li>
    ))}
  </ul>
</div>
    </div>
  )
}

export default HomeCategories;
