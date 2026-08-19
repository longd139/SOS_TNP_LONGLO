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

const createDemoToken = (userObj) => {
    try {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({
            userId: userObj.userId,
            username: userObj.username,
            fullName: userObj.fullName,
            role: userObj.role,
            email: userObj.email,
            permissions: userObj.permissions || ["*"],
            exp: Math.floor(Date.now() / 1000) + 30 * 86400
        }));
        return `${header}.${payload}.demo_signature`;
    } catch {
        return "demo_token_" + Date.now();
    }
};

export const SEED_ACCOUNTS = {
    'admin': {
        password: 'admin123',
        user: {
            userId: 'USR-032',
            username: 'admin',
            fullName: 'Quản trị viên hệ thống',
            role: 'ADMIN',
            email: 'admin@tangnhonphu.gov.vn',
            permissions: ['ALL', 'SYSTEM_ADMIN', 'COMPLAINTS', 'SCHEDULES', 'DOCUMENTS']
        }
    },
    'canbo': {
        password: '123456',
        user: {
            userId: 'USR-010',
            username: 'canbo',
            fullName: 'Cán bộ Tiếp nhận',
            role: 'OFFICER',
            email: 'canbo@tangnhonphu.gov.vn',
            permissions: ['COMPLAINTS', 'SCHEDULES', 'RECEPTION']
        }
    },
    'canbo2': {
        password: '123456',
        user: {
            userId: 'USR-011',
            username: 'canbo2',
            fullName: 'Cán bộ Tiếp nhận 2',
            role: 'OFFICER',
            email: 'canbo2@ubnd.gov.vn',
            permissions: ['COMPLAINTS', 'SCHEDULES', 'RECEPTION']
        }
    },
    'canbo3': {
        password: '123456',
        user: {
            userId: 'USR-012',
            username: 'canbo3',
            fullName: 'Cán bộ Tiếp nhận 3',
            role: 'OFFICER',
            email: 'canbo3@ubnd.gov.vn',
            permissions: ['COMPLAINTS', 'SCHEDULES', 'RECEPTION']
        }
    },
    'canbo4': {
        password: '123456',
        user: {
            userId: 'USR-013',
            username: 'canbo4',
            fullName: 'Cán bộ Tiếp nhận 4',
            role: 'OFFICER',
            email: 'canbo4@ubnd.gov.vn',
            permissions: ['COMPLAINTS', 'SCHEDULES', 'RECEPTION']
        }
    },
    'lanhdao': {
        password: '123456',
        user: {
            userId: 'USR-030',
            username: 'lanhdao',
            fullName: 'Lãnh đạo UBND',
            role: 'LEADER',
            email: 'lanhdao@tangnhonphu.gov.vn',
            permissions: ['ALL', 'LEADER_APPROVAL', 'SCHEDULES', 'COMPLAINTS']
        }
    },
    'lanhdao2': {
        password: '123456',
        user: {
            userId: 'USR-031',
            username: 'lanhdao2',
            fullName: 'Lãnh đạo UBND 2',
            role: 'LEADER',
            email: 'lanhdao2@ubnd.gov.vn',
            permissions: ['ALL', 'LEADER_APPROVAL', 'SCHEDULES', 'COMPLAINTS']
        }
    },
    'lanhdao3': {
        password: '123456',
        user: {
            userId: 'USR-033',
            username: 'lanhdao3',
            fullName: 'Lãnh đạo UBND 3',
            role: 'LEADER',
            email: 'lanhdao3@ubnd.gov.vn',
            permissions: ['ALL', 'LEADER_APPROVAL', 'SCHEDULES', 'COMPLAINTS']
        }
    },
    'swagger_reception_demo': {
        password: 'Swagger@2026',
        user: {
            userId: '50000000-0000-4000-8000-000000000001',
            username: 'swagger_reception_demo',
            fullName: 'Cán bộ Demo Swagger',
            role: 'OFFICER',
            email: 'swagger.reception.demo@example.local',
            permissions: ['COMPLAINTS', 'SCHEDULES', 'RECEPTION']
        }
    }
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            await validateAuth(credentials);

            let response;
            try {
                const res = await AUTH_API.login(credentials);
                response = res?.data || res;
            } catch (apiErr) {
                // If API failed, fallback to local seed if matched
                const matchedSeed = SEED_ACCOUNTS[credentials.tenDangNhap];
                if (matchedSeed && matchedSeed.password === credentials.matKhau) {
                    const token = createDemoToken(matchedSeed.user);
                    storeTokens(token, token);
                    localStorage.setItem('currentUserRole', matchedSeed.user.role);
                    localStorage.setItem('currentUserId', matchedSeed.user.userId);
                    showToast.success(`Đăng nhập thành công với vai trò ${matchedSeed.user.role}`);
                    return { user: matchedSeed.user };
                }
                throw apiErr;
            }

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
            storeTokens(response.access_token, response.refresh_token);

            const role = decoded?.role || (credentials.tenDangNhap?.startsWith('canbo') ? 'OFFICER' : credentials.tenDangNhap?.startsWith('lanhdao') ? 'LEADER' : 'ADMIN');
            localStorage.setItem('currentUserRole', role);
            localStorage.setItem('currentUserId', decoded?.userId || decoded?.id || 'USR-001');

            showToast.success('Đăng nhập Backend thành công!');

            return {
                user: {
                    userId: decoded?.userId || decoded?.id,
                    username: decoded?.username || credentials.tenDangNhap,
                    role: role,
                    email: decoded?.email || response.email,
                    permissions: decoded?.permissions || [],
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

export const loginUserWithCaptcha = createAsyncThunk(
    'auth/loginUserWithCaptcha',
    async (credentials, { rejectWithValue }) => {
        try {
            await validateAuth(credentials);

            let response;
            try {
                const res = await AUTH_API.loginWithCaptcha(credentials);
                response = res?.data || res;
            } catch (apiErr) {
                // If API failed, fallback to local seed if matched
                const matchedSeed = SEED_ACCOUNTS[credentials.tenDangNhap];
                if (matchedSeed && matchedSeed.password === credentials.matKhau) {
                    const token = createDemoToken(matchedSeed.user);
                    storeTokens(token, token);
                    localStorage.setItem('currentUserRole', matchedSeed.user.role);
                    localStorage.setItem('currentUserId', matchedSeed.user.userId);
                    showToast.success(`Đăng nhập thành công với vai trò ${matchedSeed.user.role}`);
                    return { user: matchedSeed.user };
                }
                throw apiErr;
            }

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
            storeTokens(response.access_token, response.refresh_token);

            const role = decoded?.role || (credentials.tenDangNhap?.startsWith('canbo') ? 'OFFICER' : credentials.tenDangNhap?.startsWith('lanhdao') ? 'LEADER' : 'ADMIN');
            localStorage.setItem('currentUserRole', role);
            localStorage.setItem('currentUserId', decoded?.userId || decoded?.id || 'USR-001');

            showToast.success('Đăng nhập Backend thành công!');

            return {
                user: {
                    userId: decoded?.userId || decoded?.id,
                    username: decoded?.username || credentials.tenDangNhap,
                    role: role,
                    email: decoded?.email || response.email,
                    permissions: decoded?.permissions || [],
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
                    username: decoded.username,
                    role: decoded.role,
                    email: decoded.email,
                    permissions: decoded.permissions || [],
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
