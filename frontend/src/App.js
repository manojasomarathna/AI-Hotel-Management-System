import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIChatbot from "./pages/AIChatbot";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Bookings from "./pages/Bookings";
import Invoices from "./pages/Invoices";
import AIPrediction from "./pages/AIPrediction";

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: "220px", flex: 1, background: "#f0f2f5", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/employees" element={<ProtectedLayout><Employees /></ProtectedLayout>} />
      <Route path="/inventory" element={<ProtectedLayout><Inventory /></ProtectedLayout>} />
      <Route path="/bookings" element={<ProtectedLayout><Bookings /></ProtectedLayout>} />
      <Route path="/invoices" element={<ProtectedLayout><Invoices /></ProtectedLayout>} />
      <Route path="/ai-chat" element={<ProtectedLayout><AIChatbot /></ProtectedLayout>} />
      <Route path="/ai-prediction" element={<ProtectedLayout><AIPrediction /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
