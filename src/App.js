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

const Reports = () => (
  <div className="p-4">
    <h2>Reports</h2>
    <p>Generate compliance and usage reports.</p>
  </div>
);

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