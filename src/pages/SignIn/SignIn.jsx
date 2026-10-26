import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; 

const Signin = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = "w-full bg-[#E8EBED] border border-transparent focus:border-[#28a745] focus:bg-white rounded-xl px-4 py-2.5 text-[14px] outline-none transition-all placeholder:text-gray-500";
  
  const errorInputStyle = "w-full bg-red-50 border border-red-400 focus:border-red-500 rounded-xl px-4 py-2.5 text-[14px] text-red-700 outline-none transition-all placeholder:text-gray-500";
  
  const labelStyle = "block text-sm font-bold text-gray-800 mb-1.5";

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrorMsg('');

    try {
      const BASE_URL = 'https://electric.lastcode.site/public';
      
      const response = await axios.post(`${BASE_URL}/api/auth/login`, null, {
        params: {
          email: email,
          password: password
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      const token = response.data.data;
      if (token) {
         localStorage.setItem('token', token);
      }

      navigate('/home');

    } catch (error) {
      console.error("Login Error:", error);
      setErrorMsg('Password is incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-[#28a745] text-4xl font-black mb-4 font-serif tracking-wide">Esave</h1>
      
      <h2 className="text-xl font-bold text-black mb-1">Welcome Back</h2>
      <p className="text-gray-500 text-xs mb-5">Continue saving electricity with Esave</p>

      <form className="flex flex-col gap-3" onSubmit={handleLogin}>
        <div>
          <label className={labelStyle}>Email</label>
          <input 
            type="email" 
            placeholder="example@gmail.com" 
            className={inputStyle} 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMsg('');
            }}
            required 
          />
        </div>

        <div>
          <label className={labelStyle}>Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              className={`${errorMsg ? errorInputStyle : inputStyle} pr-12`} 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${errorMsg ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>
          {errorMsg && (
            <p className="text-[#ff5252] text-[12px] font-medium mt-1.5 ml-1">{errorMsg}</p>
          )}

          <div className="text-right mt-1.5">
            <Link to="/auth/forgot-password" align="right" className="text-xs font-bold text-gray-700 hover:text-[#28a745] transition underline decoration-gray-400">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3 text-white rounded-xl font-[Poppins] font-bold transition mt-1 text-[15px] ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#28a745] hover:bg-green-700'}`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="flex items-center gap-4 my-1 opacity-60">
          <div className="h-[1px] bg-gray-400 flex-1"></div>
          <span className="text-[11px] text-gray-500 font-medium">Or Sign in With</span>
          <div className="h-[1px] bg-gray-400 flex-1"></div>
        </div>

        <div className="flex justify-center gap-5 mt-1">
          <button type="button" className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
            <FcGoogle size={22} />
          </button>
          <button type="button" className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
            <FaFacebook size={22} className="text-[#1877F2]" />
          </button>
        </div>

        <p className="text-center text-[15px] text-gray-700 mt-3 font-medium">
          Don't have an account? <Link to="/auth/signup" className="text-[#28a745] font-bold hover:underline ml-1">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;