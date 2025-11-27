import { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { selectAuthState } from '../features/auth/authSelectors';
import { clearProfile } from '../features/userProfile/userProfileSlice';
import { ROLE } from '../constants/role';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuthState);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(logout());
        dispatch(clearProfile());
    };

    const value = {
        auth: {
            ...authState,
            isAuthenticated: !!authState.user,
            role: authState.user?.role
        },
        setAuth: () => { },
        logout: handleLogout,
        isAuthenticated: !!authState.user,
        isLoading: authState.loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
