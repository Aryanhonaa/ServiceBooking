import React, {useState} from 'react';
import userStore from '../../store/UserStore';
import { toast } from 'react-toastify';

const Rating = ({serviceProvider,appointment }) => {

    console.log("SERVICEPROVI",serviceProvider);
    console.log("APPOINTMENT",appointment);

    const {authUser, sendReviews}=userStore();
    const [rating, setRating] = useState({
        quality: null,
        price: null,
        service: null,
      });

      console.log("Rating",rating);
      const [comment, setComment]= useState("");
    
      const handleSelect = (field, value) => {
        setRating((prev) => ({ ...prev, [field]: value }));
      };
    

      
      const userEmail=authUser.email;

      const firstName=authUser.name;
      const middleName=authUser.middleName;
      const lastName=authUser.lastName;

    const user=authUser._id
      const userName= {firstName, middleName, lastName};
      

      const data= {
        serviceProvider:serviceProvider,
        user:user,
        appointment:appointment,
        rating:rating,
        comment:comment,
        userEmail,
        userName
      }
      const [loading, setLoading]=useState(false);
      const handleSubmit = async(e) => {
        e.preventDefault();
        try{

            if(!rating.price || !rating.quality || !rating.service){
              return  toast.warn("Please fill all fields");
            }
            try {
                setLoading(true);
               const res= await sendReviews(data);
               
                // Optionally reset form
                setRating({ quality: null, price: null, service: null });
                setComment("");
              } catch (err) {
                console.error(err);
                toast.error("Error sending review");
              } finally {
                setLoading(false);
              }
        }catch(err){
            console.log(err);
            toast.error("Error Sending Review");
        }
     
      };

      console.log("CIMM", comment);
  return (
    
       <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-gray-50 to-yellow-50 p-10 rounded-3xl shadow-2xl max-w-3xl mx-auto mt-10 animate-fadeIn"
      id="ratings"
    >
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
        ⭐ Share Your Experience
      </h1>

      {/* Rating Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quality */}
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Quality
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleSelect("quality", num)}
                className={`w-10 h-10 rounded-full border text-lg font-semibold transition ${
                  rating.quality === num
                    ? "bg-yellow-400 text-white"
                    : "bg-white text-gray-700 hover:bg-yellow-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Price
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleSelect("price", num)}
                className={`w-10 h-10 rounded-full border text-lg font-semibold transition ${
                  rating.price === num
                    ? "bg-yellow-400 text-white"
                    : "bg-white text-gray-700 hover:bg-yellow-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Service */}
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Service
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleSelect("service", num)}
                className={`w-10 h-10 rounded-full border text-lg font-semibold transition ${
                  rating.service === num
                    ? "bg-yellow-400 text-white"
                    : "bg-white text-gray-700 hover:bg-yellow-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Box */}
      <div className="mt-8">
        <label className="block mb-2 text-lg font-medium text-gray-700">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          rows="4"
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 shadow-sm"
        />
      </div>

      {/* Submit Button */}
      <div className="mt-10 text-center">
        <button
          type="submit"
          className="bg-yellow-400 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Submit Rating
        </button>
      </div>
    </form>
    
  )
}

export default Rating;
