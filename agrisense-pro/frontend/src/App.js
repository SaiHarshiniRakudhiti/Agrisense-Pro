import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/authStore";
import Sidebar from "./components/layout/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CropAdvisor from "./pages/CropAdvisor";
import YieldPredictor from "./pages/YieldPredictor";
import FertilizerAdvisor from "./pages/FertilizerAdvisor";
import MarketIntel from "./pages/MarketIntel";

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

function AppLayout() {
  const { isAuth } = useAuth();
  const { pathname } = useLocation();
  const isLoginPage  = pathname === "/login";

  if (!isAuth) return <Routes><Route path="*" element={<Login />} /></Routes>;

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar />
      <main style={{ flex:1, marginLeft:240, padding:"32px 36px", minHeight:"100vh", transition:"margin 0.25s", overflowY:"auto" }}>
        <Routes>
          <Route path="/"           element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/crop"       element={<ProtectedRoute><CropAdvisor /></ProtectedRoute>} />
          <Route path="/yield"      element={<ProtectedRoute><YieldPredictor /></ProtectedRoute>} />
          <Route path="/fertilizer" element={<ProtectedRoute><FertilizerAdvisor /></ProtectedRoute>} />
          <Route path="/market"     element={<ProtectedRoute><MarketIntel /></ProtectedRoute>} />
          <Route path="/login"      element={<Login />} />
          <Route path="*"           element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}