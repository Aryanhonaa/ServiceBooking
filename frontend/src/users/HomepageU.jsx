import React, { useState, useEffect } from 'react';
import userStore from '../store/UserStore';
import categoryStore from '../store/categoryStore';
import { Link } from 'react-router-dom';
import HelpHome from './components/HelpHome';
import TopCategory from './components/TopCategory';

import img1 from '../assets/slides/1.jpeg';
import img3 from '../assets/slides/3.jpg';
import img4 from '../assets/slides/4.jpg';

const images = [img1, img3, img4];

const HomepageU = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [category, setCategory] = useState([]);
  const { getCategory, categories } = categoryStore();
  const { authUser } = userStore();

  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getData=async()=>{
      try{
        const res= await getCategory();
        console.log("RES",res);

        setCategory(res);

      }catch(err){
        console.log(err);
      }
    }
    getData();
 
  }, []);

  // useEffect(() => {
  //   if (categories) {
  //     setCategory(categories);
  //   }
  // }, [categories]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-6 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
              Welcome, <span className="font-medium text-amber-400">{authUser?.name || "Guest"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              Discover and book professional services with ease
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/services" 
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Services
              </Link>
              {!authUser && (
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-300 border border-white/30 hover:border-white/50"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? 'bg-amber-400 w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">500+</div>
            <div className="text-gray-600">Professionals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">50+</div>
            <div className="text-gray-600">Service Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-800 mb-2">Popular Services</h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto"></div>
        </div>
        <TopCategory />
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {category.slice(0, 3).map((data) => (
          <div key={data._id} className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-2 h-8 bg-amber-400 rounded mr-4"></div>
                <h2 className="text-2xl font-light text-gray-800">{data.name}</h2>
              </div>
              <Link 
                to="/services" 
                className="text-amber-600 hover:text-amber-800 transition-colors flex items-center"
              >
                View All <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.speciality?.slice(0, 4).map((specialityItem) => (
                specialityItem && (
                  <Link 
                    key={specialityItem._id} 
                    to={`/service/providers/${specialityItem.specialityName}`}
                    className="group transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-amber-100">
                      <div className="h-48 bg-gray-50 flex items-center justify-center p-4 relative">
                        <img
                          src={specialityItem.img || "/placeholder.jpg"}
                          alt={specialityItem.specialityName}
                          className="object-contain h-full w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-medium text-gray-800 group-hover:text-amber-600 transition-colors">
                          {specialityItem.specialityName}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {specialityItem.description || 'Professional service for all your needs'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-2">What Our Customers Say</h2>
            <div className="w-20 h-1 bg-amber-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Found the perfect professional for my home renovation. The service was exceptional!",
                name: "Sarah Johnson",
                role: "Homeowner"
              },
              {
                quote: "Quick, reliable, and professional. Will definitely use this platform again.",
                name: "Michael Chen",
                role: "Small Business Owner"
              },
              {
                quote: "The booking process was so easy and the quality of service exceeded my expectations.",
                name: "David Wilson",
                role: "Frequent User"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-amber-400 mb-4">★★★★★</div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="font-medium text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Ready to find your perfect service professional?</h2>
          <p className="text-xl text-amber-100 mb-8">Join thousands of satisfied customers today</p>
          <Link 
            to={authUser ? "/services" : "/register"} 
            className="inline-block px-8 py-3 bg-white text-amber-600 hover:bg-gray-100 font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {authUser ? "Browse Services" : "Get Started Now"}
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <HelpHome />
        </div>
      </div>
    </div>
  );
};

export default HomepageU;