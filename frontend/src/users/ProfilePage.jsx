import React, { useState, useRef } from 'react';
import userStore from '../store/UserStore';

const ProfilePage = () => {
    const { authUser, updateProfile } = userStore();
    
    const [name, setName] = useState(authUser.name || '');
    const [email, setEmail] = useState(authUser.email || '');
    const [image, setImage] = useState(authUser.image || null);
    const [about, setAbout] = useState(authUser.about || '');
    const [street, setStreet] = useState(authUser.address?.street || '');
    const [city, setCity] = useState(authUser.address?.city || '');

    const fileInputRef = useRef();

    const handleImageChange = (e) => {
        setImage (e.target.files[0]);
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('about', about);
            formData.append('street', street);
            formData.append('city', city);

            if (image) {
                formData.append('image', image);  // Append the image file to the form data
            }
            
            await updateProfile(formData);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>Welcome to Profile</h1>

            <form onSubmit={handleSubmit}>
                <img src={image || authUser.image} alt="Profile" className="w-48 h-48 object-cover rounded-md" />

                <label>Name:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />

                <label>Email:</label>
                <input 
                    type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <label>About:</label>
                <input 
                    type="text" 
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)} 
                />

                <label>Address</label><br />
                <label>Street:</label>
                <input 
                    type="text" 
                    value={street} 
                    onChange={(e) => setStreet(e.target.value)} 
                />

                <label>City:</label>
                <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                />

                <label htmlFor="ProfilePic">Profile Picture</label>
                <div>
                    <button type="button" onClick={() => fileInputRef.current.click()}>
                        Upload Image
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                <div>{authUser.role}</div>
                {image && (
                    <div>
                        <img src={image} alt="Profile" className="w-48 h-48 object-cover rounded-md" />
                    </div>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ProfilePage;
