import React from "react";
import TopNavbar from "./TopNavbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div 
      className="app-shell"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    > 
      <TopNavbar /> 
      <main className="main-content p-3 p-md-4" style={{ flexGrow: 1 }}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;