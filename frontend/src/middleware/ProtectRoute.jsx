import React from 'react'
import userStore from '../store/UserStore'
import { Navigate, Outlet } from 'react-router-dom';
const ProtectRoute = () => {
    const {authUser}=userStore();
   return authUser? <Outlet/> : <Navigate to={'/'}></Navigate>
}

export default ProtectRoute;
