import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isPathDisabled, getDefaultEnabledRoute } from '../../utils/routeRedirectUtils';
import ROUTE_PATH from '../../constants/routes';

const ProtectedRoute = ({ children }) => {
    const { auth, isLoading } = useAuth();
    const location = useLocation();

    // useEffect(() => {
    //     if (!isLoading && auth.isAuthenticated) {
    //         showToast.error('Bạn không có quyền truy cập vào hệ thống quản trị!');
    //         logout();
    //     }
    // }, [auth.isAuthenticated, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        return <Navigate to={ROUTE_PATH.LOGIN} state={{ from: location }} replace />;
    }

    // if (requiredRole) {
    //     if (requiredRole === ROLE.ADMIN && auth.role && auth.role !== ROLE.ADMIN) {
    //         return <Navigate to={ROUTE_PATH.HOME} replace />;
    //     }
    // }

    if (isPathDisabled(location.pathname)) {
        const defaultRoute = getDefaultEnabledRoute();
        return <Navigate to={defaultRoute} replace />;
    }

    return children;
};

export default ProtectedRoute;