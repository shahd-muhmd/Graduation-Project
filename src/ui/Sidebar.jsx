import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlineBulb,
  AiOutlineUser,
} from 'react-icons/ai';

const Sidebar = () => {
  const location = useLocation(); 

  const getLinkClasses = (path) => {
    // استخدمنا includes عشان يفضل منور أخضر حتى لو دخلنا جوه البروفايل
    const isActive = location.pathname.includes(path);
    const baseClasses =
      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all font-medium";

    return isActive
      ? `${baseClasses} bg-white text-[#28a745] shadow-sm`
      : `${baseClasses} text-gray-500 hover:text-[#28a745]`;
  };

  return (
    <div className="bg-[#f4f6f8] rounded-3xl p-6 flex flex-col h-full w-[240px] hidden md:flex shrink-0">
      <div className="text-[#28a745] text-3xl font-bold mb-10 flex items-center justify-center gap-2">
        ⚡Esave
      </div>

      <nav className="flex flex-col gap-2">
        <Link to="/home" className={getLinkClasses("/home")}>
          <AiOutlineHome size={25} /> Home
        </Link>
        <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
          <AiOutlineAppstore size={25} /> Dashboard
        </Link>
        <Link to="/devices" className={getLinkClasses("/devices")}>
          <AiOutlineBulb size={25} /> Devices
        </Link>
        <Link to="/planner" className={getLinkClasses("/planner")}>
          <AiOutlineAppstore size={25} /> Planner
        </Link>
        <Link to="/profile" className={getLinkClasses("/profile")}>
          <AiOutlineUser size={25} /> Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;