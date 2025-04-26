import React, { useEffect, useState } from 'react';
import categoryStore from '../store/categoryStore';
import { Link } from 'react-router-dom';
import image1 from '../assets/homeSlide/4.jpg';
import image2 from '../assets/homeSlide/2.jpg';
import image3 from '../assets/homeSlide/3.jpeg';
import { motion } from 'framer-motion';
const Service = () => {
  const { getCategory, categories } = categoryStore();
  const [filteredCategories, setFilteredCategories] = useState([]);



    const [currentIndex, setCurrentIndex] = useState(0);
  const images=[
    image1,
    image2,
    image3

  ]

  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); 
  
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

  useEffect(() => {
      getCategory();
  }, []);

  useEffect(() => {
      setFilteredCategories(categories);
  }, [categories]);

  return (
    <div >
        {/* <div className="relative w-full flex justify-center items-center">
      <div className="relative w-full ">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-[600px] object-cover rounded-lg transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 flex  bg-black bg-opacity-30 text-white text-center">
          <div className='  mt-40 ml-16'>
          <h1 className="text-2xl font-bold  font-k2d  ">
            {/* Welcome {authUser?.name ? authUser.name : "Guest"} */}
          {/* </h1>
          
          <motion.div
            initial={{opacity:0, y:40}}
            whileInView={{opacity:1, y:0}}
            transition={{duration:1}}
            viewport={{once:true, amount: 0.2 }}
          >
          <h2 className="k2d-bold text-5xl md:text-4xl lg:text-8xl font-bold text-white ml-5"
          >Explore Our <br/>Services</h2>
          </motion.div>
          */}

      {/* //     </div> */}
         
      {/* //   </div> */}
      {/* // </div> */}
    {/* </div> */} 
        <div className="bg-gray-50">
            <div className="max-w-screen-2xl mx-auto px-6 ">
                <motion.h2
                initial={{opacity:0,x:40}}
                whileInView={{opacity:1,x:0}}
                transition={{duration:1}}
                viewport={{once:true, amount:0.2}}
                className="text-4xl font-k2d font-bold text-gray-900 text-center bg- white"
                >
                     One Platform, Countless Services – Just a Click Away!
             
                </motion.h2>
                
                
                

             

                {/* Categories */}
                <div className="space-y-8 m-16">
                    {filteredCategories.slice(0,3).map((data) => (
                        <div key={data._id} className="rounded-lg p-6">
                            {/* Category Header */}
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div className="flex items-center">
                                    <div className=" mr-4  w-6 h-8 bg-[#F89912] rounded-lg"></div>
                                    <h1 className="text-[#F89912] font-bold text-xl">{data.name}</h1>
                                </div>
                                <Link 
                                    to={`/auth`} 
                                    className="text-orange-500 flex items-center gap-2 hover:text-orange-600 transition"
                                >
                                  
                                </Link>
                            </div>

                            {/* Specialities Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                                {data.speciality.slice(0,4).map((specialityItem) => (
                                    specialityItem && (
                                        <Link 
                                          to={'/auth'}
                                        >
                                            <div className="    hover:shadow-lg transition transform hover:scale-105">
                                                <img 
                                                    src={specialityItem.img || "/placeholder.jpg"} 
                                                    alt={specialityItem.specialityName} 
                                                    className="w-full h-48 object-cover rounded-md"
                                                />
                                                <h1 className="text-center mt-3 text-lg font-k2d text-gray-700 group-hover:text-orange-500">
                                                    {specialityItem.specialityName}
                                                </h1>
                                            </div>
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Service;
