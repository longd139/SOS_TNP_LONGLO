import { createSlice } from '@reduxjs/toolkit';
import { loginUser, verifyOtpUser, changePassword } from './authThunks';
import { jwtDecode } from 'jwt-decode';

const getUserFromToken = () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return null;
        
        const decoded = jwtDecode(accessToken);
        
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
        }
        
        return {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
        };
    } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
    }
};

const initialState = {
    loading: false,
    errors: {},
    apiError: '',
    otpRequired: false,
    requiresTwoFactorAuth: false,
    email: '',
    tenDangNhap: '',
    user: getUserFromToken(),
    changePasswordSuccess: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.errors = {};
            state.apiError = '';
        },
        clearChangePasswordSuccess: (state) => {
            state.changePasswordSuccess = false;
        },
        logout: (state) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            state.user = null;
            state.requiresTwoFactorAuth = false;
            state.tenDangNhap = '';
        },
        restoreUser: (state) => {
            state.user = getUserFromToken();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.apiError = '';
                state.errors = {};
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.otpRequired = action.payload.otpRequired || false;
                state.requiresTwoFactorAuth = action.payload.requiresTwoFactorAuth || false;
                state.email = action.payload.email || '';
                state.tenDangNhap = action.payload.tenDangNhap || '';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.apiError = action.payload?.message || 'Đăng nhập thất bại';
            })

            .addCase(verifyOtpUser.pending, (state) => {
                state.loading = true;
                state.apiError = '';
            })
            .addCase(verifyOtpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.otpRequired = false;
            })
            .addCase(verifyOtpUser.rejected, (state, action) => {
                state.loading = false;
                state.apiError = action.payload?.message || 'Xác thực OTP thất bại';
            })

            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.apiError = '';
                state.changePasswordSuccess = false;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.apiError = '';
                state.changePasswordSuccess = true;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.apiError = action.payload?.message || 'Đổi mật khẩu thất bại';
                state.changePasswordSuccess = false;
            });
    },
});

export const { clearErrors, clearChangePasswordSuccess, logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;