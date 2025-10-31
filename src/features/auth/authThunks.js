import { createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { AUTH_API } from '../../apis/auth';
import { validateAuth } from '../../validator/loginValidator';

const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp <= Date.now() / 1000) throw new Error('Token hết hạn');
        return decoded;
    } catch {
        return null;
    }
};

const storeTokens = (accessToken, refreshToken = null) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            await validateAuth(credentials);

            const res = await AUTH_API.login(credentials);
            const response = res?.data || res;

            if (response.requireOtp) {
                return {
                    otpRequired: true,
                    email: response.email,
                };
            }

            if (!response.accessToken) throw new Error('Phản hồi không hợp lệ');

            const decoded = decodeToken(response.accessToken);
            if (!decoded) throw new Error('Token không hợp lệ');

            storeTokens(response.accessToken, response.refreshToken);

            return {
                user: {
                    userId: decoded.userId,
                    role: decoded.role,
                    email: response.email,
                },
            };
        } catch (error) {
            return rejectWithValue({ message: error.message });
        }
    }
);

export const verifyOtpUser = createAsyncThunk(
    'auth/verifyOtpUser',
    async ({ otp, tenDangNhap }, { rejectWithValue }) => {
        try {
            const result = await AUTH_API.verify2FA({ otp, tenDangNhap });

            if (!result.success) throw new Error(result.message || 'OTP sai');
            if (!result.accessToken) throw new Error('Không nhận được token');

            const decoded = decodeToken(result.accessToken);
            if (!decoded) throw new Error('Không thể giải mã token');

            storeTokens(result.accessToken, result.refreshToken);

            return {
                user: {
                    userId: decoded.userId,
                    role: decoded.role,
                },
            };
        } catch (error) {
            return rejectWithValue({ message: error.message });
        }
    }
);
