import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'; 
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { BiFridge, BiWifi, BiLaptop, BiDesktop, BiCoffee, BiWind, BiPlug, BiDroplet, BiLoaderAlt, BiMobile, BiCctv, BiSpeaker, BiPrinter } from "react-icons/bi"; 
import { MdTv, MdLightbulbOutline, MdAcUnit, MdPower, MdLocalLaundryService, MdMicrowave } from "react-icons/md";

const getDeviceIcon = (name) => {
    const size = 24;
    if (!name) return <BiPlug size={size} className="text-[#28a745]" />;
    
    const lowerName = name.toLowerCase();
    const hasExactWord = (word) => new RegExp(`\\b${word}\\b`).test(lowerName);

    if (lowerName.includes('conditioner') || hasExactWord('ac')) return <MdAcUnit size={size} className="text-[#5bc0de]" />;
    if (lowerName.includes('fridge') || lowerName.includes('freezer') || lowerName.includes('refrigerator')) return <BiFridge size={size} className="text-[#337ab7]" />;
    if (lowerName.includes('mobile') || lowerName.includes('phone') || lowerName.includes('tablet')) return <BiMobile size={size} className="text-gray-500" />;
    if (lowerName.includes('laptop')) return <BiLaptop size={size} className="text-gray-500" />;
    if (lowerName.includes('pc') || lowerName.includes('desktop') || lowerName.includes('computer')) return <BiDesktop size={size} className="text-gray-500" />;
    if (lowerName.includes('lamp') || lowerName.includes('light') || lowerName.includes('bulb') || lowerName.includes('chandelier')) return <MdLightbulbOutline size={size} className="text-[#f0ad4e]" />;
    if (lowerName.includes('iron') || lowerName.includes('dryer') || lowerName.includes('straightener') || lowerName.includes('shaver') || lowerName.includes('charger')) return <MdPower size={size} className="text-gray-500" />;
    if (lowerName.includes('router') || lowerName.includes('wifi') || lowerName.includes('modem') || lowerName.includes('extender')) return <BiWifi size={size} className="text-[#337ab7]" />;
    if (lowerName.includes('kettle') || lowerName.includes('coffee') || lowerName.includes('espresso')) return <BiCoffee size={size} className="text-[#6f4e37]" />;
    if (lowerName.includes('microwave') || lowerName.includes('oven') || lowerName.includes('cooker') || lowerName.includes('fryer') || lowerName.includes('blender') || lowerName.includes('processor') || lowerName.includes('hood') || lowerName.includes('toaster')) return <MdMicrowave size={size} className="text-purple-700" />;
    if (lowerName.includes('washing') || lowerName.includes('laundry') || lowerName.includes('dishwasher')) return <MdLocalLaundryService size={size} className="text-[#337ab7]" />;
    if (lowerName.includes('heater') || lowerName.includes('dispenser') || lowerName.includes('pump') || lowerName.includes('humidifier') || lowerName.includes('purifier')) return <BiDroplet size={size} className="text-red-400" />;
    if (lowerName.includes('camera') || lowerName.includes('cctv')) return <BiCctv size={size} className="text-gray-600" />;
    if (lowerName.includes('speaker') || lowerName.includes('system') || lowerName.includes('sound')) return <BiSpeaker size={size} className="text-gray-600" />;
    if (lowerName.includes('printer')) return <BiPrinter size={size} className="text-gray-500" />;
    if (lowerName.includes('tv') || lowerName.includes('television') || lowerName.includes('screen') || lowerName.includes('receiver') || lowerName.includes('console')) return <MdTv size={size} className="text-[#337ab7]" />;
    if (lowerName.includes('fan')) return <BiWind size={size} className="text-gray-400" />;
    
    return <BiPlug size={size} className="text-[#28a745]" />;
};

