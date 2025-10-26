import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DeviceManagement from "./components/DeviceManagement";
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';

const Dashboard = () => (
  <div className="p-4">
    <h2>Dashboard Overview</h2>
    <p>Welcome to the License Tracker Dashboard.</p>
  </div>
);

const Licenses = () => (
  <div className="p-4">
    <h2>Licenses</h2>
    <p>Manage software and device licenses here.</p>
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/devices" element={<DeviceManagement />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}
