import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import DeviceManagement from "./components/DeviceManagement";
import LicenseManagement from "./components/LicenseManagement";
import AuthPage from "./pages/AuthPage";
import AssignLicenseModal from "./components/AssignLicenseModal";
import Alerts from "./components/Alerts";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./components/Dashboard";
import Reports from "./pages/ReportsPage";
import UserPage from "./pages/UserPage";
import AuditLogPage from "./pages/AuditLogPage";
import SoftwareManagement from "./pages/SoftwareManagement";
import Vendors from "./pages/VendorManagement";
import AIAssistant from "./pages/AIAssistant";
const AppRoutes = () => {
    const location = useLocation();
    
    const NO_LAYOUT_PATHS = ['/auth']; 
    
    const showLayout = !NO_LAYOUT_PATHS.includes(location.pathname);

    const routes = (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceManagement />} />
            <Route path="/licenses" element={<LicenseManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/assignments" element={<AssignLicenseModal />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path= "/reports" element={<Reports />} />
            <Route path= "/users" element={<UserPage />} />
            <Route path= "/auditlogs" element={<AuditLogPage />} />
            <Route path= "/software" element={<SoftwareManagement />} />
            <Route path= "/vendors" element={<Vendors />} />
            <Route path= "/ai" element={<AIAssistant />} />
        </Routes>
    );

    return showLayout ? (
        <Layout>{routes}</Layout>
    ) : (
        routes
    );
};

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}