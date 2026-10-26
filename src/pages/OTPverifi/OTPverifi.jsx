import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import { IoIosArrowBack } from "react-icons/io";

const OTPverifi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email'; 

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false); 

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleConfirm = () => {
    const finalOtp = otp.join('');
    if (finalOtp.length === 6) {
      navigate('/auth/reset-password', { state: { email: email, otpCode: finalOtp } });
    } else {
      alert("Please enter all 6 digits");
    }
  };

  const handleResend = async () => {
    if (!email || email === 'your email') {
      alert("Email not found. Please go back and try again.");
      return;
    }

    setIsResending(true);
    try {
      const BASE_URL = 'https://electric.lastcode.site/public';
      
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, null, {
        params: { email: email },
        headers: { 'Accept': 'application/json' }
      });
      
      alert("✅ A new code has been sent to your email!");
      setOtp(['', '', '', '', '', '']); 
      
    } catch (error) {
      console.error("Resend Error:", error);
      alert("❌ Failed to resend the code. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="animate-fade-in relative pt-4">
      <button onClick={() => navigate(-1)} className="absolute -top-2 -left-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition text-gray-700">
        <IoIosArrowBack size={18} />
      </button>

      <h2 className="text-xl font-bold text-black mb-1 mt-10">OTP Verification</h2>
      <p className="text-gray-500 text-xs mb-8">We have just sent you code via your email<br/><span className="font-bold text-black">{email}</span></p>

      <div className="flex justify-between gap-2 mb-8">
        {otp.map((data, index) => (
          <input 
            key={index} 
            type="text" 
            maxLength="1" 
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
            className="w-12 h-14 bg-[#E8EBED] border border-transparent focus:border-[#28a745] focus:bg-white rounded-xl text-center text-xl font-bold outline-none transition-all" 
          />
        ))}
      </div>

      <button onClick={handleConfirm} className="w-full py-3.5 bg-[#28a745] text-white rounded-xl font-bold hover:bg-green-700 transition mb-4">
        Confirm
      </button>

      <p className="text-center text-xs text-gray-500">
        Didn't receive code?{' '}
        <button 
          onClick={handleResend} 
          disabled={isResending}
          className={`font-bold transition ${isResending ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:underline'}`}
        >
          {isResending ? 'Sending...' : 'Resend code'}
        </button>
      </p>
    </div>
  );
};

export default OTPverifi;