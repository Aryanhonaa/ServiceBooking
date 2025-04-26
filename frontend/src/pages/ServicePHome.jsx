import React from "react";
import imgs from "../assets/servicePAuth.jpg";
import serviceP from "../store/ServiceProviderStore";
import SignUpForm from "../components/SignUpForm";
import LoginServiceP from "../components/LoginServiceP";
import { FaBriefcase, FaDollarSign, FaStar, FaUsers, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { motion } from 'framer-motion';

const ServicePHome = () => {
  const { isLogin, toogleLogin } = serviceP();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-screen max-h-[700px]">
        <img
          src={imgs}
          className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
          alt="Service Provider Background"
        />

        <div className="absolute inset-0 flex items-center justify-start px-8 md:px-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
              Get discovered, <br /> get booked!
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Join our platform and connect with clients looking for your expertise.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg"
              onClick={() => document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Connect. Serve. Grow.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your services, their needs—seamlessly matched!
          </p>
        </motion.div>
      </div>

      {/* Auth Section */}
      <div id="auth-section" className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Auth Card */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative bg-white p-8 max-w-md w-full border border-gray-200 shadow-xl rounded-xl"
              >
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-2xl font-bold px-4 py-2 rounded-lg shadow-lg">
                  {isLogin ? "Login" : "Sign Up"}
                </div>
                <h1 className="text-3xl font-bold text-center mb-8">
                  {isLogin ? "Welcome back!" : "Join Our Community"}
                </h1>

                <div>{isLogin ? <LoginServiceP /> : <SignUpForm />}</div>

                <div className="text-center mt-6">
                  <button
                    className="text-blue-600 font-medium hover:underline"
                    onClick={toogleLogin}
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Benefits Section */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="h-full flex flex-col justify-center"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Why Join Our Platform?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Grow your business, reach more clients, and increase your earnings with our powerful platform.
                </p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FaBriefcase className="text-blue-600 text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold">Flexible Work</h3>
                    </div>
                    <p className="text-gray-600">
                      Set your own schedule and choose the services you want to offer.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FaDollarSign className="text-green-600 text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold">Higher Earnings</h3>
                    </div>
                    <p className="text-gray-600">
                      Increase your income by reaching a larger audience.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-yellow-100 p-3 rounded-full mr-4">
                        <FaStar className="text-yellow-500 text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold">Build Reputation</h3>
                    </div>
                    <p className="text-gray-600">
                      Gain client trust through positive reviews and ratings.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <FaUsers className="text-purple-600 text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold">More Clients</h3>
                    </div>
                    <p className="text-gray-600">
                      Access to thousands of potential customers in your area.
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="mt-10 text-center"
                >
                  <button
                    onClick={() => document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Start Your Journey Today
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="p-6">
              <FaUsers className="text-4xl mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-xl">Active Clients</p>
            </div>
            <div className="p-6">
              <FaBriefcase className="text-4xl mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">5,000+</h3>
              <p className="text-xl">Service Providers</p>
            </div>
            <div className="p-6">
              <FaCalendarAlt className="text-4xl mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">50,000+</h3>
              <p className="text-xl">Monthly Bookings</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Providers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from service providers who've grown their business with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Since joining this platform, my bookings have tripled. The interface is easy to use and the support team is fantastic!"
              </p>
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-gray-600">Electrician</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "I love being able to set my own hours and prices. The payment system is seamless and I get paid quickly."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  MA
                </div>
                <div>
                  <h4 className="font-semibold">Maria Alvarez</h4>
                  <p className="text-gray-600">Cleaning Professional</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "The best decision I made for my business. I've connected with so many great clients and my income has never been better."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  TK
                </div>
                <div>
                  <h4 className="font-semibold">Tom Kim</h4>
                  <p className="text-gray-600">Handyman</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of service providers who are already benefiting from our platform.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg shadow-lg"
            onClick={() => document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' })}
          >
            Sign Up Now - It's Free!
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePHome;