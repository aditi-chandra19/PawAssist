import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import AppShell from "../components/ui/CareShell";
import Login from "../pages/AuthLoginPage";
import Register from "../pages/RegisterPage";
import Home from "../pages/PostLoginHome.jsx";
import Dashboard from "../pages/CareDashboard";
import Pets from "../pages/Pets";
import Booking from "../pages/ServiceBookingPage.jsx";
import Tracking from "../pages/Tracking";
import Grooming from "../pages/Grooming";
import Wallet from "../pages/Wallet";
import Chat from "../pages/Chat";
import Provider from "../pages/Provider";
import Notifications from "../pages/Notifications";
import Health from "../pages/Health";
import Premium from "../pages/PremiumShowcase.jsx";
import AIAssistant from "../pages/ProAIAssistant.jsx";
import Community from "../pages/Community";
import Insurance from "../pages/Insurance";
import Profile from "../pages/Profile";
import useUserStore from "../store/useUserStore";

function RootRedirect() {
  const user = useUserStore((state) => state.user);
  return <Navigate to={user ? "/app/home" : "/login"} replace />;
}

function ProtectedRoutes() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pets" element={<Pets />} />
            <Route path="booking" element={<Booking />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="grooming" element={<Grooming />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="chat" element={<Chat />} />
            <Route path="provider" element={<Provider />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="health" element={<Health />} />
            <Route path="premium" element={<Premium />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="community" element={<Community />} />
            <Route path="insurance" element={<Insurance />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
