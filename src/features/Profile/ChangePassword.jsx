import React, { useState } from 'react';
import axios from 'axios';
import { IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircle } from "react-icons/io5"; 

const ChangePassword = () => {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const inputStyle = "w-full bg-gray-200 border border-transparent focus:border-[#28a745] focus:bg-white rounded-xl px-4 py-3.5 pr-12 text-base text-black outline-none transition-all";
  const labelStyle = "block text-base font-bold text-black mb-2 ml-1";
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const BASE_URL = 'https://electric.lastcode.site/public';

      await axios.post(`${BASE_URL}/api/profile/change-password`, null, {
        params: {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccessMsg("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (error) {
      console.error("Error changing password:", error);

      const serverMsg = error.response?.data?.message || "";

      if (serverMsg.includes("current password is incorrect")) {
        setErrorMsg("The current password you entered is incorrect.");
      } else if (error.response?.status === 422) {
        setErrorMsg("Please check your new password requirements.");
      } else {
        setErrorMsg("Failed to update password. Please try again.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-md mx-auto relative">
      {successMsg && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3.5 bg-white border border-gray-100 shadow-2xl rounded-full px-7 py-3.5 animate-fade-in">
          <IoCheckmarkCircle className="text-[#28a745]" size={28} />
          <p className="text-gray-800 text-[15.5px] font-semibold">{successMsg}</p>
        </div>
      )}

      <h2 className="text-xl font-bold text-black text-center mb-8">Change password</h2>
      
      {errorMsg && <p className="text-red-500 text-center mb-4 text-sm font-bold">{errorMsg}</p>}

      <form className="flex flex-col gap-6" onSubmit={handleUpdatePassword}>
        
        <div>
          <label className={labelStyle}>Current password</label>
          <div className="relative">
            <input 
              type={showPassword.current ? "text" : "password"} 
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setErrorMsg(''); }}
              className={inputStyle} 
              required
            />
            <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition">
              {showPassword.current ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelStyle}>New password</label>
          <div className="relative">
            <input 
              type={showPassword.new ? "text" : "password"} 
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
              className={inputStyle} 
              required
            />
            <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition">
              {showPassword.new ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelStyle}>Confirm new password</label>
          <div className="relative">
            <input 
              type={showPassword.confirm ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
              className={inputStyle} 
              required
            />
            <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition">
              {showPassword.confirm ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`px-10 py-3.5 text-white rounded-xl font-bold text-base transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#28a745] hover:bg-green-700'}`}
          >
            {isLoading ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;