import React, { useEffect, useState } from 'react';
import SideBarS from './components/SideBarS';
import serviceP from '../store/ServiceProviderStore';
import userStore from '../store/UserStore';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const Reviews = () => {
    const { darkMode, getReviews } = serviceP();
    const { authUser } = userStore();
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [latestReviews, setLatestReviews] = useState([]);



const itemsPerPage=4;

const [currentPage,setCurrentPage]=useState(1);

const totalPages= Math.ceil(latestReviews.length / itemsPerPage);

const indexOfLastItem= currentPage * itemsPerPage;

const indexofFirstItem= indexOfLastItem - itemsPerPage;

const currentItems= latestReviews.slice(indexofFirstItem , indexOfLastItem);
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getReviews(authUser._id);
                setReviews(res.data);
                
                if (Array.isArray(res.data) && res.data.length > 0) {
         
                    const total = res.data.reduce((acc, curr) => acc + curr.overallScore, 0);
                    const avg = Math.round((total / res.data.length) * 10) / 10;
                    setAverageRating(avg);
                   
                    const sortedReviews = [...res.data].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setLatestReviews(sortedReviews);
                }
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [currentPage]);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
        }
        
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
        }
        
        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
        }
        
        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    ({rating.toFixed(1)})
                </span>
            </div>
        );
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen flex`}>
            <SideBarS />

            <div className="p-6 w-full">
                <h1 className="text-3xl font-bold mb-6">Your Reviews</h1>
                
                {latestReviews.length > 0 ? (
                    <div className="space-y-6">
                        {/* Average Rating Card */}
                        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Average Rating</h2>
                                    <div className="flex items-center">
                                        {renderStars(averageRating)}
                                        <span className="ml-4 text-gray-600 dark:text-gray-400">
                                            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing newest first
                                </div>
                            </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Recent Feedback</h2>
                            {currentItems.map((review) => (
                                <div 
                                    key={review._id} 
                                    className={`p-4 rounded-lg shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border transition-all hover:shadow-md`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">
                                                {review.userName.firstName} {review.userName.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {renderStars(review.overallScore)}
                                    </div>
                                    
                                    {review.comment && (
                                        <p className={`${darkMode? "text-gray-300 mt-3 italic":" mt-3 text-gray-900 italic"}`}>
                                            "{review.comment}"
                                        </p>
                                    )}
                                    
                                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center">
                                            <span className="font-medium mr-1">Quality:</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    i < review.rating.quality ? 
                                                    <FaStar key={i} className="text-yellow-500 text-xs" /> : 
                                                    <FaRegStar key={i} className="text-yellow-500 text-xs" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-1">Price:</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    i < review.rating.price ? 
                                                    <FaStar key={i} className="text-yellow-500 text-xs" /> : 
                                                    <FaRegStar key={i} className="text-yellow-500 text-xs" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-1">Service:</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    i < review.rating.service ? 
                                                    <FaStar key={i} className="text-yellow-500 text-xs" /> : 
                                                    <FaRegStar key={i} className="text-yellow-500 text-xs" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className=' flex justify-center '>
                            <button onClick={()=>setCurrentPage((prev)=>Math.max(prev -1))}
                                disabled={currentPage ===1}

                                className={`px-4 py-4 mr-2 rounded-2xl ${currentPage ===1? "bg-gray-600 cursor-not-allowed text-gray-200":"bg-yellow-400"}`}
                                >Back</button>
                            
                            <span  className="px-3  py-3 border border-gray-300 rounded-lg text-gray-700">
                                {currentPage} / {totalPages}
                            </span>

                            <button onClick={()=>setCurrentPage((prev)=>Math.min(prev +1))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-4 bg-yellow-400 rounded-2xl ml-2 ${currentPage ===totalPages? "bg-yellow-200 cursor-not-allowed":""}`}
                            >Next</button>
                        </div>
                    </div>
                ) : (
                    <div className={`p-6 rounded-lg text-center ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
                        <p className="text-gray-500 dark:text-gray-400">
                            No reviews yet. Your feedback will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reviews;