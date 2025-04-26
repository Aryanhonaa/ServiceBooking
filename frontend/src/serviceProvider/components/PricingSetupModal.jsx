import { useState } from 'react';
import { FaTimes, FaDollarSign, FaClock, FaInfoCircle, FaCheck, FaBoxes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import serviceP from '../../store/ServiceProviderStore';
import userStore from '../../store/UserStore';

const PricingSetupModal = ({ currentPricing, onSave, onClose, darkMode }) => {
  const{updatePrice}=serviceP();
  const {authUser}=userStore();
  let parsedCurrentPricing = {};
  try {
    parsedCurrentPricing = typeof currentPricing === 'string' ? JSON.parse(currentPricing) : currentPricing;
  } catch (error) {
    console.error("Error parsing currentPricing:", error);
  }

  const [pricing, setPricing] = useState(parsedCurrentPricing);
  const [activeTab, setActiveTab] = useState('basic');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPricing({ ...pricing, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const id=authUser._id
    const data= {id,pricing}
    try{
      const res=await updatePrice(data);
    }catch(err){
      console.error(err);
    }
  };

  const hasChanges = JSON.stringify(parsedCurrentPricing) !== JSON.stringify(pricing);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black/70' : 'bg-black/50'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-2xl rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaDollarSign className="text-yellow-500 mr-2" />
            Service Pricing Setup
          </h2>

          {/* Current & Updated Pricing Summary */}
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-medium mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-yellow-500" />
              Current Pricing Configuration
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Model:</span>{" "}
                {parsedCurrentPricing.pricingType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
              </p>
              {parsedCurrentPricing.pricingType === 'fixed' && parsedCurrentPricing.fixedPrice && (
                <p>
                  <span className="font-medium">Price:</span> ₹{parsedCurrentPricing.fixedPrice}
                </p>
              )}
              {parsedCurrentPricing.pricingType === 'hourly' && parsedCurrentPricing.hourlyRate && (
                <p>
                  <span className="font-medium">Rate:</span> ₹{parsedCurrentPricing.hourlyRate}/hr (min {parsedCurrentPricing.minHours} hrs)
                </p>
              )}
            </div>

            <h3 className="mt-4 font-medium mb-2 flex items-center">
              <FaBoxes className="mr-2 text-green-500" />
              Updated Pricing Preview
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Model:</span>{" "}
                {pricing.pricingType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
              </p>
              {pricing.pricingType === 'fixed' && pricing.fixedPrice && (
                <p>
                  <span className="font-medium">Price:</span> ₹{pricing.fixedPrice}
                </p>
              )}
              {pricing.pricingType === 'hourly' && pricing.hourlyRate && (
                <p>
                  <span className="font-medium">Rate:</span> ₹{pricing.hourlyRate}/hr (min {pricing.minHours} hrs)
                </p>
              )}
            </div>

            {!hasChanges && <p className="text-xs text-gray-400 italic mt-2">No changes made.</p>}
          </div>

          {/* Tab Switch (you can add more tabs later) */}
          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium flex items-center ${activeTab === 'basic' ? 'border-b-2 border-yellow-500' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                <FaDollarSign className="mr-2" />
                Basic Pricing
              </button>
            </div>
          </div>

          {/* Basic Pricing Form */}
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
                        <span className="mr-2">₹</span>
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
                          <span className="mr-2">₹</span>
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

          {/* Footer Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <motion.button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCheck className="mr-2" />
              Save Pricing
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingSetupModal;
