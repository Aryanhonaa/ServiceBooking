import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/SideBar'
import AddCategory from '../Component/AddCategory';
import { FaPlusCircle, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import { axiosInstance } from '../../config/axios';
import { toast } from 'react-toastify';
import authUserStore from '../../store/admin';
import AddTopCategory from '../Component/AddTopCategory';
// import { Form } from 'react-router-dom';


const Category = () => {
    const [step,setStep]=useState(1);
    const [categories,setCategories]=useState([]);
    const {addSpeciality}=authUserStore();
    const[dat,setData]=useState([]);
  
    useEffect(()=>{
      const dataFetch=async() =>{
        try{
          const res=await axiosInstance.get('/admin/getCategory')
          console.log("Data:",res.data)
          
          setCategories(res.data.categories);
        }catch(err){
          console.log(err);
        }
      
      };
      dataFetch();
    },[])
    console.log(categories);
   
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


  return (
    <div className="flex">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content Area */}
    <div className="flex-grow p-6">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      {/* Add more content here related to categories */}

        {step ===1 &&(
            <>
            <div className=' flex justify-between'>

                <div className=' cursor-pointer  bg-slate-500 px-5 py-9 rounded-lg' onClick={()=>setStep(2)}>
                <FaPlusCircle className="text-4xl text-blue-500" />
                <h2 className="text-2xl font-bold mb-4">Add Category</h2>
                </div>

                <div className=' cursor-pointer  bg-slate-500 px-5 py-9 rounded-lg' onClick={()=>setStep(3)}>
                <FaEdit className="text-4xl text-green-500 justify-center align-middle" />
                <h2 className="text-2xl font-bold mb-4">Add New Speciality</h2>
                </div>


                <div className=' cursor-pointer  bg-slate-500 px-5 py-9 rounded-lg' onClick={()=>setStep(4)}>
                <FaTrashAlt className="text-4xl text-red-500" />
                <h2 className="text-2xl font-bold mb-4">Remove Category <br/> Speciality</h2>
                </div>  
            </div>


            <div className=' absolute mt-10'>

            <div className=' cursor-pointer  bg-slate-500 px-1 py-10 rounded-lg ' onClick={()=>setStep(5)}>
                <HiOutlineViewGridAdd size={35} />
                <h2 className='font-k2d font-semibold text-2xl'>Add Top Category</h2>
               </div>
            </div>
           
            </>
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
        step ===4 &&(
          <>
          <div>
            
            <div className=' flex'>
            <IoMdArrowBack size={25} onClick={()=>setStep(1)}  className=' cursor-pointer mt-6 hover:text-blue-600 transition-colors duration-400'/>
            <h1 className=' text-xl mt-5 ml-3 font-k2d'>Remove Speciality</h1>
            </div>
           

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
                <label htmlFor={`select-${cat._id}`} className=' cursor-pointer text-xl ml-4 text-white' >{cat?.name}</label>

                <p>{cat?.speciality}</p>
              </div>
              
            ))}
            </div>
           
          </ul>
          </div>

            <div className=' mt-9'>
            <p className='font-bold'>Selected Category: <span className=' font-bold text-red-600 ml-4 underline'>{selectCategory?.name}</span> </p>
            </div>

          </div>
          </>
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
