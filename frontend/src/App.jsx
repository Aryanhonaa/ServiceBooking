import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import userStore from './store/UserStore';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import AuthPageUser from './pages/AuthPageUser';
import Footer from './components/Footer';
import HomepageU from './users/HomepageU';
import ProfilePage from './users/ProfilePage';
import ProtectRoute from './middleware/ProtectRoute';
import ServicePHome from './pages/ServicePHome';
import Contact from './pages/Contact';
import HomepageServiceProvider from './serviceProvider/HomepageServiceProvider';
import Home from './admin/Page/Home';
import Category from './admin/Page/Category';
import ServiceProviders from './admin/Page/ServiceProviders';
import ValidateService from './admin/Page/ValidateService';
import Contacts from './admin/Page/Contacts';
import ProfileService from './serviceProvider/ProfileService';
import Appointment from './serviceProvider/Appointment';
import ViewProv from './users/ViewProv';
import ProvProfile from './users/ProvProfile';
import Loading from './pages/Loading';
import Services from './users/Services';
import ViewUser from './serviceProvider/components/ViewUser';
import Service from './pages/Service';
import OngoingAppointmet from './serviceProvider/OngoingAppointmet';
import Bookings from './users/Bookings';
import History from './serviceProvider/History';
import Earning from './serviceProvider/Earning';
import ViewService from './users/ViewService';
import Reviews from './serviceProvider/Reviews';
import Users from './admin/Page/Users';
import ViewServiceProvider from './admin/Page/ViewServiceProvider';
import ViewProvider from './admin/Component/ViewProviders';

const App = () => {
  const { authUser, checkAuth } = userStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      await checkAuth();  // ✅ Wait for authentication check
      setLoading(false);   // ✅ Only render routes after check
    };

    fetchAuth();
  }, []);

  console.log(authUser);

  // ✅ Show loading indicator while checking authentication
  if (loading) {
    return <Loading/>;
  }

  return (
    <>
      <Navigation />
      <Routes>

      <Route
          path="/"
          element={
            !authUser ? (
              <Homepage />
            ) : authUser.role === 'Admin' ? (
              <Navigate to="/admin" />
            ) : authUser.role === 'User' ? (
              <Navigate to="/homepage/user" />
            ) : (
              <Navigate to="/homepage/service-provider" />
            )
          }
        />

      {!authUser && (
          <>
            
            <Route path="/auth" element={<AuthPageUser />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/service-provider" element={<ServicePHome />} />
            <Route path='/service' element={<Service/>}></Route>
          </>
        )}
       
       

        {/* Protected Routes */}
        {authUser?.role === 'User' && (
          <Route element={<ProtectRoute />}>
            <Route path='/homepage/user' element={<HomepageU />} />
            <Route path='/profile/user' element={<ProfilePage />} />
            <Route path='/services' element={<Services/>}></Route>
            <Route path="/service/providers/:specialityName" element={<ViewProv />} />
            <Route path='/profile/service-provider/:id' element={<ProvProfile/>}></Route>
            <Route path='/bookings' element={<Bookings/>}></Route>
            <Route path='/view-booking-details/:id' element={<ViewService/>}></Route>
          </Route>
        )}

        {authUser?.role === 'ServiceProvider' && (
          <Route element={<ProtectRoute />}>
            <Route path='/homepage/service-provider' element={<HomepageServiceProvider />} />
            <Route path='/profile/service-provider' element={<ProfileService/>}></Route>
            <Route path='/appointment/service-provider' element={<Appointment/>}></Route>
            <Route path='/appointment/upcoming/service-provider' element={<OngoingAppointmet/>}></Route>
            <Route path='/user/:id/:name' element={<ViewUser/>}/>
            <Route path='/history-appointments' element={<History/>}></Route>
            <Route path='/earnings' element={<Earning/>}></Route>
            <Route path='/reviews' element={<Reviews/>}></Route>

          </Route>
        )}



{authUser?.role ==='Admin' && (
  
  <Route element={<ProtectRoute/>}>
    
<Route element={<Home/>} path='/admin'></Route>
<Route element={<Category/>} path='/admin/category'></Route>
<Route element={<ServiceProviders/>} path='/admin/service-providers'></Route>
<Route element={<ValidateService/>} path='/admin/service-providers/details/:data'></Route>
<Route element={<Contacts/>}  path='/admin/contacts'></Route>
<Route element={<Users/>}  path='/admin/users'></Route>
<Route element={<ViewServiceProvider/>} path='/admin/view-serviceProvider'></Route>
<Route element={<ViewProvider/>} path='/admin/view/:id'> </Route>
  </Route>

  
)}


        <Route path='*' element={<div>Page Not Found</div>} />
      </Routes>
      <Footer />

      
    </>
  );
};

export default App;
