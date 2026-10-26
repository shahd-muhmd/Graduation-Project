import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { BiUser, BiLockAlt, BiCreditCard, BiBell, BiLogOut } from "react-icons/bi";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('master_notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const getTabClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl transition text-base font-bold ${
      isActive ? 'text-[#28a745] bg-white shadow-sm' : 'text-black hover:bg-gray-200'
    }`;
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('master_notifications', JSON.stringify(newState));
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => { setShowLogoutModal(false); setIsClosing(false); }, 250);
  };

  const handleConfirmLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const BASE_URL = 'https://electric.lastcode.site/public';

      if (token) {
        await axios.post(`${BASE_URL}/api/logout`, {}, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Error logging out from server:", error);
    } finally {
    
      setIsClosing(true);
      setTimeout(() => {
        setShowLogoutModal(false);
        setIsClosing(false);
        localStorage.removeItem('token');
        navigate('/auth/signin');
      }, 250);
    }
  };

  return (
    <div className="w-full flex justify-center items-start pt-4 relative">
      <div className="bg-[#f4f6f8] rounded-[30px] flex flex-col md:flex-row w-full max-w-4xl min-h-[550px] overflow-hidden shadow-sm">
        
        <div className="w-full md:w-[35%] p-8 border-r border-gray-200 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-black text-center mb-6">Profile</h2>
          
          <div className="flex flex-col gap-4">
            <button onClick={() => navigate('personal')} className={getTabClass('personal')}>
              <BiUser className="text-2xl" /> Personal information
            </button>

            <button onClick={() => navigate('password')} className={getTabClass('password')}>
              <BiLockAlt className="text-2xl" /> Change password
            </button>

            <button onClick={() => navigate('payments')} className={getTabClass('payments')}>
              <BiCreditCard className="text-2xl" /> Payments
            </button>

            <div className="flex items-center justify-between px-4 py-3.5 text-base font-bold text-black">
              <div className="flex items-center gap-3">
                <BiBell className="text-2xl text-black" /> Notification
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationsEnabled} 
                  onChange={handleToggleNotifications} 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
              </label>
            </div>

            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition text-base font-bold text-[#ff5252] hover:bg-red-50 mt-2"
            >
              <BiLogOut className="text-2xl" /> Log out
            </button>
          </div>
        </div>

        <div className="w-full md:w-[65%] p-10 flex flex-col justify-start">
          <Outlet />
        </div>

      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleCloseModal}></div>
           <div className={`relative bg-white rounded-[30px] p-8 w-full max-w-sm flex flex-col shadow-2xl text-center ${isClosing ? 'animate-pop-out' : 'animate-pop-in'}`}>
              <h3 className="text-lg font-bold text-gray-800 mb-8">Are you sure you want to log out?</h3>
              <div className="flex justify-center gap-4">
                 <button onClick={handleCloseModal} className="px-6 py-2.5 rounded-2xl border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition w-full">Cancel</button>
                 <button onClick={handleConfirmLogout} className="px-6 py-2.5 rounded-2xl bg-[#ff5252] text-white font-bold hover:bg-red-600 transition w-full">Log out</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;