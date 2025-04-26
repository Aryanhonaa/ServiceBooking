import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/SideBar'
import AddCategory from '../Component/AddCategory';
import { FaPlusCircle, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
// import { FaPlusCircle, FaEdit, FaTrashAlt } from 'react-icons/fi'; 
import { HiDatabase, HiOutlineViewGridAdd } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import { axiosInstance } from '../../config/axios';
import { toast } from 'react-toastify';
import authUserStore from '../../store/admin';
import AddTopCategory from '../Component/AddTopCategory';

import { FiFolder, FiList, FiTrendingUp } from 'react-icons/fi';      
// import { Form } from 'react-router-dom';


const Category = () => {
    const [step,setStep]=useState(1);
    const [categories,setCategories]=useState([]);
    const {addSpeciality, getSpecialites,  removeSpeciality}=authUserStore();
    const[dat,setData]=useState([]);
    const [detail,setDetail]=useState("");
  
    useEffect(()=>{
      const dataFetch=async() =>{
        try{
          const res=await axiosInstance.get('/admin/get-category')
          console.log("Data:",res.data.data)
          setCategories(res.data.data)

        }catch(err){
          console.log(err);
        }
      
      };
      dataFetch();
    },[])
    console.log("CAT",categories);
   
    // stpe3
    const [selectCategory,setSelectedCategory]=useState({id:"", name:""});
    console.log("seke: ",selectCategory);


    const[specialityName,setSpecialitynName]=useState("");
    const[img,setImg]=useState(null);


    const imgUrl= img? URL.createObjectURL(img):null;


    const handleNewSpeciality=async()=>{
      try{

        const form= new FormData()
          form.append("specialityName",specialityName);
          form.append("specialityImage",img);

        const id= selectCategory.id;
        const res= await addSpeciality(id, form)

        if(res.success){
          toast.success("Speciality Added");
          setSpecialitynName("");
          setImg(null);
        }
      }catch(err){
        console.log(err);
        toast.error("Error in Adding New Speciality");
      }
    }

    const [specialities,setSpecialities]=useState([]);

    useEffect(()=>{
      const getSpecialite=async()=>{
        try{
          const res=await  getSpecialites(selectCategory.name);
          setSpecialities(res.data);
        }catch(err){
          console.log(err);
        }
      }

      getSpecialite();
    },[selectCategory])
   

    console.log("SEEES",selectCategory);
    console.log("SPECIALITES",specialities);

    const handleRemoveSpecialty=async(specialtyId)=>{
      try{
      
        const categoryId= selectCategory.id;
        const data= {categoryId, specialtyId};
        const res= await  removeSpeciality(data );

      }catch(err){
        console.log(err);
      }
    }

    let sum=0;

    const totalSpeciliaites= categories.reduce((sum,c)=>sum + c.speciality.length,0)
    console.log("TOTOT",totalSpeciliaites);

    console.log("Cat",categories)

  return (
    <div className="flex">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content Area */}
    <div className="flex-grow p-6">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      {/* Add more content here related to categories */}

      {step === 1 && (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Specialty Management</h1>
      <p className="text-lg text-gray-600">Select an action to manage categories and specialties</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Add Category Card */}
      <div 
        className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
        onClick={() => setStep(2)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 p-4 bg-blue-100 rounded-full">
            <FaPlusCircle className="text-4xl text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Add Category</h3>
          <p className="text-gray-500 text-center mb-4">Create new specialty categories for your system</p>
          <span className="inline-flex items-center text-blue-600 font-medium">
            Get started
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>

      {/* Add Speciality Card */}
      <div 
        className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
        onClick={() => setStep(3)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 p-4 bg-green-100 rounded-full">
            <FaEdit className="text-4xl text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Add New Speciality</h3>
          <p className="text-gray-500 text-center mb-4">Add new specialties to existing categories</p>
          <span className="inline-flex items-center text-green-600 font-medium">
            Get started
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>

      {/* Remove Speciality Card */}
      <div 
        className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
        onClick={() => setStep(4)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 p-4 bg-red-100 rounded-full">
            <FaTrashAlt className="text-4xl text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Remove Speciality</h3>
          <p className="text-gray-500 text-center mb-4">Manage and remove existing specialties</p>
          <span className="inline-flex items-center text-red-600 font-medium">
            Get started
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </div>

    {/* Stats/Quick Overview Section */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <FiFolder className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Categories</p>
            <h3 className="text-2xl font-bold text-gray-800">{categories.length}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <FiList className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Specialties</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalSpeciliaites}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <FiTrendingUp className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Recently Added</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {specialities.length > 0 ? specialities[specialities.length - 1].specialityName : 'None'}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        {
            step ===2 && (
                <>
                <div className=' mt-10'>
                    <div className=' mt-6'>   

                      <div className=' flex'>
                      <IoMdArrowBack size={25} onClick={()=>setStep(1)} className=' cursor-pointer mt-6 hover:text-blue-600 transition-colors duration-400'/>
                      <h1 className=' font-k2d text-3xl mt-4 ml-4'>Add Category </h1>
                      </div>
                  <h1 className=' mt-2'>Category & Speciality Details</h1>

                <AddCategory/>
                </div>
                </div>
                </>
            )
        }
      

        {/* STEP 3 */}
      {step ===3 &&(
        <>
        <div>
            <div className=' flex'>
            <IoMdArrowBack size={25} onClick={()=>setStep(1)}  className=' cursor-pointer mt-6 hover:text-blue-600 transition-colors duration-400'/>
              <h1 className=' font-k2d text-3xl mt-4 ml-4'>Add Speciality</h1>
            </div>




          <div className=' mt-6 '> 
          <h1 className=' text-xl underline'>Select Category</h1>
          <div>
          <ul>
            <div className=' bg-slate-500 px-16 w-1/2 rounded-xl py-3 pb-8'>
            {categories.map((cat)=>(
              
              <div className=' flex mt-4 hover:bg-slate-800 bg-slate-700 py-5 rounded-xl px-6 ' key={cat._id}>
                
                <input
      value={cat._id} // Set the value to cat._id
      type="radio"
      name="category"
      onChange={() => setSelectedCategory({ id: cat._id, name: cat.name })} // Save both id and name
      id={`select-${cat._id}`}
      className="cursor-pointer"
    />
                <label htmlFor={`select-${cat._id}`} className=' cursor-pointer text-xl ml-4 text-white' >{cat.name}</label>
              </div>

            ))}
            </div>
           
          </ul>
          </div>

            <div className=' mt-9'>
            <p className='font-bold'>Selected Category: <span className=' font-bold text-red-600 ml-4 underline'>{selectCategory.name}</span> </p>
            </div>

            <div className='mt-6'>
              <h1 className=' text-pretty font-k2d'>Enter Details of New Speciality</h1>
           
            <div className=' mt-5'>
            <label>
             Specilaty Name:  
            </label>
            <input type='text' value={specialityName} onChange={(e)=>setSpecialitynName(e.target.value)} className='mt-1 p-2 border border-gray-300 rounded-md ml-6 px-16'></input>
            </div>

            <div className=' mt-5'>
            <label>
             Specilaty Detail:  
            </label>
            <input type='text' value={detail} onChange={(e)=>setDetail(e.target.value)} className='mt-1 p-2 border border-gray-300 rounded-md ml-6 px-16'></input>
            </div>

            
            <div className=' mt-5'>
            <label>
             Specilaty Image:  
            </label>
            <input   onChange={(e)=>setImg(e.target.files[0])} type="file" className='mt-1 p-2 border border-gray-300 rounded-md ml-6'></input>
            </div>
            <img src={imgUrl} className="w-48 h-48 object-cover rounded-lg shadow"></img>
          
          <button onClick={handleNewSpeciality}>Submit</button>
            </div>
            
          </div>
          

        
        {/* <button onClick={()=>data}>Serac</button> */}
        </div>
        </>
      )}


      {/* STEP4 */}
      {
  step === 4 && (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => setStep(1)}
          className="p-2 mr-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <IoMdArrowBack size={24} className="text-gray-600 hover:text-blue-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Manage Specialties</h1>
      </div>

      {/* Side-by-side layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Categories */}
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Categories</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {categories.map((cat) => (
                <div 
                  key={cat._id}
                  onClick={() => setSelectedCategory({ id: cat._id, name: cat.name })}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-200 flex items-center ${
                    selectCategory?.id === cat._id
                      ? 'bg-blue-100 border-l-4 border-blue-500'
                      : 'hover:bg-gray-100 border-l-4 border-transparent'
                  }`}
                >
                  <span className="text-gray-800">{cat.name}</span>
                 
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Specialties */}
        <div className="w-full md:w-2/3">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
            {selectCategory ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-700">
                    Specialties in <span className="text-blue-600">{selectCategory.name}</span>
                  </h2>
                  <span className="text-sm text-gray-500">
                    {specialities.length} {specialities.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {specialities.length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {specialities.map((data) => (
                      <div 
                        key={data._id} 
                        className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                      >
                        <span className="text-gray-800">{data.specialityName}</span>
                       
                        <button 
                          onClick={() => handleRemoveSpecialty(data._id)}
                          className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-200"
                          title="Remove specialty"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      {/* <FiFolder size={48} className="mx-auto" /> */}
                    </div>
                    <p className="text-gray-500">No specialties found in this category</p>
                    <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      + Add New Specialty
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <FiLayers size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500">Select a category to view specialties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
      {step ===5 &&(
        <>
        <div>

          <div className=' flex '>
          <IoMdArrowBack size={25} onClick={()=>setStep(1)}  className=' cursor-pointer mt-6 hover:text-blue-600 transition-colors duration-400'/>
          <h1 className=' font-k2d  text-2xl mt-5 ml-3'>Add Top Categories</h1>
          </div>

          <AddTopCategory/>
        </div>
      
        </>
      )}
    </div>
  </div>
  )
}

export default Category
