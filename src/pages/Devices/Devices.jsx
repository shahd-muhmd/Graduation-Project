import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { BiTrash, BiEdit, BiFridge, BiWifi, BiLaptop, BiDesktop, BiCoffee, BiWind, BiPlug, BiDroplet, BiLoaderAlt, BiMobile, BiCctv, BiSpeaker, BiPrinter } from "react-icons/bi"; 
import { MdTv, MdLightbulbOutline, MdAcUnit, MdMicrowave, MdPower, MdLocalLaundryService } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

import AddDevice from '../../features/Devices/AddDevice';
import EditDevice from '../../features/Devices/EditDevice';

const Devices = () => {
  const queryClient = useQueryClient();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);

  const getDeviceIcon = (name) => {
    if (!name) return <BiPlug className="text-[#28a745]" />;
    const lowerName = name.toLowerCase();
    const hasExactWord = (word) => new RegExp(`\\b${word}\\b`).test(lowerName);

    if (lowerName.includes('conditioner') || hasExactWord('ac')) return <MdAcUnit className="text-[#5bc0de]" />;
    if (lowerName.includes('fridge') || lowerName.includes('freezer') || lowerName.includes('refrigerator')) return <BiFridge className="text-[#337ab7]" />;
    if (lowerName.includes('mobile') || lowerName.includes('phone') || lowerName.includes('tablet')) return <BiMobile className="text-gray-500" />;
    if (lowerName.includes('laptop')) return <BiLaptop className="text-gray-500" />;
    if (lowerName.includes('pc') || lowerName.includes('desktop') || lowerName.includes('computer')) return <BiDesktop className="text-gray-500" />;
    if (lowerName.includes('lamp') || lowerName.includes('light') || lowerName.includes('bulb') || lowerName.includes('chandelier')) return <MdLightbulbOutline className="text-[#f0ad4e]" />;
    if (lowerName.includes('iron') || lowerName.includes('dryer') || lowerName.includes('straightener') || lowerName.includes('shaver') || lowerName.includes('charger')) return <MdPower className="text-gray-500" />;
    if (lowerName.includes('router') || lowerName.includes('wifi') || lowerName.includes('modem') || lowerName.includes('extender')) return <BiWifi className="text-[#337ab7]" />;
    if (lowerName.includes('kettle') || lowerName.includes('coffee') || lowerName.includes('espresso')) return <BiCoffee className="text-[#6f4e37]" />;
    if (lowerName.includes('microwave') || lowerName.includes('oven') || lowerName.includes('cooker') || lowerName.includes('fryer') || lowerName.includes('blender') || lowerName.includes('processor') || lowerName.includes('hood') || lowerName.includes('toaster')) return <MdMicrowave className="text-purple-700" />;
    if (lowerName.includes('washing') || lowerName.includes('laundry') || lowerName.includes('dishwasher')) return <MdLocalLaundryService className="text-[#337ab7]" />;
    if (lowerName.includes('heater') || lowerName.includes('dispenser') || lowerName.includes('pump') || lowerName.includes('humidifier') || lowerName.includes('purifier')) return <BiDroplet className="text-red-400" />;
    if (lowerName.includes('camera') || lowerName.includes('cctv')) return <BiCctv className="text-gray-600" />;
    if (lowerName.includes('speaker') || lowerName.includes('system') || lowerName.includes('sound')) return <BiSpeaker className="text-gray-600" />;
    if (lowerName.includes('printer')) return <BiPrinter className="text-gray-500" />;
    if (lowerName.includes('tv') || lowerName.includes('television') || lowerName.includes('screen') || lowerName.includes('receiver') || lowerName.includes('console')) return <MdTv className="text-[#337ab7]" />;
    if (lowerName.includes('fan')) return <BiWind className="text-gray-400" />;
    
    return <BiPlug className="text-[#28a745]" />;
  };

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const BASE_URL = 'https://electric.lastcode.site/public';
      
      const appliancesRes = await axios.get(`${BASE_URL}/api/appliances`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const appliancesData = appliancesRes.data?.data || [];
      const realTypeMapping = {};
      
      appliancesData.forEach(app => { realTypeMapping[app.id] = app.name; });

      const response = await axios.get(`${BASE_URL}/api/devices`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const apiData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      
      return apiData.map(d => ({
        id: d.id, 
        name: d.custom_name,
        power: `${d.watt_per_hour} Watt`,
        hours: d.daily_usage_hours,
        appliance_id: d.appliance_id,
        type: realTypeMapping[d.appliance_id] || d.custom_name || 'Other Device', 
        isOn: Number(d.status) === 1 || Number(d.is_active) === 1
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const token = localStorage.getItem('token');
      return axios.patch(`https://electric.lastcode.site/public/api/devices/${id}/status`, 
        { is_active: newStatus ? 1 : 0 }, 
        { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
    },
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['devices'] });
      const previousDevices = queryClient.getQueryData(['devices']);
      queryClient.setQueryData(['devices'], (old) => 
        old.map(d => d.id === id ? { ...d, isOn: newStatus } : d)
      );
      return { previousDevices };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['devices'], context.previousDevices);
    },
    onSettled: () => { 
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['planner_devices'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      return axios.delete(`https://electric.lastcode.site/public/api/devices/${id}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['planner_devices'] }); 
      setDeviceToDelete(null);
      setIsClosing(false);
    }
  });

  const handleCloseDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => { setDeviceToDelete(null); setIsClosing(false); }, 250);
  };

  return (
    <div className="w-full relative">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full h-[400px] gap-4">
          <BiLoaderAlt className="animate-spin text-5xl text-[#28a745]" />
          <p className="text-gray-500 font-medium">Loading your devices...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <div 
            onClick={() => setShowAddModal(true)}
            className="bg-[#28a745] rounded-3xl p-5 h-[160px] flex flex-col justify-center items-center cursor-pointer hover:bg-green-700 transition group"
          >
             <span className="text-white font-bold text-center text-lg leading-tight mb-2">Add New<br/>Device</span>
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 text-2xl group-hover:scale-110 transition duration-300">+</div>
          </div>

          {devices.map((device) => (
            <div key={device.id} className={`rounded-3xl p-4 h-[160px] flex flex-col justify-between shadow-sm relative hover:shadow-md transition duration-300 ${device.isOn ? 'bg-white' : 'bg-gray-300 opacity-70'}`}>
              <div className="flex justify-between items-start">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[24px]">
                    {getDeviceIcon(device.type)}
                 </div>
                 <div className="relative">
                   <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveMenuId(activeMenuId === device.id ? null : device.id); 
                    }} 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                   >
                     <BsThreeDotsVertical />
                   </button>
                   
                   {activeMenuId === device.id && (
                     <div className="absolute right-0 top-8 bg-white shadow-xl rounded-xl py-2 w-32 z-40 border border-gray-100">
                       <button 
                        onClick={(e) => { 
                            e.stopPropagation();
                            setDeviceToDelete(device.id); 
                            setActiveMenuId(null); 
                        }} 
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-800 font-medium"
                       >
                          <BiTrash className="text-lg text-red-500" /> Delete
                       </button>
                       <button 
                        onClick={(e) => { 
                            e.stopPropagation();
                            setDeviceToEdit(device); 
                            setActiveMenuId(null); 
                        }} 
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-800 font-medium"
                       >
                          <BiEdit className="text-lg text-blue-500" /> Edit
                       </button>
                     </div>
                   )}
                 </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm truncate" title={device.name}>{device.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{device.power}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={device.isOn} 
                    onChange={() => toggleMutation.mutate({ id: device.id, newStatus: !device.isOn })} 
                   />
                   <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#28a745]"></div>
                 </label>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeMenuId && <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)}></div>}

      {deviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleCloseDeleteModal}></div>
           <div className={`relative bg-white rounded-[30px] p-8 w-full max-w-sm flex flex-col shadow-2xl text-center ${isClosing ? 'animate-pop-out' : 'animate-pop-in'}`}>
              <h3 className="text-lg font-bold text-gray-800 mb-8 px-2">Are you sure you want to delete this device?</h3>
              <div className="flex justify-center gap-4">
                 <button onClick={handleCloseDeleteModal} className="px-6 py-2.5 rounded-2xl border-2 border-gray-300 w-full">Cancel</button>
                 <button 
                    onClick={() => deleteMutation.mutate(deviceToDelete)} 
                    className="px-6 py-2.5 rounded-2xl bg-[#ff5252] text-white w-full"
                 >
                    {deleteMutation.isLoading ? "..." : "Delete"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {showAddModal && (
        <AddDevice 
          onAdd={() => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            queryClient.invalidateQueries({ queryKey: ['planner_devices'] });
          }} 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {deviceToEdit && (
        <EditDevice 
            device={deviceToEdit} 
            onEdit={() => {
              queryClient.invalidateQueries({ queryKey: ['devices'] });
              queryClient.invalidateQueries({ queryKey: ['planner_devices'] });
            }} 
            onClose={() => setDeviceToEdit(null)} 
        />
      )}
    </div>
  );
};

export default Devices;