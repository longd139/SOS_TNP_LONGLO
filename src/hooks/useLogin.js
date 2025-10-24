import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_API } from '../apis/auth';
import { validateAuth } from '../validator/loginValidator';
import { ROLE } from '../constants/role';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const validateCredentials = async (credentials) => {
        try {
            await validateAuth(credentials);
            setErrors({});
            return true;
        } catch (validationErrors) {
            const formattedErrors = {};

            if (validationErrors.inner) {
                validationErrors.inner.forEach(error => {
                    formattedErrors[error.path] = error.message;
                });
            } else {
                formattedErrors.general = 'Validation failed';
            }

            setErrors(formattedErrors);
            return false;
        }
    };

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp <= currentTime) {
                throw new Error('Token has expired');
            }

            return {
                userId: decoded.userId,
                role: decoded.role,
                ip: decoded.ip,
                iat: decoded.iat,
                exp: decoded.exp
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const handleRedirect = (role) => {
        if (role === ROLE.ADMIN) {
            navigate('/dashboard', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    };

    const storeTokens = (accessToken, refreshToken = null) => {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setApiError('');
        setErrors({});

        try {
            const isValid = await validateCredentials(credentials);
            if (!isValid) {
                setLoading(false);
                return { success: false, errors };
            }

            const response = await AUTH_API.login(credentials);

            if (!response || !response.accessToken) {
                throw new Error('Invalid response from server');
            }

            const decodedToken = decodeToken(response.accessToken);
            if (!decodedToken) {
                throw new Error('Invalid token received');
            }

            storeTokens(response.accessToken, response.refreshToken);

            setAuth({
                userId: decodedToken.userId,
                role: decodedToken.role,
                accessToken: response.accessToken
            });

            handleRedirect(decodedToken.role);

            setLoading(false);
            return {
                success: true,
                user: {
                    userId: decodedToken.userId,
                    role: decodedToken.role
                }
            };

        } catch (error) {
            console.error('Login error:', error);

            let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';

            if (error.message === 'Invalid token received') {
                errorMessage = 'Phản hồi không hợp lệ từ server.';
            } else if (error.message === 'Token has expired') {
                errorMessage = 'Token đã hết hạn.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            setApiError(errorMessage);
            setLoading(false);

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const clearErrors = () => {
        setErrors({});
        setApiError('');
    };

    return {
        login,
        loading,
        errors,
        apiError,
        clearErrors
    };
};