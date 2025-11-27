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

    const handleRedirect = () => {
        navigate(ROUTE_PATH.DASHBOARD, { replace: true });
    };

    const login = async (credentials) => {
        const result = await dispatch(loginUser(credentials));
        const payload = result.payload;

        if (
            result.meta.requestStatus === 'fulfilled' &&
            payload?.user &&
            !payload?.requiresTwoFactorAuth &&
            !payload?.otpRequired
        ) {
            handleRedirect();
        }

        return payload;
    };

    const loginWithCaptcha = async (credentials) => {
        const result = await dispatch(loginUserWithCaptcha(credentials));
        const payload = result.payload;

        if (
            result.meta.requestStatus === 'fulfilled' &&
            payload?.user &&
            !payload?.requiresTwoFactorAuth &&
            !payload?.otpRequired
        ) {
            handleRedirect();
            return { ...payload, success: true };
        }

        return { ...payload, success: false };
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
