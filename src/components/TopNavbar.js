import React from "react";
import { Container, Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const navItems = [
    { path: "/dashboard", label: "Dashboard"},
    { path: "/devices", label: "Devices" },
    { path: "/licenses", label: "License Management" },
    { path: "/alerts", label: "Alerts" },
    { path: "/reports", label: "Reports"},
    { path: "/users", label: "User Management" },
    { path: "/auditlogs", label: "Audit Logs"},
    { path: "/software", label: "Software"},
    { path: "/vendors", label: "Vendors"},
    { path: "/ai", label: "AI Chatbot"}
];

const TopNavbar = () => {
    const location = useLocation();
    
    const PRIMARY_COLOR = '#343A40'; 
    const ACTIVE_COLOR = '#83B366';

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard" || location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <Navbar 
            expand="lg" 
            className="shadow-sm" 
            style={{ backgroundColor: PRIMARY_COLOR }} 
            variant="dark"
        >
            <Container fluid>
                <Navbar.Brand 
                    as={Link} 
                    to="/dashboard" 
                    style={{ color: 'white', fontWeight: 'bold' }}
                >
                    License Tracker
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="me-auto"> 
                        {navItems.map((item) => (
                            <Nav.Link 
                                key={item.path} 
                                as={Link} 
                                to={item.path}
                                className={`text-white p-2 p-lg-3 ${isActive(item.path) ? 'fw-bold border-bottom border-4' : ''}`}
                                style={{ 
                                    borderBottomColor: isActive(item.path) ? ACTIVE_COLOR : 'transparent', // Highlight with Soft Green
                                }}
                            >
                                {item.icon} {item.label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    <Nav>
                        <div className="d-flex align-items-center">
                            <div className="profile-pill" style={{ color: 'white' }}>
                                Admin
                            </div>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;