const Planner = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('planner_formData');
    return saved ? JSON.parse(saved) : { saveTarget: '' };
  });
  
  const [errors, setErrors] = useState({ saveTarget: '' });
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPlanCreated, setIsPlanCreated] = useState(() => {
    return localStorage.getItem('planner_isPlanCreated') === 'true';
  });
  
  const [selectedDeviceIds, setSelectedDeviceIds] = useState(() => {
    const saved = localStorage.getItem('planner_selectedDevices');
    return saved ? JSON.parse(saved) : [];
  });

  const [planResult, setPlanResult] = useState(() => {
    const saved = localStorage.getItem('planner_result');
    return saved ? JSON.parse(saved) : { percentage: 0, tasks: [], aiMessage: "" };
  });

  useEffect(() => {
    localStorage.setItem('planner_formData', JSON.stringify(formData));
    localStorage.setItem('planner_isPlanCreated', isPlanCreated);
    localStorage.setItem('planner_selectedDevices', JSON.stringify(selectedDeviceIds));
    localStorage.setItem('planner_result', JSON.stringify(planResult));
  }, [formData, isPlanCreated, selectedDeviceIds, planResult]);

  const handleClearPlan = () => {
    setFormData({ saveTarget: '' });
    setSelectedDeviceIds([]);
    setIsPlanCreated(false);
    setPlanResult({ percentage: 0, tasks: [], aiMessage: "" });
    localStorage.removeItem('planner_formData');
    localStorage.removeItem('planner_isPlanCreated');
    localStorage.removeItem('planner_selectedDevices');
    localStorage.removeItem('planner_result');
  };

  const { data: allUserDevices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['planner_devices'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const BASE_URL = 'https://electric.lastcode.site/public';
      
      const appliancesRes = await axios.get(`${BASE_URL}/api/appliances`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const appliancesData = appliancesRes.data?.data || [];
      const realTypeMapping = {};
      
      appliancesData.forEach(app => {
        realTypeMapping[app.id] = app.name;
      });

      const response = await axios.get(`${BASE_URL}/api/devices`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      const apiData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const activeDevicesOnly = apiData.filter(d => Number(d.status) === 1 || Number(d.is_active) === 1);

      return activeDevicesOnly.map(d => ({
        id: d.id,
        name: d.custom_name,
        type: realTypeMapping[d.appliance_id] || d.custom_name || 'Other Device'
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const toggleDeviceSelection = (id) => {
    if (selectedDeviceIds.includes(id)) {
      setSelectedDeviceIds(selectedDeviceIds.filter(deviceId => deviceId !== id));
    } else {
      setSelectedDeviceIds([...selectedDeviceIds, id]);
    }
  };

  const getSelectedDevicesString = () => {
    if (selectedDeviceIds.length === 0) return "Select devices you don't turn off";
    const names = allUserDevices.filter(d => selectedDeviceIds.includes(d.id)).map(d => d.name);
    if (names.length > 3) return `${names.slice(0, 3).join(", ")} ...`;
    return names.join(", ");
  };

  const handleCreatePlan = async () => {
    let newErrors = { saveTarget: '' };
    let isValid = true;

    if (!formData.saveTarget) {
        newErrors.saveTarget = 'Please enter your save target';
        isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsLoading(true);

      try {
        const token = localStorage.getItem('token');
        const BASE_URL = 'https://electric.lastcode.site/public';

        const requestData = {
          target_savings_egp: Number(formData.saveTarget),
          excluded_device_ids: selectedDeviceIds
        };

        const response = await axios.post(`${BASE_URL}/api/optimization/recommend`, requestData, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const apiData = response.data.data; 
        
        const generatedTasks = (apiData.optimized_devices || []).map((device) => ({
           id: device.device_id,
           text: `Reduce ${device.name} to ${device.recommended_daily_hours} hours/day (Saves ${device.saved_hours}h)`,
           completed: false
        }));

        const savedAmount = apiData.plan_summary?.achieved_savings_egp || 0;
        const targetAmount = parseFloat(formData.saveTarget) || 1;
        let calcPercentage = Math.round((savedAmount / targetAmount) * 100);
        
        if (calcPercentage > 100) calcPercentage = 100;

        const rawAiMessage = apiData.plan_summary?.message_to_user || "";
        const cleanAiMessage = rawAiMessage.replace("[Your Name]", "Esave");
        
        setPlanResult({
            percentage: calcPercentage,
            tasks: generatedTasks,
            aiMessage: cleanAiMessage
        });
        
        setIsPlanCreated(true);

      } catch (error) {
          console.error("Error creating plan:", error);
          alert("An error occurred while creating the plan, please try again.");
      } finally {
          setIsLoading(false);
      }
    }
  };

  const toggleTask = (id) => {
    setPlanResult(prev => ({
        ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const baseInputStyle = "w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder-gray-500 border focus:ring-1";

  return (
    <div className="w-full font-sans pb-20 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-black">Create Your Plan</h2>
        {isPlanCreated && (
            <button 
               onClick={handleClearPlan} 
               className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 text-sm font-bold rounded-xl hover:bg-red-100 transition border border-red-100"
            >Clear Plan
            </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full">
            <label className="block text-sm font-bold mb-2 ml-1">Save Target (EGP)</label>
            <input 
              name="saveTarget" 
              type="number" 
              placeholder="e.g., 150" 
              className={`${baseInputStyle} ${errors.saveTarget ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-400 focus:border-[#28a745] focus:ring-[#28a745]'}`} 
              value={formData.saveTarget} 
              onChange={handleChange} 
              disabled={isLoading} 
            />
            {errors.saveTarget && <p className="text-red-500 text-xs font-bold mt-2 ml-1 animate-fadeIn">{errors.saveTarget}</p>}
        </div>

        <div onClick={() => !isLoading && setShowDeviceModal(true)} className={`${baseInputStyle} border-gray-400 focus:border-[#28a745] flex justify-between items-center cursor-pointer hover:bg-gray-300 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
           <span className="text-gray-600 truncate mr-2">{getSelectedDevicesString()}</span>
           <IoIosArrowForward className="text-gray-500" />
        </div>

        <div className="flex justify-center mt-4">
          <button 
            onClick={handleCreatePlan} 
            disabled={isLoading} 
            className={`px-12 py-3 bg-[#28a745] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading && <BiLoaderAlt className="animate-spin text-xl" />}
            {isLoading ? "Processing..." : (isPlanCreated ? "Update Plan" : "Create Plan")}
          </button>
        </div>
      </div>

      {isPlanCreated && !isLoading && (
        <div className="mt-10 animate-fadeIn">
          <div className="flex justify-center mb-10">
             <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" stroke="#E5E7EB" strokeWidth="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#28a745" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * planResult.percentage) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">{planResult.percentage}%</div>
             </div>
          </div>
          <div className="flex flex-col gap-4">
            {planResult.aiMessage && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-xl mb-6 text-sm font-bold leading-relaxed text-left"> 
                {planResult.aiMessage}
              </div>
            )}

            {planResult.tasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)} 
                className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  task.completed 
                    ? 'border-[#28a745] bg-green-50/50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <span className={`text-sm font-bold transition-colors duration-300 ${task.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  {task.text}
                </span>
                <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors duration-300 ${task.completed ? 'bg-[#28a745]' : 'bg-gray-200'}`}>
                  {task.completed && <FaCheck className="text-white text-xs" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeviceModal(false)}></div>
           <div className="relative bg-white rounded-[30px] w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl animate-pop-in">
              <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100">
                 <h3 className="text-xl font-bold">Devices you don't turn off</h3>
                 <button onClick={() => setShowDeviceModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><IoMdClose size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                 {isLoadingDevices ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <BiLoaderAlt className="animate-spin text-4xl text-[#28a745]" />
                        <p className="text-gray-500 font-bold">Loading your devices...</p>
                    </div>
                 ) : allUserDevices.length === 0 ? (
                    <div className="text-center text-gray-500 font-bold py-10">
                        No devices found. Please add devices first.
                    </div>
                 ) : (
                    <div className="flex flex-col gap-3">
                       {allUserDevices.map((device) => {
                          const isSelected = selectedDeviceIds.includes(device.id);
                          const DeviceIcon = getDeviceIcon(device.type); 

                          return (
                              <div key={device.id} onClick={() => toggleDeviceSelection(device.id)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition ${isSelected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                 <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${isSelected ? 'text-green-600 bg-white' : 'text-gray-500 bg-white'}`}>
                                       {DeviceIcon}
                                    </div>
                                    <span className={`font-bold ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>{device.name}</span>
                                 </div>
                                 <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-[#28a745]' : 'border-2 border-gray-300 bg-white'}`}>
                                    {isSelected && <FaCheck className="text-white text-xs" />}
                                 </div>
                              </div>
                          );
                       })}
                    </div>
                 )}
              </div>
              <div className="p-6 pt-4 border-t">
                  <button onClick={() => setShowDeviceModal(false)} className="w-full bg-[#28a745] text-white rounded-xl py-3 font-bold hover:bg-green-700 transition">
                      Save
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Planner;