import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'; 
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BiLoaderAlt, BiFridge, BiWifi, BiLaptop, BiDesktop, BiCoffee, BiWind, BiPlug, BiDroplet, BiMobile, BiCctv, BiSpeaker, BiPrinter } from "react-icons/bi"; 
import { MdTv, MdLightbulbOutline, MdAcUnit, MdMicrowave, MdLocalLaundryService, MdPower } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const AddDevice = ({ onAdd, onClose }) => { 
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 

  const [formData, setFormData] = useState({
    name: '', power: '', hours: '', type: '', appliance_id: ''
  });

  const { data: categories = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['appliances'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://electric.lastcode.site/public/api/appliances', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      return response.data?.data || [];
    },
    staleTime: 24 * 60 * 60 * 1000, 
  });

  const getDeviceIcon = (name) => {
    const iconClass = "text-[22px]"; 
    if (!name) return <BiPlug className={iconClass} />;
    
    const lowerName = name.toLowerCase();
    const hasExactWord = (word) => new RegExp(`\\b${word}\\b`).test(lowerName); // عشان متقراش ac جوه machine

    if (lowerName.includes('conditioner') || hasExactWord('ac')) return <MdAcUnit className={iconClass} />;
    if (lowerName.includes('fridge') || lowerName.includes('freezer') || lowerName.includes('refrigerator')) return <BiFridge className={iconClass} />;
    if (lowerName.includes('mobile') || lowerName.includes('phone') || lowerName.includes('tablet')) return <BiMobile className={iconClass} />;
    if (lowerName.includes('laptop')) return <BiLaptop className={iconClass} />;
    if (lowerName.includes('pc') || lowerName.includes('desktop') || lowerName.includes('computer')) return <BiDesktop className={iconClass} />;
    if (lowerName.includes('lamp') || lowerName.includes('light') || lowerName.includes('bulb') || lowerName.includes('chandelier')) return <MdLightbulbOutline className={iconClass} />;
    if (lowerName.includes('iron') || lowerName.includes('dryer') || lowerName.includes('straightener') || lowerName.includes('shaver') || lowerName.includes('charger')) return <MdPower className={iconClass} />;
    if (lowerName.includes('router') || lowerName.includes('wifi') || lowerName.includes('modem') || lowerName.includes('extender')) return <BiWifi className={iconClass} />;
    if (lowerName.includes('kettle') || lowerName.includes('coffee') || lowerName.includes('espresso')) return <BiCoffee className={iconClass} />;
    if (lowerName.includes('microwave') || lowerName.includes('oven') || lowerName.includes('cooker') || lowerName.includes('fryer') || lowerName.includes('blender') || lowerName.includes('processor') || lowerName.includes('hood') || lowerName.includes('toaster')) return <MdMicrowave className={iconClass} />;
    if (lowerName.includes('washing') || lowerName.includes('laundry') || lowerName.includes('dishwasher')) return <MdLocalLaundryService className={iconClass} />;
    if (lowerName.includes('heater') || lowerName.includes('dispenser') || lowerName.includes('pump') || lowerName.includes('humidifier') || lowerName.includes('purifier')) return <BiDroplet className={iconClass} />;
    if (lowerName.includes('camera') || lowerName.includes('cctv')) return <BiCctv className={iconClass} />;
    if (lowerName.includes('speaker') || lowerName.includes('system') || lowerName.includes('sound')) return <BiSpeaker className={iconClass} />;
    if (lowerName.includes('printer')) return <BiPrinter className={iconClass} />;
    if (lowerName.includes('tv') || lowerName.includes('television') || lowerName.includes('screen') || lowerName.includes('receiver') || lowerName.includes('console')) return <MdTv className={iconClass} />;
    if (lowerName.includes('fan')) return <BiWind className={iconClass} />;
    
    return <BiPlug className={iconClass} />;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectType = (appliance) => {
    setFormData({ 
      ...formData, 
      type: appliance.name, 
      name: appliance.name,
      appliance_id: appliance.id, 
      power: appliance.default_watt_per_hour || '', 
      hours: appliance.default_daily_hours || ''    
    });
    setIsOpen(false);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!formData.name || !formData.power || !formData.appliance_id) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://electric.lastcode.site/public/api/devices', null, {
        params: {
          appliance_id: formData.appliance_id, 
          custom_name: formData.name,
          watt_per_hour: formData.power,
          daily_usage_hours: formData.hours || 0,
          status: 1
        },
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      onAdd(); 
      onClose(); 
    } catch (error) {
      alert("Failed to add device.");
    } finally {
      setIsSaving(false); 
    }
  };

  const inputStyle = "w-full bg-[#E5E7EB] border border-gray-400 focus:border-[#28a745] focus:ring-1 focus:ring-[#28a745] rounded-xl px-4 py-3 text-[15px] text-gray-800 outline-none transition-all placeholder-gray-500 font-medium";
  const labelStyle = "block text-[15px] font-bold text-black mb-2 ml-1";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"> 
      <div className="bg-white rounded-[30px] w-full max-w-md relative shadow-2xl animate-pop-in max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-black">Add Device</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"><IoClose size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="w-full relative">
              <label className={labelStyle}>Device Type</label>
              <div className={`${inputStyle} flex justify-between items-center cursor-pointer relative ${isSaving || isLoadingTypes ? 'opacity-70 pointer-events-none' : ''}`} onClick={() => !isSaving && setIsOpen(!isOpen)}>
                <span className={formData.type ? "text-gray-800 font-bold" : "text-gray-500"}>
                  {isLoadingTypes ? "Loading..." : (formData.type || "Select device type")}
                </span>
                <span className="text-gray-500">{isOpen ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}</span>
              </div>
              {isOpen && (
                <div className="absolute top-[85px] left-0 right-0 z-30 flex flex-col gap-1 w-full animate-fadeIn max-h-[260px] overflow-y-auto bg-white p-2 rounded-xl shadow-2xl border border-gray-100">
                  {categories.map((appliance) => {
                    const isSelected = formData.appliance_id === appliance.id;
                    return (
                      <div key={appliance.id} onClick={() => handleSelectType(appliance)} className={`w-full px-4 py-3 text-[14px] cursor-pointer hover:bg-gray-50 transition flex items-center gap-3 border rounded-xl ${isSelected ? 'border-[#28a745] bg-green-50 text-[#28a745] font-bold shadow-sm' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        <span className={isSelected ? 'text-[#28a745]' : 'text-gray-400'}>{getDeviceIcon(appliance.name)}</span>
                        {appliance.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <label className={labelStyle}>Device Name</label>
              <input name="name" type="text" value={formData.name} placeholder="Ex: Living Room AC" className={inputStyle} onChange={handleChange} disabled={isSaving} />
            </div>
            <div>
                <label className={labelStyle}>Power (Watt)</label>
                <input name="power" type="number" step="0.1" value={formData.power} placeholder="Ex: 1500" className={inputStyle} onChange={handleChange} disabled={isSaving} />
            </div>
            <div>
                <label className={labelStyle}>Avg Hours</label>
                <input name="hours" type="number" value={formData.hours} placeholder="Ex: 5" className={inputStyle} onChange={handleChange} disabled={isSaving} />
            </div>
            <div className="mt-4 flex justify-center w-full shrink-0">
               <button type="submit" disabled={isSaving || isLoadingTypes} className={`w-full py-3.5 bg-[#28a745] text-white rounded-xl font-bold text-[15px] hover:bg-green-700 transition flex items-center justify-center gap-2 ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}>
                 {isSaving && <BiLoaderAlt className="animate-spin text-lg" />}
                 {isSaving ? "Adding..." : "Add Device"}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;