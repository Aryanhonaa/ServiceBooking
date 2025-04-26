import React, { useEffect, useState } from 'react';
import SideBarS from './components/SideBarS';
import serviceP from '../store/ServiceProviderStore';
import userStore from '../store/UserStore';
import { toast } from 'react-toastify';
import Loading from '../pages/Loading';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Appointment = () => {
  const { darkMode, pendingRequests,  } = serviceP();
  const { authUser } = userStore();
  const providerId = authUser?._id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(8);

  console.log("Appointments",data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pendingRequests(providerId);
        console.log("res", res);
        if (res.success) {
          setData(res.data);
        } else {
          toast.error("Failed to fetch Appointments!");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchData();
    }
  }, [providerId]);

  const renderStatus = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="text-green-600 flex items-center"><FaCheckCircle className="mr-2" /> Accepted</span>;
      case 'rejected':
        return <span className="text-red-600 flex items-center"><FaTimesCircle className="mr-2" /> Rejected</span>;
      default:
        return <span className="text-yellow-500 flex items-center"><FaClock className="mr-2" /> Pending</span>;
    }
  };


  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = data.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-100 to-gray-200"} flex min-h-screen`}>
  <SideBarS />
  <div className="p-6 w-full">
    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-500">Appointments</h1>
    {data.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse rounded-lg overflow-hidden shadow-2xl">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} text-left`}>
              <th className={`px-6 py-4  font-semibold text-gray-500 ${darkMode? "text-gray-200":""}`}>Provider Name</th>
                <th className={`px-6 py-4  font-semibold text-gray-500 ${darkMode? "text-gray-200":""}`}>Booking Date</th>
                <th className={`px-6 py-4  font-semibold text-gray-500 ${darkMode? "text-gray-200":""}`}> Slot</th>
                <th className={`px-6 py-4  font-semibold text-gray-500 ${darkMode? "text-gray-200":""}`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment) => (
              <tr
                key={appointment._id}
                className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} transition-colors duration-200`}
              >
                <td className="px-6 py-4 border-t border-gray-600 dark:border-gray-700">
                  <Link
                    to={`/user/${appointment._id}/${encodeURIComponent(appointment.user)}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    {appointment?.userName || "Unknown"}
                  </Link>
                </td>
                <td  className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 ${darkMode? "text-white":""}`}>
                  {new Date(appointment.date).toLocaleDateString()}
                </td>
                <td className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 ${darkMode? "text-white":""}`}>
                  {appointment.slot}
                </td>
                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 font-semibold">
                  {renderStatus(appointment.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(data.length / appointmentsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded transition-colors duration-200 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">No appointments found.</p>
    )}
  </div>
</div>
  );
};

export default Appointment;
