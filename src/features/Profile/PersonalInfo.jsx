import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoCheckmarkCircle } from "react-icons/io5";

const PersonalInfo = () => {
  // --- States ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState(''); 
  
  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 

  const inputStyle = "w-full bg-gray-200 border border-transparent focus:border-[#28a745] focus:bg-white rounded-xl px-4 py-3.5 text-base text-black outline-none transition-all";
  const labelStyle = "block text-base font-bold text-black mb-2 ml-1";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const BASE_URL = 'https://electric.lastcode.site/public';

        const response = await axios.get(`${BASE_URL}/api/profile`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data.data || response.data;
        setName(userData.name || userData.first_name || '');
        setEmail(userData.email || '');
        setAddress(userData.address || ''); 

      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMsg("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      const BASE_URL = 'https://electric.lastcode.site/public';

      await axios.put(`${BASE_URL}/api/profile`, null, {
        params: {
          name: name,
          email: email,
          address: address 
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccessMsg("Profile updated successfully!");
      
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMsg("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
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

      <h2 className="text-xl font-bold text-black text-center mb-8">Personal information</h2>
      
      {errorMsg && <p className="text-red-500 text-center mb-4 text-sm font-bold">{errorMsg}</p>}

      <div className="flex flex-col gap-6">
        <div>
          <label className={labelStyle}>Name</label>
          <input 
            type="text" 
            value={isLoading ? "Loading..." : name} 
            onChange={(e) => { setName(e.target.value); setSuccessMsg(''); setErrorMsg(''); }} 
            disabled={isLoading || isSaving}
            className={inputStyle} 
          />
        </div>
        
        <div>
          <label className={labelStyle}>Email</label>
          <input 
            type="email" 
            value={isLoading ? "Loading..." : email} 
            onChange={(e) => { setEmail(e.target.value); setSuccessMsg(''); setErrorMsg(''); }} 
            disabled={isLoading || isSaving}
            className={inputStyle} 
          />
        </div>

        <div>
          <label className={labelStyle}>Address</label>
          <input 
            type="text" 
            placeholder="Enter your address"
            value={isLoading ? "Loading..." : address} 
            onChange={(e) => { setAddress(e.target.value); setSuccessMsg(''); setErrorMsg(''); }} 
            disabled={isLoading || isSaving}
            className={inputStyle} 
          />
        </div>

        <div className="flex justify-center mt-6">
          <button 
            type="button"
            onClick={handleSave} 
            disabled={isLoading || isSaving} 
            className={`px-12 py-3.5 text-white rounded-xl font-bold text-base transition ${isLoading || isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#28a745] hover:bg-green-700'}`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;