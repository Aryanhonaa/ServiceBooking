import React, { useState } from 'react';
import contactImg from '../assets/ContactUs.jpg';
import { toast } from 'react-toastify';
import { axiosInstance } from '../config/axios';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.name || !formData.message) {
        toast.error('Please fill all required fields', {
          position: 'top-center',
          autoClose: 3000
        });
        return;
      }

      // Validate phone number if provided
      if (formData.number && !/^[0-9]{10}$/.test(formData.number)) {
        toast.error('Please enter a valid 10-digit phone number', {
          position: 'top-center',
          autoClose: 5000
        });
        return;
      }

      const res = await axiosInstance.post('/admin/contact', formData);

      if (res.data.success) {
        toast.success('Your message has been sent successfully!', {
          position: 'top-center',
          autoClose: 3000
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          number: '',
          message: ''
        });
      } else {
        toast.error('Failed to send message. Please try again.', {
          position: 'top-center'
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again later.', {
        position: 'top-center'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[700px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={contactImg}
            alt="Contact us background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 h-full flex flex-col justify-center items-start px-6 md:px-12 lg:px-24"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white opacity-90 max-w-2xl">
            We're here to help and answer any questions you might have.
          </p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Contact Form */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Send us a message</h2>
              <p className="text-gray-600 mb-6">We'll get back to you as soon as possible</p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
                      isFormValid 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-all`}
                    disabled={!isFormValid || isSubmitting}
                    whileHover={isFormValid ? { scale: 1.02 } : {}}
                    whileTap={isFormValid ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="text-lg" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg h-full"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <FiMapPin className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">Our Office</h3>
                      <p className="text-gray-600">GharKaam Pvt. Ltd, Boudha, Kathmandu, Nepal</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <FiPhone className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">Call Us</h3>
                      <a 
                        href="tel:015910229" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        01-5910229
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <FiMail className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">Email Us</h3>
                      <a 
                        href="mailto:gharkaam01@gmail.com" 
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        gharkaam01@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map Embed */}
                <div className="mt-8 rounded-lg overflow-hidden">
                  <iframe
                    title="GharKaam Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456621188371!2d85.36161431506203!3d27.70389938279391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a64b5f13e1%3A0x28b2d0eacda46b98!2sBoudha%20Stupa!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;