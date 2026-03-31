import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, roles }) => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(userInfo.role)) {
        // Logged in but not the right role
        // Redirect to their respective dashboard or home
        if (userInfo.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
        if (userInfo.role === 'Staff') return <Navigate to="/staff/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
