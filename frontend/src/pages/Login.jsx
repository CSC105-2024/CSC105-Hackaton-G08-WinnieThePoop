import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Logo from '../assets/LogoF.svg';
import Hidden from '../assets/HiddenIcon.svg';
import Reveal from '../assets/showIcon.svg';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function Login() {
  const navigate = useNavigate();
  const [users] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const userSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(7, 'Incorrect password!'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(userSchema) });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', data);
      const { token } = response.data;
  
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      const userId = decoded.id; 
  
      localStorage.setItem('userId', userId);
  
      console.log('User ID:', userId); // or use it however you want
  
      navigate('/home');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid email or password!');
      } else {
        alert('Something went wrong. Please try again later.');
      }
    }
  };
  

  useEffect(() => {
    if (users.length > 0) {
      navigate('/home');
    }
  }, [users, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        {/* Logo */}
        <div>
          <img className="w-[120px] h-[120px] sm:w-[135px] sm:h-[135px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] 
            transition-all duration-200 ease-in-out transform" src={Logo} alt="Logo" />
        </div>

        {/* Welcome Message */}
        <div className="flex flex-col justify-center items-center font-poppins text-honeyPot mt-2 sm:mt-2 md:mt-3 lg:mt-4 sm: text-xl md:text-2xl lg:text-[32px]
        transition-all duration-200 ease-in-out transform">
          <div className="font-black">Welcome back Poo-kie! </div>
          <div className="-mt-2 font-black">Ready to drop some data?</div>
        </div>

        {/* Login Title */}
        <div className="font-poppins font-black sm:text-base md:text-xl lg:text-[24px] text-poohShirt my-6 sm:my-6 md:my-5 lg:my-[20px] 
        transition-all duration-200 ease-in-out transform ">LOGIN</div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[427px] flex flex-col items-center 
        transition-all duration-200 ease-in-out transform">
          <div className="font-poppins w-full">
            <p className="text-[13px] sm:text-[13px] md:text-[14px] lg:text-[15px] mb-[3px]">Email</p>
            <input
              {...register('email')}
              placeholder="example@mail.com"
              className="w-full h-[35px] sm:h-[35px] md:h-[37px] lg:h-[40px] border-2 rounded-[8px] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px] pl-3"
            />
            {errors.email && <p className="text-red-500 text-xs sm:text-xs md:text-xs lg:text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="font-poppins mt-[29px] w-full relative">
            <p className="text-[13px] sm:text-[13px] md:text-[14px] lg:text-[15px] mb-[3px]">Password</p>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password"
              className="w-full h-[35px] sm:h-[35px] md:h-[37px] lg:h-[40px] border-2 rounded-[8px] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px] pl-3" 
            />
            {/* encrypt */}
            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 cursor-pointer top-[41px] sm:top-[41px] md:top-[43px] lg:top-[45px] transform -translate-y-1/2 hover:scale-105">
              {showPassword ? (
                <img src={Reveal} alt="Hide Password" className="w-4 h-4 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 
                transition-all duration-200 ease-in-out transform" />
              ) : (
                <img src={Hidden} alt="Show Password" className="w-4 h-4 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 
                transition-all duration-200 ease-in-out transform" />
              )}
              </button>
            {errors.password && <p className="text-red-500 text-xs sm:text-xs md:text-xs lg:text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* login Button */}
          <div className="mt-[21px] w-full flex justify-center">
            <button
              type="submit"
              className="w-[140px] h-[35px] text-xs md:w-[150px] md:h-[40px] md:text-sm lg:w-[180px] lg:h-[40px]  lg:text-base rounded-[4px] bg-honeyGold font-poppins font-semibold border-2 
                transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer">
              Login
            </button>
          </div>

          {/* signup Link */}
          <div className="mt-2 text-center font-poppins text-[13px] sm:text-[13px] md:text-[14px] lg:text-[15px]
          transition-all duration-200 ease-in-out transform cursor-pointer ">
            <span>Don't have an account? </span>
            <NavLink
              to="/signup"
              className="text-honeyPot hover:underline">
              Sign Up
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;