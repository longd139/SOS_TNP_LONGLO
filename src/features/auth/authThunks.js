import { createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { AUTH_API } from '../../apis/auth';
import { validateAuth } from '../../validator/loginValidator';
import { showToast } from '../../utils/toastNotification';

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

            if (response.requiresTwoFactorAuth || response.requires_two_factor_auth) {
                return {
                    requiresTwoFactorAuth: true,
                    tenDangNhap: credentials.tenDangNhap,
                };
            }

            if (response.requireOtp) {
                return {
                    otpRequired: true,
                    email: response.email,
                };
            }

            if (!response.access_token) throw new Error('Phản hồi không hợp lệ');

            const decoded = decodeToken(response.access_token);
            if (!decoded) throw new Error('Token không hợp lệ');

            storeTokens(response.access_token, response.refresh_token);

            return {
                user: {
                    userId: decoded.userId,
                    role: decoded.role,
                    email: response.email,
                },
            };
        } catch (error) {
            const fieldErrors = {};
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach(err => {
                    if (err.field && err.message) {
                        fieldErrors[err.field] = err.message;
                    }
                });
            }
            
            showToast.error(error.message);
            return rejectWithValue({ 
                message: error.message,
                errors: fieldErrors
            });
        }
    }
);

export const verifyOtpUser = createAsyncThunk(
    'auth/verifyOtpUser',
    async ({ otp, tenDangNhap }, { rejectWithValue }) => {
        try {
            const response = await AUTH_API.verify2FA({ otp, tenDangNhap });
            if (!response.success) throw new Error(response.message || 'OTP sai');
            
            const tokenData = response.data;
            const accessToken = tokenData.access_token;
            const refreshToken = tokenData.refresh_token;

            if (!accessToken) throw new Error('Không nhận được token');

            const decoded = decodeToken(accessToken);
            if (!decoded) throw new Error('Không thể giải mã token');

            storeTokens(accessToken, refreshToken);

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

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            if (!passwordData.matKhauHienTai || !passwordData.matKhauMoi || !passwordData.confirmMatKhauMoi) {
                throw new Error('Vui lòng điền đầy đủ thông tin');
            }

            if (passwordData.matKhauMoi !== passwordData.confirmMatKhauMoi) {
                throw new Error('Mật khẩu mới không khớp');
            }

            if (passwordData.matKhauMoi.length < 6) {
                throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
            }

            if (passwordData.matKhauHienTai === passwordData.matKhauMoi) {
                throw new Error('Mật khẩu mới phải khác mật khẩu cũ');
            }

            const response = await AUTH_API.changePassword({
                matKhauHienTai: passwordData.matKhauHienTai,
                matKhauMoi: passwordData.matKhauMoi,
            });

            return {
                message: 'Đổi mật khẩu thành công',
                data: response,
            };
        } catch (error) {
            return rejectWithValue({ 
                message: error.message || 'Đổi mật khẩu thất bại' 
            });
        }
    }
);

export const sendOtpToEmail = createAsyncThunk(
    'auth/sendOtpToEmail',
    async ({ email, type = 'RESET_PASSWORD' }, { rejectWithValue }) => {
        try {
            if (!email) {
                throw new Error('Vui lòng nhập email');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Định dạng email không hợp lệ');
            }

            const response = await AUTH_API.sendOtpToEmail({ email });

            showToast.success('Mã OTP đã được gửi đến email của bạn');

            return {
                message: 'Gửi OTP thành công',
                email: email,
                data: response,
            };
        } catch (error) {
            const fieldErrors = {};
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach(err => {
                    if (err.field && err.message) {
                        fieldErrors[err.field] = err.message;
                    }
                });
            }

            showToast.error(error.message);
            return rejectWithValue({ 
                message: error.message || 'Gửi OTP thất bại',
                errors: fieldErrors
            });
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, matKhauMoi, confirmMatKhauMoi, otp }, { rejectWithValue }) => {
        try {
            if (!email || !matKhauMoi || !confirmMatKhauMoi || !otp) {
                throw new Error('Vui lòng điền đầy đủ thông tin');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Định dạng email không hợp lệ');
            }

            if (matKhauMoi !== confirmMatKhauMoi) {
                throw new Error('Mật khẩu mới không khớp');
            }

            if (matKhauMoi.length < 6) {
                throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
            }

            if (otp.length !== 6) {
                throw new Error('Mã OTP phải có 6 số');
            }

            const response = await AUTH_API.resetPassword({
                email,
                matKhauMoi,
                otp
            });

            showToast.success('Đặt lại mật khẩu thành công');

            return {
                message: 'Đặt lại mật khẩu thành công',
                data: response,
            };
        } catch (error) {
            const fieldErrors = {};
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach(err => {
                    if (err.field && err.message) {
                        fieldErrors[err.field] = err.message;
                    }
                });
            }

            showToast.error(error.message);
            return rejectWithValue({ 
                message: error.message || 'Đặt lại mật khẩu thất bại',
                errors: fieldErrors
            });
        }
    }
);
