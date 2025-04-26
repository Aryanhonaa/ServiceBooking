import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../config/axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaBriefcase, FaStar, FaArrowLeft } from "react-icons/fa";
import BookAppointment from "./components/BookAppointment";
import userStore from "../store/UserStore";
import { FaRegStar } from "react-icons/fa";

const ProvProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [specialityImg, setSpecialityImg] = useState(null);
  const { getReviews } = userStore();
  const [reviews, setReviews] = useState([]);
  const [reviewP, setReviewP] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await axiosInstance.get(`/users/service/profile/${id}`);
        if (fetchedData.data.success) {
          setData(fetchedData.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!data?.speciality) return;

    const getImg = async () => {
      try {
        const res = await axiosInstance.post(
          `/users/send-speciality-img`,
          { name: data.speciality }
        );
        setSpecialityImg(res.data.image);
      } catch (err) {
        console.error(err);
      }
    };
    getImg();
  }, [data?.speciality]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews(id);
        setReviews(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [id]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const total = reviews.reduce((acc, curr) => acc + curr.overallScore, 0);
  const avgRating = reviews.length ? Math.ceil(total / reviews.length) : 0;

  const StarRating = ({ rating }) => {
    const fullStars = Math.ceil(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
      </div>
    );
  };

  const handleShowMore = () => setReviewP((prev) => prev + 3);
  const handleShowLess = () => setReviewP((prev) => prev - 3);

  return (
    <main className="py-8 px-4 bg-gray-50 min-h-screen mt-11">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to={`/service/providers/${data.speciality}`}
          className="inline-flex items-center text-yellow-500 hover:text-yellow-800 transition-colors duration-200 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          <span className="font-medium">Back to Providers</span>
        </Link>

        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                <img
                  src={data.image || "https://via.placeholder.com/150"}
                  alt="Provider"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{data.firstName} {data.lastName}</h1>
                <p className="text-lg md:text-xl opacity-90 mt-1">{data.speciality}</p>
                <div className="flex items-center mt-3 bg-orange-500 px-2 rounded-2xl py-2">
                  <StarRating rating={avgRating} />
                  <span className="ml-2 text-sm opacity-80">{reviews.length} reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">About Me</h2>
                <p className="text-gray-700 leading-relaxed">
                  {data.about || "No description provided."}
                </p>
              </div>

              {/* Service Overview */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Service Overview</h2>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/3">
                    <img
                      src={specialityImg || "https://via.placeholder.com/300"}
                      alt="Service"
                      className="rounded-lg w-full h-48 object-cover shadow-md"
                    />
                  </div>
                  <div className="w-full md:w-2/3">
                    <p className="text-gray-700">
                      Specializing in {data.speciality} with extensive experience and training.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-blue-500 mr-2" />
                        <span>{data.address?.city || "Location not specified"}</span>
                      </div>
                      <div className="flex items-center">
                        <FaPhoneAlt className="text-green-500 mr-2" />
                        <span>{data.phone || "Phone not provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="text-orange-500 mr-2" />
                        <span>{data.email || "Email not provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Client Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {reviews.slice(0, reviewP).map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                {review?.userName?.firstName?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-medium">{review?.userName?.firstName}</h3>
                                <StarRating rating={review.overallScore} />
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700 pl-13">"{review.comment}"</p>
                          <div className="flex justify-between mt-2 text-sm text-gray-600 pl-13">
                            <span>Quality: {review.rating.quality}/5</span>
                            <span>Price: {review.rating.price}/5</span>
                            <span>Service: {review.rating.service}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {reviews.length > 3 && (
                      <div className="mt-6 text-center">
                        {reviewP < reviews.length ? (
                          <button
                            onClick={handleShowMore}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                          >
                            Show More Reviews
                          </button>
                        ) : (
                          <button
                            onClick={handleShowLess}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                          >
                            Show Less
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Booking Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Book Appointment</h2>
                  <BookAppointment dataImg={data.image} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProvProfile;