import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser } = useContext(AuthContext);

    if (currentUser === undefined) {
        return <div>Loading...</div>; // Or return null while checking auth status
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.some(role => currentUser.roles.includes(role))) {
        // Redirect to dashboard if user has no access, or login
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
