import React from "react"; 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// ✅ 1. استدعاء أدوات React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Devices from "./pages/Devices/Devices";
import Planner from "./pages/Planner/Planner";
import Profile from "./pages/Profile/Profile";
import Sidebar from "./ui/Sidebar";

import PersonalInfo from "./features/Profile/PersonalInfo";
import ChangePassword from "./features/Profile/ChangePassword";
import Payments from "./features/Profile/Payments";

import AuthLayout from "./pages/AuthLayout/AuthLayout";
import Signin from "./pages/SignIn/SignIn";
import ForgetPass from "./pages/ForgetPass/ForgetPass";
import OTPverifi from "./pages/OTPverifi/OTPverifi";
import ResetPass from "./pages/ResetPass/ResetPass";

// --- الهيكل العام للصفحات الداخلية (Layout) ---
const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const isProfilePage = location.pathname.includes('/profile'); 
  const userName = localStorage.getItem('user_name') || 'User';
  
  return (
    <div className="flex h-screen bg-white p-4 gap-4 font-[Poppins] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {!isProfilePage && (
          <div className="shrink-0 mx-8 my-4">
            <h2 className="text-2xl font-bold text-gray-800">Hello,</h2>
            <p className="text-sm text-gray-500 mt-1">{userName}</p>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto relative scroll-smooth ${isProfilePage ? 'p-2' : 'bg-[#f4f6f8] rounded-[30px] p-8'}`}>
          {children}
        </div>
      </div>
      
      <div className="w-[300px] bg-[#f4f6f8] rounded-[30px] p-6 hidden lg:block">
        <h3 className="font-bold mb-4 text-gray-700">Notifications</h3>
        <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
          <p className="text-sm text-gray-600">Welcome to Esave!</p>
          <span className="text-xs text-gray-400">Just now</span>
        </div>
      </div>
    </div>
  );
};

// ✅ 2. إنشاء نسخة الـ Client بره الـ Component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // الداتا تفضل متكيشة (مخزنة) 5 دقايق
      refetchOnWindowFocus: false, // عشان ميعملش ريفريش كل ما تفتحي التاب
    },
  },
});

function App() {
  // 🧹 مسحنا كل الـ State القديمة (devices, addDevice, etc.) لأن Devices.jsx بقت بتجيب الداتا بنفسها

  return (
    // ✅ 3. تغليف الـ Router بالـ Provider بتاع React Query
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          
          {/* --- 🔐 مسارات الـ Authentication --- */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="signin" replace />} />
            <Route path="signin" element={<Signin />} />
            <Route path="forgot-password" element={<ForgetPass />} />
            <Route path="otp" element={<OTPverifi />} />
            <Route path="reset-password" element={<ResetPass />} />
          </Route>

          <Route path="/" element={<Navigate to="/auth/signin" replace />} />

          {/* --- 📊 مسارات النظام --- */}
          <Route
            path="/devices"
            element={
              <DashboardLayout>
                {/* 🧹 مسحنا الـ Props اللي كانت مبعوتة هنا */}
                <Devices />
              </DashboardLayout>
            }
          />

          <Route
            path="/planner"
            element={
              <DashboardLayout>
                <Planner />
              </DashboardLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            }
          >
            <Route index element={<Navigate to="personal" replace />} />
            <Route path="personal" element={<PersonalInfo />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="payments" element={<Payments />} />
          </Route>

          <Route
            path="/home"
            element={
              <DashboardLayout>
                <h2>Home Page (Coming Soon)</h2>
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <h2>Dashboard (Coming Soon)</h2>
              </DashboardLayout>
            }
          />

          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;