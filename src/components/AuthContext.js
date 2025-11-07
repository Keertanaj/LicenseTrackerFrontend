import React, { createContext, useState, useContext} from 'react';

// Define a default context value
const AuthContext = createContext({
    isAuthenticated: false,
    userRole: 'GUEST',
    login: () => {},
    logout: () => {},
});

// The Auth Provider component
export const AuthProvider = ({ children }) => {
    // 1. Initialize state from localStorage (for session persistence)
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('jwtToken')
    );
    const [userRole, setUserRole] = useState(
        localStorage.getItem('userRole') || 'GUEST'
    );

    // 2. Login function: Call this on successful API login response
const login = (token, role) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role); // 👈 This updates the context and triggers navbar re-render
};

    // 3. Logout function: Clear state and localStorage
    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole('GUEST');
    };

    // 4. Expose state and methods
    const value = {
        isAuthenticated,
        userRole,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to consume the context easily
export const useAuth = () => {
    return useContext(AuthContext);
};