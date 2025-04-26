import React from 'react';
import bg from '../assets/bb.jpg';
import HomeCategories from '../components/HomeCategories';
import { FaRegClock, FaUsers, FaHeadset, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { FiAward, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Service from './Service';

import { Link as ScrollLink } from "react-scroll";

const Homepage = () => {
  const features = [
    {
      icon: <FaRegClock className="text-4xl" />,
      title: "Quick Booking",
      description: "Book services in under 60 seconds with our streamlined process"
    },
    {
      icon: <FiShield className="text-4xl" />,
      title: "Verified Pros",
      description: "All service providers are background-checked and rated"
    },
    {
      icon: <FiAward className="text-4xl" />,
      title: "Quality Guarantee",
      description: "We stand behind every service with our satisfaction guarantee"
    },
    {
      icon: <FaCalendarAlt className="text-4xl" />,
      title: "Flexible Scheduling",
      description: "Book at your convenience with 24/7 availability"
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      title: "Transparent Pricing",
      description: "No hidden fees - know exactly what you'll pay upfront"
    },
    {
      icon: <FaHeadset className="text-4xl" />,
      title: "24/7 Support",
      description: "Our customer care team is always ready to assist you"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[800px]">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={bg} 
            alt="Happy service professionals" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Your Service, <br className="hidden md:block" /> Our Priority
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 max-w-lg">
              Connecting you with trusted professionals for all your service needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#F89912] hover:bg-[#e68a0a] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  Book Now
                </motion.button>
              </Link>

              <ScrollLink
                  to='how-it-works'
                  
                  smooth={true}
                  >
              <Link >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  
                  How It Works
                 
              
                </motion.button>
              </Link>
              </ScrollLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-gray-600">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              <FaUsers className="text-3xl text-blue-500" />
              <span className="font-semibold">10,000+ Happy Customers</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              <FaCheckCircle className="text-3xl text-green-500" />
              <span className="font-semibold">Verified Professionals</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              <FaHeadset className="text-3xl text-purple-500" />
              <span className="font-semibold">24/7 Support</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our most requested service categories
            </p>
          </motion.div>
          
          <HomeCategories />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your service booked in just 3 easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose Your Service",
                description: "Browse our categories and select the service you need",
                icon: <FaCheckCircle className="text-4xl" />
              },
              {
                step: "2",
                title: "Book an Appointment",
                description: "Select your preferred date and time with our professionals",
                icon: <FaCalendarAlt className="text-4xl" />
              },
              {
                step: "3",
                title: "Enjoy Your Service",
                description: "Relax while our verified professionals handle your needs",
                icon: <FaUsers className="text-4xl" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[#F89912] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <div className="text-[#F89912] mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make getting services done right, easy and reliable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all"
              >
                <div className="text-[#F89912] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#F89912] to-[#FFB347] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and service providers
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#F89912] font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  Sign Up Now
                </motion.button>
              </Link>
              <Link to="/service-provider">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white hover:text-[#F89912] transition-colors"
                >
                  Become a Provider
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;