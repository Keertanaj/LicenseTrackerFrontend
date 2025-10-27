import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DeviceManagement from "./components/DeviceManagement";
import LicenseManagement from "./components/LicenseManagement";
import AuthPage from "./pages/AuthPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';

const Dashboard = () => (
  <div className="p-4">
    <h2>Dashboard Overview</h2>
    <p>Welcome to the License Tracker Dashboard.</p>
  </div>
);

const Reports = () => (
  <div className="p-4">
    <h2>Reports</h2>
    <p>Generate compliance and usage reports.</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/devices" element={<DeviceManagement />} />
          <Route path="/licenses" element={<LicenseManagement />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}
