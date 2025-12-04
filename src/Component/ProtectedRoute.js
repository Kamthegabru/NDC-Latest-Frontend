import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

/**
 * ProtectedRoute Component
 * Purpose: Check if user is authenticated before allowing access to protected pages
 * 
 * How it works:
 * 1. Checks if token exists in cookies
 * 2. Checks if userRole matches allowed roles
 * 3. If valid: Shows the protected page
 * 4. If invalid: Redirects to login page
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = Cookies.get('token');
    const userRole = Cookies.get('userRole');

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If allowedRoles specified and user role doesn't match, redirect to login
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated and authorized, show the protected content
    return children;
};

export default ProtectedRoute;
