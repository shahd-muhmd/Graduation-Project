import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowBack } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; 

const ResetPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';
  const otpCode = location.state?.otpCode || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputStyle = "w-full bg-[#E8EBED] border border-transparent focus:border-[#28a745] focus:bg-white rounded-xl px-4 py-3.5 pr-12 text-[15px] outline-none transition-all placeholder:text-gray-500";
  const labelStyle = "block text-sm font-bold text-gray-800 mb-2";

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (cleanPassword !== cleanConfirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const BASE_URL = 'https://electric.lastcode.site/public';
      
      await axios.post(`${BASE_URL}/api/auth/reset-password`, null, {
        params: {
          email: email,
          otp: otpCode,
          password: cleanPassword,
          password_confirmation: cleanConfirmPassword
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log("✅ Password reset successfully!");
      
      localStorage.clear(); 
      
      navigate('/auth/signin');

    } catch (error) {
      console.error("❌ Reset Error:", error.response?.data || error.message);
      setErrorMsg('Failed to reset password. Please check your data and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in relative pt-4">
      <button onClick={() => navigate(-1)} className="absolute -top-2 -left-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition text-gray-700">
        <IoIosArrowBack size={18} />
      </button>

      <h2 className="text-xl font-bold text-black mb-1 mt-10">Reset Password</h2>
      <p className="text-gray-500 text-xs mb-8">Enter your new password</p>

      {errorMsg && <div className="bg-red-50 text-red-500 text-xs p-2 rounded-lg mb-3 font-bold text-center border border-red-100">{errorMsg}</div>}

      <form className="flex flex-col gap-5" onSubmit={handleReset}>
        <div>
          <label className={labelStyle}>New password</label>
          <div className="relative">
             <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={inputStyle} 
                required 
             />
             <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
             >
                {showPassword ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
             </button>
          </div>
        </div>
        
        <div>
          <label className={labelStyle}>Confirm new password</label>
          <div className="relative">
             <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className={inputStyle} 
                required 
             />
             <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
             >
                {showConfirmPassword ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
             </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3.5 text-white rounded-xl font-bold transition mt-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#28a745] hover:bg-green-700'}`}
        >
          {isLoading ? 'Confirming...' : 'Confirm'}
        </button>
      </form>
    </div>
  );
};

export default ResetPass;