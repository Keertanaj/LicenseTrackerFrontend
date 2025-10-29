import React from "react";
import { Container, Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

// The navigation items
const navItems = [
    { path: "/dashboard", label: "Dashboard"},
    { path: "/devices", label: "Devices" },
    { path: "/licenses", label: "License Management" },
    { path: "/alerts", label: "Alerts" }
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
                {/* 🛠️ Brand/Logo */}
                <Navbar.Brand 
                    as={Link} 
                    to="/dashboard" 
                    style={{ color: 'white', fontWeight: 'bold' }}
                >
                    🛠️ License Tracker
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                
                <Navbar.Collapse id="main-navbar-nav">
                    {/* Navigation Links */}
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

                    {/* Search and Profile Pill */}
                    <Nav>
                        <Form className="d-flex me-3">
                            <FormControl 
                                placeholder="Search..." 
                                size="sm" 
                                className="me-2"
                                style={{ borderColor: '#B2DCE2' }} 
                            />
                        </Form>
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