import React, { useState } from 'react';
import { BiCreditCard, BiTrash, BiPlus, BiMobileAlt } from "react-icons/bi";
import { FaCcVisa } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

const Payments = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const inputStyle = "w-full bg-gray-200 border border-transparent focus:border-[#28a745] focus:bg-white rounded-xl px-4 py-3.5 text-base text-black outline-none transition-all placeholder:text-gray-400";
  const labelStyle = "block text-sm font-bold text-gray-800 mb-2 ml-1";

  // دالة وهمية لإضافة الكارت
  const handleAddCard = (e) => {
    e.preventDefault();
    setSuccessMsg("Payment method added successfully!");
    setShowAddForm(false); // نقفل الفورمة بعد الإضافة
    
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto relative">
      
      {/* رسالة النجاح (Toast Notification) */}
      {successMsg && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3.5 bg-white border border-gray-100 shadow-2xl rounded-full px-7 py-3.5 animate-fade-in">
          <IoCheckmarkCircle className="text-[#28a745]" size={28} />
          <p className="text-gray-800 text-[15.5px] font-semibold">{successMsg}</p>
        </div>
      )}

      <h2 className="text-xl font-bold text-black text-center mb-8">Payment Methods</h2>

      {/* --- رصيد أو فواتير (شكل جمالي) --- */}
      <div className="bg-[#28a745] rounded-3xl p-6 text-white mb-8 shadow-md flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80 mb-1">Upcoming Bill</p>
          <h3 className="text-3xl font-bold">150 EGP</h3>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
          <BiCreditCard size={32} />
        </div>
      </div>

      {/* --- طرق الدفع المحفوظة --- */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-gray-800 mb-4 ml-1">Saved Methods</h3>
        
        <div className="flex flex-col gap-3">
          {/* كارت فيزا */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition">
            <div className="flex items-center gap-4">
              <FaCcVisa size={36} className="text-[#1a1f71]" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/26</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-red-50">
              <BiTrash size={20} />
            </button>
          </div>

          {/* محفظة إلكترونية (اتصالات/فودافون) */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-green-100 text-[#28a745] rounded-full flex items-center justify-center">
                <BiMobileAlt size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Etisalat Cash</p>
                <p className="text-xs text-gray-500">011 **** **98</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-red-50">
              <BiTrash size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- زرار إضافة طريقة دفع جديدة --- */}
      {!showAddForm ? (
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-[#28a745] hover:text-[#28a745] hover:bg-green-50 transition flex items-center justify-center gap-2"
        >
          <BiPlus size={22} /> Add New Payment Method
        </button>
      ) : (
        /* --- فورمة إضافة كارت (بتظهر لما تدوسي على الزرار) --- */
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 animate-fade-in">
          <h3 className="text-base font-bold text-gray-800 mb-5">Add New Card</h3>
          
          <form onSubmit={handleAddCard} className="flex flex-col gap-4">
            <div>
              <label className={labelStyle}>Cardholder Name</label>
              <input type="text" placeholder="John Doe" className={inputStyle} required />
            </div>

            <div>
              <label className={labelStyle}>Card Number</label>
              <div className="relative">
                <input type="text" placeholder="0000 0000 0000 0000" className={`${inputStyle} pl-12`} maxLength="19" required />
                <BiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className={labelStyle}>Expiry Date</label>
                <input type="text" placeholder="MM/YY" className={inputStyle} maxLength="5" required />
              </div>
              <div className="w-1/2">
                <label className={labelStyle}>CVV</label>
                <input type="password" placeholder="123" className={inputStyle} maxLength="3" required />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-[#28a745] text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md shadow-green-200"
              >
                Save Card
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Payments;