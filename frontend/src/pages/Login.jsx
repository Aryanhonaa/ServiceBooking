import React, { useState } from 'react'
import authUserStore from '../store/authUserStore';
const Login = () => {
     const [state,setState]=useState('Admin');
     const {login}=authUserStore

     const handleLogin=(e)=>{
        e.preventDefault;

     }
  return (
    <form onSubmit={handleLogin}>
      <div>
        <p> 
            <span>{state} </span>
            Login
        </p>

        
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' required placeholder='Enter email'> </input>

        <label htmlFor='password'>Password</label>
        <input id='password' type='password' required placeholder='Enter Password'> </input>
      </div>
      <button type='submit'>Login</button>

    </form>
  )
}

export default Login
