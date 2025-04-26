import React, { useState } from 'react';
import SideBarS from './components/SideBarS';
import userStore from '../store/UserStore';
import { IoMdArrowBack } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { toast } from 'react-toastify';
import { axiosInstance } from '../config/axios';
import EditProfile from './components/EditProfile';
import { TiTick } from "react-icons/ti";
import serviceP from '../store/ServiceProviderStore';
import { FiUser, FiDollarSign, FiEdit2, FiPieChart, FiFileText  } from 'react-icons/fi';

import { 
  MdLocalPhone,
  MdLocationOn
} from "react-icons/md";

const ProfileService = () => {
  const { authUser } = userStore();
  const { darkMode } = serviceP();
  const [step, setStep] = useState(1);
  const [openAboutEdit, setOpenAboutEdit] = useState(false);
  const [about, setAbout] = useState(authUser?.about || '');

  const handleAboutUpdate = async () => {
    try {
      const res = await axiosInstance.put(`/serviceprovider/update-about/${authUser._id}`, { about });
      if (res.data.success) {
        setOpenAboutEdit(false);
        toast.success("About updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating about section");
    }
  };

  const navigationButtons = [
    { label: "Account Information", icon: <FiUser className="mr-2" />, step: 3 },
    { label: "Service Fees", icon: <FiDollarSign className="mr-2" />, step: 4 },
    { label: "Edit Profile", icon: <FiEdit2 className="mr-2" />, step: 2 },
    { label: "Analytics", icon: <FiPieChart className="mr-2" />, step: 6 },
    { label: "Documents", icon: <FiFileText className="mr-2" />, step: 5 }
  ];

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <SideBarS />

      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
            My Professional Profile
          </h1>
          <div className={`h-1 w-16 mt-2 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`}></div>
        </div>

        {/* Main Content */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Profile Card */}
            <div className={`rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center transition-all duration-300 
              ${darkMode ? "bg-gray-800 hover:shadow-blue-500/10" : "bg-white hover:shadow-lg"}`}>
              
              {/* Profile Image */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {authUser?.image ? (
                  <img 
                    src={authUser.image} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/default-profile.jpg'}
                  />
                ) : (
                  <div className={`flex items-center justify-center w-full h-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No Image</span>
                  </div>
                )}
                <div className={`absolute inset-0 rounded-full border-2 ${darkMode ? "border-blue-400" : "border-blue-500"} opacity-20`}></div>
              </div>

              {/* Profile Info */}
              <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                  <h2 className={`text-xl md:text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {authUser?.firstName || "User"} {authUser?.lastName}
                  </h2>
                  <TiTick className={`ml-2 ${darkMode ? "text-green-400" : "text-green-600"}`} size={20} />
                </div>
                <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {authUser?.email || 'user@example.com'}
                </p>
                <div className={`mt-3 px-3 py-1 rounded-full inline-block ${darkMode ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                  {authUser?.speciality || 'Service Provider'}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-1`}>
              {navigationButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => setStep(button.step)}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all 
                    ${darkMode ? 
                      "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700" : 
                      "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"}
                    shadow-sm hover:shadow-md`}
                >
                  {button.icon}
                  {button.label}
                </button>
              ))}
            </div>

            {/* About and Account Info Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* About Section */}
              <div className={`rounded-xl p-6 transition-all duration-300 ${darkMode ? "bg-gray-800 hover:shadow-blue-500/10" : "bg-white hover:shadow-lg"}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Professional Bio</h3>
                  <CiEdit 
                    size={20} 
                    className={`cursor-pointer transition-colors ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
                    onClick={() => setOpenAboutEdit(!openAboutEdit)}
                  />
                </div>

                {!openAboutEdit ? (
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                    {authUser?.about || "Describe your professional background, skills, and expertise to help clients understand your qualifications."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className={`w-full h-40 p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                        darkMode ? 
                        "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500 focus:border-blue-500" : 
                        "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                      placeholder="Tell clients about your professional background..."
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setOpenAboutEdit(false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          darkMode ? 
                          "bg-gray-700 text-gray-300 hover:bg-gray-600" : 
                          "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAboutUpdate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Bio
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Info Section */}
              <div className={`rounded-xl p-6 transition-all duration-300 ${darkMode ? "bg-gray-800 hover:shadow-blue-500/10" : "bg-white hover:shadow-lg"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <InfoItem 
                    icon={<FiUser className={darkMode ? "text-blue-400" : "text-blue-500"} />}
                    label="Full Name" 
                    value={`${authUser?.firstName} ${authUser?.middleName || ''} ${authUser?.lastName}`} 
                    darkMode={darkMode} 
                  />
                  <InfoItem 
                    icon={<MdLocalPhone className={darkMode ? "text-blue-400" : "text-blue-500"} />}
                    label="Phone" 
                    value={authUser?.phone || 'Not provided'} 
                    darkMode={darkMode} 
                  />
                  <InfoItem 
                    icon={<MdLocationOn className={darkMode ? "text-blue-400" : "text-blue-500"} />}
                    label="Address" 
                    value={`${authUser?.address?.street || 'Not provided'}, ${authUser?.address?.city || ''}`} 
                    darkMode={darkMode} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Details View */}
        {step === 3 && (
          <AccountDetailsView 
            authUser={authUser} 
            darkMode={darkMode} 
            onBack={() => setStep(1)} 
          />
        )}

        {/* Documents View */}
        {step === 5 && (
          <div className={`rounded-xl p-6 transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="flex items-center mb-8">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center mr-4 ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"} transition-colors`}
              >
                <IoMdArrowBack className="mr-2" />
                Back
              </button>
              <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Professional Documents
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DocumentCard 
                title="Citizenship Front" 
                image={authUser?.citizenF} 
                darkMode={darkMode} 
              />
              <DocumentCard 
                title="Citizenship Back" 
                image={authUser?.citizenB} 
                darkMode={darkMode} 
              />
            </div>
          </div>
        )}

        {/* Edit Profile View */}
        {step === 2 && <EditProfile step={step} setStep={setStep} />}
      </div>
    </div>
  );
};

// Reusable Info Item Component with icon
const InfoItem = ({ icon, label, value, darkMode }) => (
  <div className="flex items-start">
    <div className={`p-2 rounded-lg mr-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
      {icon}
    </div>
    <div>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <p className={`mt-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
        {value || <span className="italic text-gray-500">Not provided</span>}
      </p>
    </div>
  </div>
);

// Document Card Component
const DocumentCard = ({ title, image, darkMode }) => (
  <div className={`rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} overflow-hidden shadow-sm`}>
    <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
      <h3 className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{title}</h3>
    </div>
    <div className="p-4">
      {image ? (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 object-contain rounded border"
          style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}
        />
      ) : (
        <div className={`flex flex-col items-center justify-center h-64 rounded border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
          <FiFileText size={48} className={darkMode ? "text-gray-600" : "text-gray-400"} />
          <p className={`mt-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Document not uploaded</p>
        </div>
      )}
    </div>
  </div>
);

// Account Details View Component
const AccountDetailsView = ({ authUser, darkMode, onBack }) => (
  <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
    <div className="flex items-center mb-8">
      <button
        onClick={onBack}
        className={`flex items-center mr-4 ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"} transition-colors`}
      >
        <IoMdArrowBack className="mr-2" />
        Back to Profile
      </button>
      <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Account Details
      </h1>
    </div>

    <div className="space-y-6">
      <DetailSection title="Personal Information" darkMode={darkMode}>
        <DetailItem label="First Name" value={authUser.firstName} darkMode={darkMode} />
        <DetailItem label="Last Name" value={authUser.lastName} darkMode={darkMode} />
        <DetailItem label="Email" value={authUser.email} darkMode={darkMode} />
      </DetailSection>

      <DetailSection title="Professional Information" darkMode={darkMode}>
        <DetailItem label="Speciality" value={authUser.speciality} darkMode={darkMode} />
        <DetailItem label="Service Fees" value={`Rs. ${authUser.fees || 'Not set'}`} darkMode={darkMode} />
      </DetailSection>

      <DetailSection title="Contact Information" darkMode={darkMode}>
        <DetailItem 
          label="Address" 
          value={`${authUser.address?.street || 'Not provided'}, ${authUser.address?.city}, ${authUser.address?.country}`} 
          darkMode={darkMode} 
        />
        <PhoneNumbers phone={authUser.phone} darkMode={darkMode} />
      </DetailSection>

      <DetailSection title="Verification" darkMode={darkMode}>
        <div className="flex items-center justify-between py-3">
          <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Status:</span>
          <div className="flex items-center">
            <span className={`mr-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>Verified</span>
            <TiTick className={darkMode ? "text-green-400" : "text-green-600"} size={20} />
          </div>
        </div>
      </DetailSection>
    </div>
  </div>
);

// Detail Section Component
const DetailSection = ({ title, children, darkMode }) => (
  <div>
    <h3 className={`text-lg font-medium mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{title}</h3>
    <div className={`space-y-3 pl-6 border-l-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
      {children}
    </div>
  </div>
);

// Detail Item Component
const DetailItem = ({ label, value, darkMode }) => (
  <div className="flex justify-between py-3">
    <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{label}</span>
    <span className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>
      {value || <span className="italic text-gray-500">Not provided</span>}
    </span>
  </div>
);

// Phone Numbers Component
const PhoneNumbers = ({ phone, darkMode }) => (
  <div className="flex justify-between py-3">
    <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Phone Numbers</span>
    <div className="text-right">
      {phone?.length > 0 ? (
        phone.map((number, index) => (
          <p key={index} className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {number}
          </p>
        ))
      ) : (
        <span className="italic text-gray-500">Not provided</span>
      )}
    </div>
  </div>
);

export default ProfileService;