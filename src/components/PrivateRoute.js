import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const PrivateRoute = ({ children, allowedRoles = null }) => {
    const { isAuthenticated, userRole } = useAuth();

    // Show loading spinner while checking authentication
    if (userRole === undefined) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    // Redirect to auth page if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // Check if specific roles are required
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to dashboard if user doesn't have required role
        return <Navigate to="/dashboard" replace />;
    }

    // User is authenticated and has required role (or no role check needed)
    return children;
};

export default PrivateRoute;