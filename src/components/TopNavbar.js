import React from "react";
import { Container, Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

// The navigation items
const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: '📊' },
    { path: "/devices", label: "Devices", icon: '💻' },
    { path: "/licenses", label: "License Management", icon: '🔑' }
];

const TopNavbar = () => {
    const location = useLocation();
    
    // --- UPDATED COLORS ---
    const PRIMARY_COLOR = '#343A40'; // Deep Charcoal for Navbar background (Replaces Clear Blue)
    const ACTIVE_COLOR = '#83B366'; // Soft Green for active highlight (from your existing theme)

    // Function to check if a navigation item is active
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
            style={{ backgroundColor: PRIMARY_COLOR }} // Set Deep Charcoal background
            variant="dark" // Ensures text and toggle icon are white/light
        >
            <Container fluid>
                {/* 🛠️ Brand/Logo */}
                <Navbar.Brand 
                    as={Link} 
                    to="/dashboard" 
                    style={{ color: 'white', fontWeight: 'bold' }}
                >
                    🛠️ Asset Tracker
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
                                // Use Soft Teal for the search input border to link back to your theme
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