import React from 'react';
import LoginUser from '../components/LoginUser';
import SignupUser from '../components/SignupUser';
import AuthImg from '../assets/Authimg.jpg';
import userStore from '../store/UserStore';

const AuthPageUser = () => {
  const { isLogin, toggleLogin } = userStore();

  return (
    <main className="relative h-screen w-full">
    
      <img
        src={AuthImg}
        alt="Authentication Background"
        className="absolute inset-0 w-full h-full object-cover blur-sm"
      />

      <div className="absolute inset-0 bg-black/30" />

  
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-96 ml-24 z-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {isLogin ? 'Welcome Back!' : 'Join Us'}
        </h1>
        <p className="text-gray-500 mt-2 text-center">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </p>

        <div className="mt-6">{isLogin ? <LoginUser /> : <SignupUser />}</div>

    
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'New to GharKaam?' : 'Already have an account?'}
          </p>
          <button
            onClick={toggleLogin}
            className="mt-2 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg transition duration-300 hover:bg-yellow-600"
          >
            {isLogin ? 'Create a new account' : 'Sign In'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AuthPageUser;
