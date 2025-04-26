import React, { useState } from 'react';
import userStore from '../../store/UserStore';
import { FaTimes, FaDollarSign, FaClock, FaInfoCircle, FaCheck, FaBoxes , FaBriefcase} from 'react-icons/fa';
import serviceP from '../../store/ServiceProviderStore';
import { toast } from 'react-toastify';

const Certify = () => {
  const { authUser } = userStore();
  const { sendCertifyData, darkMode } = serviceP();

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [pricing, setPricing] = useState({
    pricingType: '',
    fixedPrice: '',
    hourlyRate: '',
    minHours: '',
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [step,setStep]=useState(1);
  const [experience,setExperience]=useState();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPricing({ ...pricing, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !description || !pricing.pricingType) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('id', authUser._id);
    formData.append('description', description);
    const tagArray = tags.split(',').map(tag => tag.trim());
    formData.append('tags', JSON.stringify(tagArray));
    formData.append('pricing', JSON.stringify(pricing));
    formData.append('experience', experience);

    try {
      setLoading(true);
      const res = await sendCertifyData(formData);
      toast.success('Certification data submitted successfully.')
      // Reset form
      setImage(null);
      setPreviewUrl('');
      setDescription('');
      setTags('');
      setPricing({
        pricingType: '',
        fixedPrice: '',
        hourlyRate: '',
        minHours: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong during submission.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep=async()=>{
    try{
      if(!image || !description || !tags){
        toast.warning("Please fill in all required fields.")
        return ;
      }
      setStep(2)
    }catch(err){
      console.log(err);
    }
  }

  console.log("Pricing",pricing);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-60">
      <div className="bg-gray-50 p-10 shadow-lg rounded-xl w-[1400px] max-w-2xl dark:bg-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-700">
          Become a Certified {authUser?.speciality || 'Provider'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {
            step ===1 &&(
              <>
              <div>
            
              <label className="block font-medium mb-1">Upload Service Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 rounded shadow w-full max-h-48 object-cover"
                />
              )}
            </div>
  
            <div>
              <label className="block font-medium mb-1">Service Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe your service or certification..."
                className="w-full border rounded p-2"
              />
            </div>
  
            <div>
              <label className="block font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. plumbing, certified, experience"
                className="w-full border rounded p-2"
              />
            </div>
            <button className={`px-6 py-3 bg-yellow-400 rounded-3xl font-semibold text-[16px] cursor-pointer ${!image || !description || !tags ? "bg-gray-300":""}`} 
            onClick={handleNextStep}
            type='button'
            >Next</button>
            </>
            )
          }
         
          {
            step ===2 &&(
              <>
              
             {/* Experience */}
<div className="bg-gray-100  py-6 px-4 rounded-xl shadow-sm">
  <h3 className="font-medium mb-4 flex items-center text-gray-800 / text-lg">
    <FaBriefcase className="mr-2 text-yellow-500 text-xl" />
    Experience:
  </h3>

  <input
    type="number"
    onChange={(e)=>setExperience(e.target.value)}
    placeholder="Enter years of experience"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-yellow-200  dark:text-black"
  />
</div>

               <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>

            <h3 className="font-medium mb-2 flex items-center text-gray-800 dark:text-gray-900">
              <FaInfoCircle className="mr-2 text-yellow-500" />
              Current Pricing Configuration
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Model:</span> {pricing.pricingType || 'N/A'}
              </p>
              {pricing.pricingType === 'fixed' && pricing.fixedPrice && (
                <p>
                  <span className="font-medium">Price:</span> Rs {pricing.fixedPrice}
                </p>
              )}
              {pricing.pricingType === 'hourly' && pricing.hourlyRate && (
                <p>
                  <span className="font-medium">Rate:</span> Rs {pricing.hourlyRate}/hour (min {pricing.minHours} hours)
                </p>
              )}
            </div>
          </div>

          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select Pricing Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fixed Price Option */}
                  <label className={`p-4 rounded-lg border cursor-pointer transition-all ${pricing.pricingType === 'fixed' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="pricingType"
                      value="fixed"
                      checked={pricing.pricingType === 'fixed'}
                      onChange={() => setPricing({ ...pricing, pricingType: 'fixed' })}
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${pricing.pricingType === 'fixed' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-400'}`}>
                        {pricing.pricingType === 'fixed' && <FaCheck className="text-white text-xs" />}
                      </div>
                      <div>
                        <h4 className="font-medium">Fixed Price</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Charge a single fixed price</p>
                      </div>
                    </div>
                    {pricing.pricingType === 'fixed' && (
                      <div className="mt-4 flex items-center">
                        <span className="mr-2">Rs</span>
                        <input
                          type="number"
                          name="fixedPrice"
                          value={pricing.fixedPrice}
                          onChange={handleInputChange}
                          placeholder="Enter price"
                          className="flex-1 border-b py-1 px-2 bg-transparent"
                          min="0"
                        />
                      </div>
                    )}
                  </label>

                  {/* Hourly Rate Option */}
                  <label className={`p-4 rounded-lg border cursor-pointer transition-all ${pricing.pricingType === 'hourly' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="pricingType"
                      value="hourly"
                      checked={pricing.pricingType === 'hourly'}
                      onChange={() => setPricing({ ...pricing, pricingType: 'hourly' })}
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${pricing.pricingType === 'hourly' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-400'}`}>
                        {pricing.pricingType === 'hourly' && <FaCheck className="text-white text-xs" />}
                      </div>
                      <div>
                        <h4 className="font-medium">Hourly Rate</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Charge by the hour</p>
                      </div>
                    </div>
                    {pricing.pricingType === 'hourly' && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <span className="mr-2">Rs</span>
                          <input
                            type="number"
                            name="hourlyRate"
                            value={pricing.hourlyRate}
                            onChange={handleInputChange}
                            placeholder="Hourly rate"
                            className="flex-1 border-b py-1 px-2 bg-transparent"
                            min="0"
                          />
                          <span className="ml-2">/ hour</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FaInfoCircle className="mr-2 text-gray-500" />
                          <span>Minimum hours:</span>
                          <input
                            type="number"
                            name="minHours"
                            value={pricing.minHours}
                            onChange={handleInputChange}
                            min="1"
                            className="w-16 border-b py-1 px-2 bg-transparent ml-2"
                          />
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className=' flex justify-between'>
            <button className='px-6 py-3 bg-yellow-400 rounded-3xl font-semibold text-[16px] cursor-pointer' 
            onClick={()=>setStep(1)}
            >
              Back
            </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit for Certification'}
          </button>
          </div>

         
              </>
            )
          }
         
        </form>
      </div>
    </div>
  );
};

export default Certify;
