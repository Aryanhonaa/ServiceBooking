import React from 'react';
import serviceP from '../store/ServiceProviderStore';
import SideBarS from './components/SideBarS';

const Earning = () => {
    const {darkMode}=serviceP();
  return (
    <div className={`${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-100 to-gray-200"} flex min-h-screen`}>
      <SideBarS/>

      <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-500">Earnings</h1>
      </div>
    </div>
  )
}

export default Earning;
