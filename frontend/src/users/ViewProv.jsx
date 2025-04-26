import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../config/axios";
import { FaHeart, FaMapMarkerAlt, FaUserMd, FaArrowLeft } from "react-icons/fa";

const ViewProv = () => {
  const { specialityName } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const res = await axiosInstance.get(
          `/users/service/providers/${encodeURIComponent(specialityName)}`
        );
        if (res.data.success) {
          setData(res.data.data);
        } else {
          throw new Error("Error fetching provider data");
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (specialityName) {
      fetchProviderData();
    }
  }, [specialityName]);


  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="flex items-center mb-8">
          <Link to="/homepage/user" className="mr-4">
            <FaArrowLeft className="text-gray-600 hover:text-yellow-500 transition-colors ease-in" size={20} />
          </Link>
          <h2 className="text-2xl font-light text-gray-800">
            {specialityName} Providers
          </h2>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-12">Loading providers...</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.length > 0 ? (
            data.map((provider) => (
              <div
                key={provider._id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border-b-2 border-r-2"
              >
                <Link to={`/profile/service-provider/${provider._id}`} className="block">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xl font-medium text-gray-900">
                          Rs {provider.fees || "36"}/h
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {provider.address?.street || "Address not specified"}
                        </p>
                      </div>
                     
                    </div>

                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="mr-4">
                        <img
                          src={provider.image || "/default-avatar.jpg"}
                          alt={provider.firstName}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {provider.title ? `${provider.title} ` : ""}
                          {provider.firstName} {provider.lastName}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <FaUserMd className="mr-1" size={12} />
                          {provider.speciality}
                        </p>
                        {provider.address?.city && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <FaMapMarkerAlt className="mr-1" size={10} />
                            {provider.address.city}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No {specialityName} providers available at this time.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProv;