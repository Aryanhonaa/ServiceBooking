import { useState, useEffect } from "react";
import { axiosInstance } from "../../config/axios";
import userStore from "../../store/UserStore";
import serviceP from "../../store/ServiceProviderStore";

const SetAvailability = () => {
  const { authUser } = userStore();
  const { darkMode } = serviceP();
  const [schedule, setSchedule] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(true);

  const providerId = authUser._id;

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/serviceprovider/get-time-table?providerId=${providerId}`
        );
        setSchedule(data.schedule || {});
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const toggleSlot = (day, time) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day]?.some((slot) => slot.time === time)
        ? prev[day].filter((slot) => slot.time !== time) // Remove if already selected
        : [...(prev[day] || []), { time, isBooked: false, bookedBy: null }], // Add if not selected
    }));
  };

  const handleSubmit = async () => {
    const formattedSchedule = Object.fromEntries(
      Object.entries(schedule).map(([day, slots]) => [
        day,
        slots.map((slot) => ({
          time: slot.time,
          isBooked: slot.isBooked ?? false,
          bookedBy: slot.bookedBy ?? null,
        })),
      ])
    );

    console.log(
      "Formatted Data Sending:",
      JSON.stringify({ providerId, schedule: formattedSchedule }, null, 2)
    );
    try {
      const response = await axiosInstance.post(
        "/serviceprovider/set-time-table",
        { providerId, schedule: formattedSchedule }
      );
      console.log(response.data);
      alert("Availability updated successfully!");
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability.");
    }
  };

  return (
    <>
  
    <div
      className={`p-6 max-w-md mx-auto shadow-lg rounded-lg transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 text-white shadow-gray-900"
          : "bg-white text-black shadow-gray-200"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Set Your Availability</h2>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Select Day */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className={`w-full px-4 py-2 text-lg border rounded-lg text-center tracking-widest focus:outline-none focus:ring-2 transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-gray-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Day</option>
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* Available Time Slots */}
          {selectedDay && (
            <div className="mb-4 mt-4">
              <h3 className="text-md font-medium mb-3 text-center">{selectedDay} Slots</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "8:00 AM",
                  "9:00 AM",
                  "10:00 AM",
                  "11:00 AM",
                  "12:00 PM",
                  "1:00 PM",
                  "2:00 PM",
                  "3:00 PM",
                  "4:00 PM",
                  "5:00 PM",
                  "6:00 PM",
                  "7:00 PM",
                  "8:00 PM",
                  "9:00 PM",
                ].map((time) => (
                  <button
                    key={time}
                    className={`p-2 text-sm rounded transition-all duration-300 transform hover:scale-105 ${
                      schedule[selectedDay]?.some((slot) => slot.time === time)
                        ? "bg-green-500 text-white shadow-green-600"
                        : darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => toggleSlot(selectedDay, time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Availability */}
          <button
            onClick={handleSubmit}
            className={`w-full p-2 rounded mt-4 transition-all duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Save Availability
          </button>
        </>
      )}
    </div>

    {/* Display All Selected Time Slots for the Entire Week */}
    <div className={`mt-10 ${darkMode ? "text-white" : "text-black"}`}>
      <h3 className="text-xl font-semibold mb-4 text-center">All Selected Time Slots</h3>
      <div
        className={`${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        } p-6 rounded-lg shadow-lg transition-all duration-300`}
      >
        {Object.entries(schedule).map(([day, slots]) => (
          <div key={day} className="mb-4">
            <h4 className="font-medium text-lg mb-2">{day}</h4>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <span
                  key={slot.time}
                  className="px-3 py-1 bg-blue-400 text-white rounded-md text-sm transition-all duration-300 transform hover:scale-105"
                >
                  {slot.time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
};

export default SetAvailability;
