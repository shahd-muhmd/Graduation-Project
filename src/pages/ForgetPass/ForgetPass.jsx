import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowBack } from "react-icons/io";

const ForgetPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const BASE_URL = 'https://electric.lastcode.site/public';
      
      await axios.post(`${BASE_URL}/api/auth/verify-email-reset`, null, {
        params: { email: email }
      });

      navigate('/auth/otp', { state: { email: email } });

    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMsg('Failed to send code. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in relative pt-4">
      <button onClick={() => navigate(-1)} className="absolute -top-2 -left-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition text-gray-700">
        <IoIosArrowBack size={18} />
      </button>

      <h2 className="text-xl font-bold text-black mb-1 mt-10">Forgot Password</h2>
      <p className="text-gray-500 text-xs mb-8">Please enter your email to reset the password</p>

      {errorMsg && <div className="bg-red-50 text-red-500 text-xs p-2 rounded-lg mb-3 font-bold text-center border border-red-100">{errorMsg}</div>}

      <form onSubmit={handleSendCode} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Email</label>
          <input 
            type="email" 
            placeholder="example@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#E8EBED] border border-transparent focus:border-[#28a745] focus:bg-white rounded-xl px-4 py-3.5 text-[15px] outline-none transition-all placeholder:text-gray-500" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3.5 text-white rounded-xl font-bold transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#28a745] hover:bg-green-700'}`}
        >
          {isLoading ? 'Sending...' : 'Confirm'}
        </button>
      </form>
    </div>
  );
};

export default ForgetPass;