import React, { useEffect, useState } from 'react';
import Sidebar from '../Component/SideBar';
import { axiosInstance } from '../../config/axios';
import { TiDelete } from 'react-icons/ti';
import { toast } from 'react-toastify';
const Contacts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const contacts = await axiosInstance.get('/admin/getContact');
        if (contacts.data.success) {
          setData(contacts.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  console.log(data.length);

  const handleDelete=async(id)=>{
    try{
        const response=await axiosInstance.delete(`/admin/deleteContact/${id}`);

        if(response.data.success){
            toast.success('Contact deleted successfully');
        }

    }catch(err){
        console.error(err);
        toast.error("Error in removing contact")
    }
  }

  return (
    <div>
      <div className="flex">
        <Sidebar />

        <div className=' flex-1'>
          <div>
            <h1 className="m-4 font-k2d text-2xl font-bold pt-16">Contact</h1>
          </div>

          <div className="bg-black w-full">
            <table className="bg-black w-full border-collapse text-white text-left">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 border border-gray-700">ID</th>
                  <th className="p-3 border border-gray-700">Name</th>
                  <th className="p-3 border border-gray-700">Phone</th>
                  <th className="p-3 border border-gray-700">Message</th>
                  <th className="p-3 border border-gray-700">Delete</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-5 text-center text-gray-400">
                      Loading contacts...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index} className="even:bg-gray-700 odd:bg-gray-900">
                      <td className="p-3 border border-gray-700">{index + 1}</td>
                      <td className="p-3 border border-gray-700">{item.name}</td>
                      <td className="p-3 border border-gray-700">{item.number}</td>
                      <td className="p-3 border border-gray-700">{item.message}</td>
                      <td className="p-3 border border-gray-700">
                        <TiDelete
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          size={30}
                          onClick={() => handleDelete(item._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-5 text-center text-gray-400">
                      No Contacts Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
