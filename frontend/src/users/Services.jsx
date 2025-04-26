import React, { useEffect, useState } from 'react';
import categoryStore from '../store/categoryStore';
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { motion } from 'framer-motion';

import image1 from '../assets/homeSlide/3.jpeg';
import image2 from '../assets/homeSlide/2.jpg';
import image3 from '../assets/homeSlide/4.jpg';

const Services = () => {
    const { getCategory } = categoryStore();
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [image1, image2, image3];

    const [categories ,setCategories]=useState([]);
   
    useEffect(()=>{
        const getData= async()=>{
            try{
                const res= await getCategory();
                setCategories(res);

            }catch(err){
                console.log(err);
            }
        }

        getData();
    },[])

    useEffect(() => { setFilteredCategories(categories); }, [categories]);

    useEffect(() => {
        let updated = categories.filter(cat =>
            cat.name.toLowerCase().includes(search.toLowerCase()) ||
            cat.speciality.some(spec =>
                spec.specialityName.toLowerCase().includes(search.toLowerCase())
            )
        );

        if (selectedCategory !== 'All') {
            updated = updated.filter(cat => cat.name === selectedCategory);
        }
        setFilteredCategories(updated);
    }, [search, selectedCategory, categories]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative w-full h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center px-4"
                    >
                        <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
                            Find the Perfect <span className="font-medium">Service</span>
                        </h1>
                        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                            Browse our curated selection of professional services
                        </p>
                    </motion.div>
                </div>
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-1000"
                />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                    </div>
                    <select
                        className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Services Grid */}
                <div className="space-y-16">
                    {filteredCategories.map((category) => (
                        <div key={category._id} className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-md bg-yellow-400"></div>
                                <h2 className="text-2xl font-light text-gray-800">
                                    {category.name}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {category.speciality.map((specialityItem) => (
                                    specialityItem && (
                                        <Link
                                            key={specialityItem._id}
                                            to={`/service/providers/${specialityItem.specialityName}`}
                                            className="group"
                                        >
                                            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                                                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                                                    <img
                                                        src={specialityItem.img || "/placeholder.jpg"}
                                                        alt={specialityItem.specialityName}
                                                        className="object-contain h-full w-full"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-sm text-gray-500 font-light mb-1">
                                                        {specialityItem.subText || 'Professional Service'}
                                                    </h3>
                                                    <h2 className="text-lg font-medium text-gray-800 group-hover:text-yellow-600 transition-colors">
                                                        {specialityItem.specialityName}
                                                    </h2>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCategories.length === 0 && !search && (
                    <div className="text-center py-16">
                        <p className="text-gray-500">No services found. Try a different search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;