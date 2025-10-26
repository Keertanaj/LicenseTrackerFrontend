import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(open => !open);

  return (
    <div className="app-shell d-flex">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      <div className="content-area flex-grow-1">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
