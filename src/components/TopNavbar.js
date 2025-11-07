import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; 

const PRIMARY_COLOR = '#FFFFFF';      
const ACCENT_COLOR = '#171717ff';      
const HOVER_COLOR = '#f0f0f0';        
const TEXT_COLOR = '#333333';        
const BORDER_COLOR = '#212529';  
;const navItems = [
    { path: "/dashboard", label: "Dashboard", allowedRole: ["ROLE_ADMIN", "ROLE_COMPLIANCE_OFFICER", "ROLE_COMPLIANCE_LEAD", "ROLE_PRODUCT_OWNER"] },

    { path: "/devices", label: "Devices", allowedRole: ["ROLE_ADMIN", "ROLE_NETWORK_ADMIN", "ROLE_OPERATIONS_MANAGER", "ROLE_NETWORK_ENGINEER"] },

    { path: "/licenses", label: "Licenses", allowedRole: ["ROLE_ADMIN", "ROLE_NETWORK_ADMIN", "ROLE_PROCUREMENT_OFFICER"] },

    { path: "/alerts", label: "Alerts", allowedRole: ["ROLE_ADMIN", "ROLE_NETWORK_ADMIN", "ROLE_PROCUREMENT_OFFICER", "ROLE_COMPLIANCE_OFFICER", "ROLE_OPERATIONS_MANAGER"] },

    { path: "/reports", label: "Reports", allowedRole: ["ROLE_ADMIN", "ROLE_PROCUREMENT_OFFICER", "ROLE_COMPLIANCE_OFFICER", "ROLE_IT_AUDITOR", "ROLE_SECURITY_HEAD", "ROLE_COMPLIANCE_LEAD", "ROLE_PROCUREMENT_LEAD"] },

    { path: "/users", label: "User Management", allowedRole: ["ROLE_ADMIN", "ROLE_SECURITY_HEAD"] },

    { path: "/auditlogs", label: "Audit Logs", allowedRole: ["ROLE_ADMIN", "ROLE_IT_AUDITOR", "ROLE_SECURITY_HEAD"] },

    { path: "/software", label: "Software", allowedRole: ["ROLE_ADMIN", "ROLE_OPERATIONS_MANAGER", "ROLE_NETWORK_ENGINEER"] },

    { path: "/vendors", label: "Vendors", allowedRole: ["ROLE_ADMIN", "ROLE_PROCUREMENT_OFFICER", "ROLE_PROCUREMENT_LEAD"] },

    { path: "/ai", label: "AI Chatbot", allowedRole: ["ROLE_ADMIN", "ROLE_COMPLIANCE_OFFICER", "ROLE_IT_AUDITOR", "ROLE_COMPLIANCE_LEAD", "ROLE_PROCUREMENT_LEAD", "ROLE_PRODUCT_OWNER"] }
];

const TopNavbar = () => {
    const location = useLocation();
    const { isAuthenticated, userRole, logout } = useAuth(); 

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard" || location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <Navbar
            expand="lg"
            className="shadow-sm border-bottom"
            style={{ backgroundColor: PRIMARY_COLOR, borderColor: BORDER_COLOR, borderBottomWidth: '1px' }} 
            variant="light" 
        >
            <Container fluid>
                <Navbar.Brand
                    as={Link}
                    to="/dashboard"
                    style={{ fontWeight: '900', fontSize: '1.4rem' }}
                >
                    <span>🫧</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="me-auto">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Nav.Link
                                    key={item.path}
                                    as={Link}
                                    to={item.path}
                                    className={`p-2 p-lg-3 mx-1 transition duration-300 ${active ? 'fw-bold rounded' : ''}`}
                                    style={{
                                        color: active ? ACCENT_COLOR : TEXT_COLOR, 
                                        backgroundColor: active ? HOVER_COLOR : 'transparent',
                                        borderRadius: '6px', 
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    {item.label}
                                </Nav.Link>
                            );
                        })}
                    </Nav>

                    <Nav className="d-flex align-items-center gap-3">
                        {isAuthenticated && (
                            <div
                                style={{
                                    backgroundColor: ACCENT_COLOR, 
                                    color: PRIMARY_COLOR,          
                                    padding: '5px 12px',
                                    borderRadius: '20px', 
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {userRole.replace('ROLE_', '')}
                            </div>
                        )}
                        <Button 
                            variant="outline-dark" 
                            onClick={logout}
                            as={Link}
                            to="/auth"
                            style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
                        >
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;