import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginUserWithCaptcha, verifyOtpUser } from '../features/auth/authThunks';
import { clearErrors, logout } from '../features/auth/authSlice';
import { selectAuthState } from '../features/auth/authSelectors';
import { clearProfile } from '../features/userProfile/userProfileSlice';
import { ROLE } from '../constants/role';
import ROUTE_PATH from '../constants/routes';
import { showToast } from '../utils/toastNotification';

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, errors, apiError, otpRequired, requiresTwoFactorAuth, email, tenDangNhap, user } = useSelector(selectAuthState);

    const handleRedirect = (role) => {
        if (role === ROLE.ADMIN) {
            navigate(ROUTE_PATH.DASHBOARD, { replace: true });
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch(logout());
            dispatch(clearProfile());
            showToast.error('Bạn không có quyền truy cập vào hệ thống quản trị!');
            navigate(ROUTE_PATH.LOGIN, { replace: true });
        }
    };

    const login = async (credentials) => {
        const result = await dispatch(loginUser(credentials));
        if (result.meta.requestStatus === 'fulfilled' && result.payload?.user && !result.payload?.requiresTwoFactorAuth && !result.payload?.otpRequired) {
            handleRedirect(result.payload.user.role);
        }
        return result.payload;
    };

    const loginWithCaptcha = async (credentials) => {
        const result = await dispatch(loginUserWithCaptcha(credentials));
        if (result.meta.requestStatus === 'fulfilled' && result.payload?.user && !result.payload?.requiresTwoFactorAuth && !result.payload?.otpRequired) {
            handleRedirect(result.payload.user.role);
            return { ...result.payload, success: true };
        }
        return { ...result.payload, success: false };
    };

    const verifyOtp = async (data) => {
        const result = await dispatch(verifyOtpUser(data));
        if (result.meta.requestStatus === 'fulfilled') {
            handleRedirect(result.payload.user.role);
        }
        return result.payload;
    };

    const clearAllErrors = () => {
        dispatch(clearErrors());
    };

    return {
        login,
        loginWithCaptcha,
        verifyOtp,
        loading,
        errors,
        apiError,
        otpRequired,
        requiresTwoFactorAuth,
        email,
        tenDangNhap,
        user,
        clearAllErrors,
        clearErrors: clearAllErrors,
    };
};
