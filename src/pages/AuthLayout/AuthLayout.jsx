import React from 'react';
import { Outlet } from 'react-router-dom';
import saveEnergyImg from '../../assets/save-energy.png';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-white font-[Poppins] items-center justify-center overflow-hidden">
      
      <div className="flex w-full max-w-[1000px] mx-auto items-center justify-between gap-8 lg:gap-16 p-4">
        
        <div className="hidden lg:flex w-1/2 flex-col items-end justify-center">
          <div className="max-w-[350px] text-center animate-fade-in">
            <img 
              src={saveEnergyImg}
              alt="Save Energy Illustration" 
              className="w-full h-auto mb-3"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Save Energy</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Track your electricity usage and reduce<br/>waste easily
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-start">
          <div className="bg-[#f4f6f8] rounded-[30px] p-8 w-full max-w-[420px] shadow-sm relative">
             <Outlet /> 
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;