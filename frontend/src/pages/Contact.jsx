import React, { useState } from 'react';
import contactImg from '../assets/ContactUs.jpg';
import { toast } from 'react-toastify';
import { axiosInstance } from '../config/axios';

const Contact = () => {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [number,setNumber]=useState('');
  const [message,setMessage]=useState('');
  const [submitted, setSubmitted] = useState(false);

  

  const handleSubmit= async(e)=>{
    e.preventDefault();

    try{
      if(!email || !name || !message){
        toast.error('Please fill all the fields');
      }
 const phoneRegex = /^[0-9]{10}$/; 

  if (!phoneRegex.test(number)) {
    toast.error('Please enter a valid 10-digit phone number.', {
      autoClose: 5000,
      position: 'top-center',
    });
    return;
  }

  const data={name,email,number,message};
  try {
    const res = await axiosInstance.post('/admin/contact', data);

    if (res.data.success) {
      setSubmitted(true);
      toast.success('Your message has been sent successfully');
      // Reset form fields
      setName('');
      setEmail('');
      setNumber('');
      setMessage('');
    } else {
      toast.error('Failed to send message');
    }
  } catch (err) {
    toast.error("Server Issue!");
  }
    }catch(err){
      toast.error("Server Issue!!");
    }
  }

  return (
    <main>
    <div className="relative">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background Image */}
        <img
          src={contactImg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
  
        <div className="absolute inset-0 flex flex-col justify-center items-start p-10 text-white">
          <h2 className="k2d-bold text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-white opacity-80 ml-5 mt-8">
            Contact <br/>
            Us
          </h2>
        </div>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row justify-start items-center py-12 px-6 sm:px-12 md:px-20 lg:px-32">
  {/* Contact Form Container */}
  <div className="w-full lg:w-2/3 xl:w-1/2 bg-white p-8 shadow-lg rounded-lg sm:px-8">
    <h2 className="text-3xl font-bold text-gray-800 text-center">Get in Touch</h2>
    <p className="text-gray-600 text-center mt-2">We would love to hear from you!</p>

    <form className="mt-6" onSubmit={handleSubmit}>
      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Full Name <span className='text-red-600'>*</span></label>
        <input type="text" className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Email <span className='text-red-600'>*</span></label>
        <input type="email" className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      {/* Phone Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Phone Number</label>
        <input type="tel" className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Your Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} required />
      </div>

      {/* Message Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Message <span className='text-red-600'>*</span></label>
        <textarea className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Write your message..." rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required />
      </div>

      {/* Submit Button */}
      <button type="submit" className={`w-full py-2 rounded-md text-white font-semibold transition ${
        name && email && number && message ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
      }`} disabled={!name || !email || !number || !message}>
        Send Message
      </button>
    </form>
  </div>

  {/* Address Section */}
  <div className="w-full lg:w-1/3 xl:w-1/2 mt-8 lg:mt-0 lg:ml-16 text-center lg:text-left text-gray-800">
    <h1 className="text-4xl font-semibold">Address</h1>
    <p className='mt-3'>GharKaam Pvt. Ltd, Boudha, Kathmandu, Nepal</p>
    <p className='mt-3'>Call: <a href="tel:015910229" className="hover:underline">01-5910229</a></p>
    <p className='mt-3'>Email: <a href="mailto:gharkaam01@gmail.com" className="text-blue-600 hover:underline">gharkaam01@gmail.com</a></p>
  </div>
</div>
s
  
  </main>
  
  )
}

export default Contact;
