import React from 'react'
import Sidebar from '../Component/SideBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


const Home = () => {
  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400,age:9 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210, age:12},
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210, age:20},
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210, age:9},
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210, age:1},
  ];


const datas = [
  { month: 'Jan', bookings: 120 },
  { month: 'Feb', bookings: 150 },
  { month: 'Mar', bookings: 90 },
  { month: 'Apr', bookings: 180 },
];
  return (
    <div>
      <Sidebar/>

      <div className="flex flex-col items-center p-6">
  <h2 className="text-xl font-bold mb-4">Dashboard Chart</h2>
  <ResponsiveContainer width="90%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="age" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
</div>
     <h1>hahah</h1>

     <ResponsiveContainer width="100%" height={300}>
    <LineChart data={datas}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
    </div>
  )
}

export default Home;
