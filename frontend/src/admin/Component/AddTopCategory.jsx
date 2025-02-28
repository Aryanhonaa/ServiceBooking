import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import authUserStore from '../../store/admin';


const AddTopCategory = () => {

    const[ name,setName]=useState("");
    const[img,setImg]=useState(null);
    const [ imgUrl,setImgUrl]=useState(null);
    const[open,setOpen]=useState(false);


    const {topCategory}=authUserStore();


    useEffect(()=>{
        if(img){
            const  objectUrl= URL.createObjectURL(img);
            setImgUrl(objectUrl);

            return ()=>URL.revokeObjectURL(objectUrl);
        }else{
            setImgUrl(null);
        }
    },[img])
    

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            const formData= new FormData();
            formData.append("name",name);
            formData.append("img",img);

            await topCategory(formData);

            setName("");
            setImg("");
            setImgUrl(null);
            setOpen(false);

        }catch(err){

            console.log(err);
            toast.error("Error In Adding Category");
        }

    }

   
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className=' flex flex-col mt-6 '>

            <label>Enter The Category Name:</label>
            <input type='text' placeholder='Enter Name'  
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md"></input>
            
                
            <label className=' mt-8'>Upload Image: </label>
            <input type='file' accept='image/*' onChange={(e)=>setImg(e.target.files[0])} className=' cursor-pointer'></input>


            {img &&(
                 <img src={imgUrl}  style={{width:300, height:300}}></img>
            )
            
            }
           
        </div>
        {
  open && (
    <>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-slate-500 px-10 py-8 rounded-lg shadow-lg">
        <h1 className="mb-6 text-white text-lg font-semibold">Are You Sure?</h1>
        <div className="flex justify-between gap-4">
          <button className="bg-green-500 px-4 py-2 rounded text-white">Yes</button>
          <button className="bg-red-500 px-4 py-2 rounded text-white" onClick={()=>setOpen(false)}>No</button>
        </div>
      </div>
    </>
  )
}

        <button  onClick={()=>setOpen(true)} type='button' className={`mt-4  px-10 py-2 rounded-2xl text-white font-sans ${!name || !img ||!imgUrl ? ' cursor-not-allowed bg-gray-500':'bg-rose-500'}`}>Submit</button>
      </form>
    </div>
  )
}

export default AddTopCategory
