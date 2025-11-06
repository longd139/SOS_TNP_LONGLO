import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import ROUTE_PATH from '../constants/routes';

export const useAuthRedirect = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage.getItem('accessToken');

            if (accessToken && isAuthenticated) {
                try {
                    const decoded = jwtDecode(accessToken);
                    if (decoded.exp && decoded.exp > Date.now() / 1000) {
                        navigate(ROUTE_PATH.DASHBOARD, { replace: true });
                    }
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
        };

        checkAuth();
    }, [isAuthenticated, navigate]);
};
