import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, verifyOtpUser } from '../features/auth/authThunks';
import { clearErrors } from '../features/auth/authSlice';
import { selectAuthState } from '../features/auth/authSelectors';
import { ROLE } from '../constants/role';
import ROUTE_PATH from '../constants/routes';

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, errors, apiError, otpRequired, email, user } = useSelector(selectAuthState);

    const handleRedirect = (role) => {
        if (role === ROLE.ADMIN) navigate(ROUTE_PATH.DASHBOARD, { replace: true });
        else navigate(ROUTE_PATH.LOGIN, { replace: true });
    };

    const login = async (credentials) => {
        const result = await dispatch(loginUser(credentials));
        if (result.meta.requestStatus === 'fulfilled' && result.payload.user) {
            handleRedirect(result.payload.user.role);
        }
        return result.payload;
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
        verifyOtp,
        loading,
        errors,
        apiError,
        otpRequired,
        email,
        user,
        clearAllErrors,
    };
};
