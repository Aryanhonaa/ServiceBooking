import React, { useState } from 'react';
import authUserStore from '../../store/admin';
import { toast } from 'react-toastify';

const AddCategory = () => {
    const [name, setName] = useState("");
    const [categoryImage, setCategoryImage] = useState(null);
    const [specialityImg, setSpecialityImg] = useState("");
    const [specialityName, setSpecialityName] = useState("");
    const [detail,setDetail]=useState("");
    const { addCategory } = authUserStore();
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

    const handleImg = (e) => {
        setCategoryImage(e.target.files[0]);
        console.log(e.target.files[0]);
    };

    const handleSpecialityImg = (e) => {
        setSpecialityImg(e.target.files[0]);
        console.log(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          
          if(!name || !categoryImage ){
            toast.error("Please fill the category fields");
          }
            // Show confirmation modal
            setIsModalVisible(true);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleConfirm = async () => {
        // Proceed with the actual category addition logic after confirmation
        const formData = new FormData();
        formData.append("name", name);
        formData.append("categoryImage", categoryImage);
        formData.append("specialityName", specialityName);
        formData.append("specialityImg", specialityImg);

        try {
           const res= await addCategory(formData);
            setName("");
            setCategoryImage(null);
            setSpecialityImg("");
            setSpecialityName("");
            toast.success("New Category Added SuccessFully");
        } catch (err) {
            console.error('Error:', err);
        }

        // Close the modal after confirmation
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        // Close modal without taking any action
        setIsModalVisible(false);
    };

    const imagePreview = categoryImage ? URL.createObjectURL(categoryImage) : null;
    const image2Preview = specialityImg ? URL.createObjectURL(specialityImg) : null;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='mt-6 flex flex-col'>
                    <label>Enter Name (Category): </label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter Name of Category'
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className='mt-6 flex flex-col'>
                    <label>Upload Img (Category): </label>
                    <input type='file' onChange={handleImg} name='categoryImage' />
                    {imagePreview && <img src={imagePreview} alt="Category Preview" className="mt-2 image-preview w-72 h-52" />}
                </div>

                <div className='mt-6 flex flex-col'>
                    <label>Enter Speciality Name: </label>
                    <input
                        type='text'
                        value={specialityName}
                        onChange={(e) => setSpecialityName(e.target.value)}
                        placeholder='Enter Speciality name'
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className='mt-6 flex flex-col'>
                    <label>Upload Speciality Img: </label>
                    <input type='file' onChange={handleSpecialityImg} />
                    {image2Preview && <img src={image2Preview} alt="Speciality Preview" className="mt-2 image-preview w-80 h-52" />}
                </div>

                <button type='submit' className='cursor-pointer bg-slate-600 px-9 py-4 rounded-xl mt-7 text-white'>
                    Submit
                </button>
            </form>

            {/* Confirmation Modal */}
            {isModalVisible && (
                <div className="absolute bottom-0 mb-64 left-1/2 transform -translate-x-1/2 px-14 py-12 bg-gray-100 rounded-md shadow-lg">
                    <h1 className="text-xl font-semibold">Are You Sure?</h1>
                    <div className='flex justify-between mt-8'>
                        <button
                            onClick={handleConfirm}
                            className='bg-red-700 text-white px-6 py-2 rounded-lg cursor-pointer'
                        >
                            Yes
                        </button>
                        <button
                            onClick={handleCancel}
                            className='bg-gray-700 text-white px-6 py-2 rounded-lg cursor-pointer'
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCategory;
