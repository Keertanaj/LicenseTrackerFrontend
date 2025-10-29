import React from "react";
import TopNavbar from "./TopNavbar";

const Layout = ({ children }) => {
  // We no longer need 'sidebarOpen' state or 'toggleSidebar' function
  // since the sidebar is being removed.

  return (
    // The main container is simplified. Topbar handles the navigation.
    <div className="app-shell"> 
      <TopNavbar /> 
      {/* Main content starts directly below the Topbar, taking full width */}
      <main className="main-content p-3 p-md-4">{children}</main>
    </div>
  );
};

export default Layout;