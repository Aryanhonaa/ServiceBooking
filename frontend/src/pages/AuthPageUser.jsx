import React from 'react';
import LoginUser from '../components/LoginUser';
import SignupUser from '../components/SignupUser';
import AuthImg from '../assets/Authimg.jpg'; // Ensure this path is correct
import userStore from '../store/UserStore';

const AuthPageUser = () => {
  const { isLogin, toggleLogin } = userStore();

  return (
    <main className="relative h-screen w-full">
      {/* Fullscreen Background Image */}
      <img
        src={AuthImg}
        alt="Authentication Background"
        className="absolute inset-0 w-full h-full object-cover"
      />


      <div className="absolute left-10 mt-96 transform -translate-y-1/2 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-96 ml-24">
        <h1 className="text-3xl font-bold text-gray-800 text-center"> 
          {isLogin ? 'Welcome Back!' : 'Join Us' }
        </h1>
        <p className="text-gray-500 mt-2 text-center">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </p>

        {/* Authentication Form */}
        <div className="mt-6">{isLogin ? <LoginUser /> : <SignupUser />}</div>

        {/* Toggle Between Login and Signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "New to Swipe?" : "Already have an account?"}
          </p>
          <button
            onClick={toggleLogin}
            className="mt-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg transition duration-300 hover:bg-blue-600"
          >
            {isLogin ? "Create a new account" : "Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AuthPageUser;
