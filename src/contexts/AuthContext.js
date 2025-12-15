import { createContext, useContext, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { selectAuthState } from '../features/auth/authSelectors';
import { clearProfile } from '../features/userProfile/userProfileSlice';
import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModuleAccess,
    hasModulePermission,
    hasRouteAccess,
    getAccessibleRoutes
} from '../utils/permissionUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuthState);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(logout());
        dispatch(clearProfile());
    }, [dispatch]);

    const userPermissions = authState.user?.permissions || [];

    const checkPermissionMemo = useCallback((permission) =>
        hasPermission(userPermissions, permission), [userPermissions]);

    const checkAnyPermissionMemo = useCallback((permissions) =>
        hasAnyPermission(userPermissions, permissions), [userPermissions]);

    const checkAllPermissionsMemo = useCallback((permissions) =>
        hasAllPermissions(userPermissions, permissions), [userPermissions]);

    const checkModuleAccessMemo = useCallback((modulePrefix) =>
        hasModuleAccess(userPermissions, modulePrefix), [userPermissions]);

    const checkModulePermissionMemo = useCallback((modulePrefix, action) =>
        hasModulePermission(userPermissions, modulePrefix, action), [userPermissions]);

    const checkRouteAccessMemo = useCallback((routePath) =>
        hasRouteAccess(userPermissions, routePath), [userPermissions]);

    const getAccessibleRoutesMemo = useCallback(() =>
        getAccessibleRoutes(userPermissions), [userPermissions]);

    const value = useMemo(() => ({
        auth: {
            ...authState,
            isAuthenticated: !!authState.user,
            role: authState.user?.role,
            permissions: userPermissions,
        },
        setAuth: () => { },
        logout: handleLogout,
        isAuthenticated: !!authState.user,
        isLoading: authState.loading,
        checkPermission: checkPermissionMemo,
        checkAnyPermission: checkAnyPermissionMemo,
        checkAllPermissions: checkAllPermissionsMemo,
        checkModuleAccess: checkModuleAccessMemo,
        checkModulePermission: checkModulePermissionMemo,
        checkRouteAccess: checkRouteAccessMemo,
        getAccessibleRoutes: getAccessibleRoutesMemo,
    }), [
        authState,
        userPermissions,
        handleLogout,
        checkPermissionMemo,
        checkAnyPermissionMemo,
        checkAllPermissionsMemo,
        checkModuleAccessMemo,
        checkModulePermissionMemo,
        checkRouteAccessMemo,
        getAccessibleRoutesMemo
    ]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
