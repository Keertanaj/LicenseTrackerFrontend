import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, close }) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/devices", label: "Devices" }
  ];

  return (
    <>
      {/* Desktop sidebar (always visible >=992px) */}
      <aside className="sidebar d-none d-lg-flex flex-column p-3">
        <div className="sidebar-brand mb-3">License Tracker</div>
        <Nav className="flex-column">
          {navItems.map(item => (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              className={location.pathname === item.path ? "active-link" : "text-white"}
            >
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
        <div className="mt-auto small text-muted">Prodapt • Telecom</div>
      </aside>

      {/* Mobile overlay drawer */}
      <div className={`mobile-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-inner p-3">
          <div className="d-flex justify-content-between mb-3">
            <div className="fw-bold">License Tracker</div>
            <button className="btn btn-sm btn-outline-light" onClick={close}>Close</button>
          </div>
          <Nav className="flex-column">
            {navItems.map(item => (
              <Nav.Link as={Link} to={item.path} key={item.path} onClick={close}>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </div>
        <div className="drawer-backdrop" onClick={close}></div>
      </div>
    </>
  );
};

export default Sidebar;
