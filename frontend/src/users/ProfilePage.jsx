import React, { useState, useRef } from 'react';
import userStore from '../store/UserStore';
import { FaUserEdit } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import AddressSelectorUser from './components/AddressSelectorUser';

const ProfilePage = () => {
    const { authUser, updateProfile } = userStore();
    
    const [name, setName] = useState(authUser?.name || '');
    const [email, setEmail] = useState(authUser?.email || '');
    const [about, setAbout] = useState(authUser?.about || '');
    const [image, setImage] = useState(authUser?.image || null);
    const [address, setAddress] = useState({
        street: authUser?.address?.street || '',
        city: authUser?.address?.city || '',
        country: authUser?.address?.country || '',
        lat: authUser?.address?.lat || null,
        lng: authUser?.address?.lng || null
    });
    const [imageFile, setImageFile] = useState(null);
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('about', about);
            formData.append('address', JSON.stringify(address)); 

            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            await updateProfile(formData);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden p-6 my-8">
            <h1 className="text-2xl font-light text-gray-800 text-center mb-6">Profile Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <img 
                            src={image || authUser?.image || '/default-avatar.jpg'} 
                            alt="Profile" 
                            className="w-32 h-32 object-cover rounded-full border-2 border-gray-100 shadow-sm"
                        />
                        <button
                            type="button"
                            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaUserEdit className="text-gray-600" size={16} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Name Field */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                        {authUser?.email}
                    </div>
                </div>

                {/* About Field */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">About</label>
                    <textarea
                        value={about} 
                        onChange={(e) => setAbout(e.target.value)} 
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                    ></textarea>
                </div>

                {/* Address Field */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <button 
                            type="button" 
                            onClick={() => setOpen(!open)}
                            className="text-gray-500 hover:text-blue-500 transition"
                        >
                            <CiEdit size={20} />
                        </button>
                    </div>
                    
                    <div 
                        onClick={() => setOpen(!open)}
                        className={`w-full px-4 py-2 border ${open ? 'border-blue-300' : 'border-gray-200'} rounded-lg flex items-center cursor-pointer hover:border-blue-300 transition`}
                    >
                        <FiMapPin className="text-gray-400 mr-2" />
                        <span className="text-gray-700">
                            {address?.street ? `${address.street}, ${address.city}` : 'Add your location'}
                        </span>
                    </div>

                    {open && (
                        <div className="mt-2">
                            <AddressSelectorUser 
                                onAddressSelect={(newAddress) => {
                                    setAddress(newAddress);
                                    setOpen(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium shadow-sm"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;