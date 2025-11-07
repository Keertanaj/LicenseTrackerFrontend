import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import DeviceManagement from "./pages/DeviceManagement";
import LicenseManagement from "./pages/LicenseManagement";
import AuthPage from "./pages/AuthPage";
import AssignLicenseModal from "./components/AssignLicenseModal";
import Alerts from "./pages/Alerts";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/ReportsPage";
import UserPage from "./pages/UserPage";
import AuditLogPage from "./pages/AuditLogPage";
import SoftwareManagement from "./pages/SoftwareManagement";
import Vendors from "./pages/VendorManagement";
import AIAssistant from "./pages/AIAssistant";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const AppRoutes = () => {
    const location = useLocation();
    
    const NO_LAYOUT_PATHS = ['/auth']; 
    const showLayout = !NO_LAYOUT_PATHS.includes(location.pathname);

    const routes = (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_COMPLIANCE_OFFICER", "ROLE_COMPLIANCE_LEAD", "ROLE_PRODUCT_OWNER"]}>
                        <Dashboard />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/devices" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_NETWORK_ADMIN", "ROLE_OPERATIONS_MANAGER", "ROLE_NETWORK_ENGINEER"]}>
                        <DeviceManagement />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/licenses" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_NETWORK_ADMIN", "ROLE_PROCUREMENT_OFFICER"]}>
                        <LicenseManagement />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/alerts" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_NETWORK_ADMIN", "ROLE_PROCUREMENT_OFFICER", "ROLE_COMPLIANCE_OFFICER", "ROLE_OPERATIONS_MANAGER"]}>
                        <Alerts />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/reports" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_PROCUREMENT_OFFICER", "ROLE_COMPLIANCE_OFFICER", "ROLE_IT_AUDITOR", "ROLE_SECURITY_HEAD", "ROLE_COMPLIANCE_LEAD", "ROLE_PROCUREMENT_LEAD"]}>
                        <Reports />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/users" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_SECURITY_HEAD"]}>
                        <UserPage />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/auditlogs" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_IT_AUDITOR", "ROLE_SECURITY_HEAD"]}>
                        <AuditLogPage />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/software" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_OPERATIONS_MANAGER", "ROLE_NETWORK_ENGINEER"]}>
                        <SoftwareManagement />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/vendors" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_PROCUREMENT_OFFICER", "ROLE_PROCUREMENT_LEAD"]}>
                        <Vendors />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/ai" 
                element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_COMPLIANCE_OFFICER", "ROLE_IT_AUDITOR", "ROLE_COMPLIANCE_LEAD", "ROLE_PROCUREMENT_LEAD", "ROLE_PRODUCT_OWNER"]}>
                        <AIAssistant />
                    </PrivateRoute>
                } 
            />
            
            <Route 
                path="/assignments" 
                element={
                    <PrivateRoute>
                        <AssignLicenseModal />
                    </PrivateRoute>
                } 
            />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
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
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}