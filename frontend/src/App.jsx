import React from 'react'
import { useState } from 'react'
import authUserStore from './store/authUserStore';
const App = () => {
  const{signUp}=authUserStore();
  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[speciality,setSpeciality]=useState('');
  const[experience,setExperience]=useState('');
  const[phone,setPhone]=useState('');
  const[about,setAbout]=useState('');
  const[fees,setFees]=useState('');
  const[address,setAddress]=useState('');
  const[image1,setImage1]=useState(null);
  const[image2,setImage2]=useState(null);
  const[image3,setImage3]=useState(null);


  const handleImage1Change = (e) => {
    setImage1(e.target.files[0]);
  };

  const handleImage2Change = (e) => {
    setImage2(e.target.files[0]);
  };

  const handleImage3Change = (e) => {
    setImage3(e.target.files[0]);
  };

  const handleSubmit=()=>{
    const formData=new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('speciality', speciality);
    formData.append('experience', experience);
    formData.append('phone', phone);
    formData.append('about', about);
    formData.append('fees', fees);
    formData.append('address', JSON.stringify(address));
    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('image3', image3);

    signUp(formData);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type='text' value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter Name'/>
      <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Email'/>
      <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter Password'/>
      <input type='text' value={speciality} onChange={(e)=>setSpeciality(e.target.value)} placeholder='Enter Speciality'/>
      <input type='text' value={experience} onChange={(e)=>setExperience(e.target.value)} placeholder='Enter Experience'/>
      <input type='number' value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='Enter Phone'/>
      <input type='text' value={about} onChange={(e)=>setAbout(e.target.value)} placeholder='Enter About'/>
      <input type='text' value={fees} onChange={(e)=>setFees(e.target.value)} placeholder='Enter Fees'/>
      <input type='text' value={address} onChange={(e)=>setAddress(e.target.value)} placeholder='Enter Address'/>
      <input type='file' onChange={handleImage1Change} placeholder='Image1' />
      <input type='file' onChange={handleImage2Change} placeholder='Image2' />
      <input type='file' onChange={handleImage3Change} placeholder='Image3' />
      <button type='submit'>Submit</button>
    </form>
  )
}

export default App
