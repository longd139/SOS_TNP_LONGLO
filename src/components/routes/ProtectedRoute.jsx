import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE } from '../../constants/role';
import { isPathDisabled, getDefaultEnabledRoute } from '../../utils/routeRedirectUtils';
import { showToast } from '../../utils/toastNotification';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { auth, isLoading, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && auth.isAuthenticated && requiredRole === ROLE.ADMIN && auth.role !== ROLE.ADMIN) {
            showToast.error('Bạn không có quyền truy cập vào hệ thống quản trị!');
            logout();
        }
    }, [auth.isAuthenticated, auth.role, requiredRole, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requiredRole) {
        if (requiredRole === ROLE.ADMIN && auth.role !== ROLE.ADMIN) {
            return <Navigate to="/" replace />;
        }
    }

    if (isPathDisabled(location.pathname)) {
        const defaultRoute = getDefaultEnabledRoute();
        return <Navigate to={defaultRoute} replace />;
    }

    return children;
};

export default ProtectedRoute;