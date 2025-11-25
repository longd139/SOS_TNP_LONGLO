import apiClient from "../utils/apiClient";

const loginApi = async (credentials) => {
    try {
        const response = await apiClient.post('/api/auths/login', credentials)
        
        if (response.data.success)  return response.data.data;
        else {
            const error = new Error(response.data.message || "Đăng nhập thất bại");
            error.errors = response.data.errors || [];
            throw error;
        }

    } catch (error) {
        if (error.response?.data) {
            const apiError = new Error(error.response.data.message || "Đăng nhập thất bại");
            apiError.errors = error.response.data.errors || [];
            throw apiError;
        }
        throw error;
    }
}

const loginWithCaptchaApi = async (credentials) => {
    try {
        const response = await apiClient.post('/api/auths/login-with-captcha', credentials)
        
        if (response.data.success) return response.data.data;
        else {
            const error = new Error(response.data.message || "Đăng nhập thất bại");
            error.errors = response.data.errors || [];
            throw error;
        }

    } catch (error) {
        if (error.response?.data) {
            const apiError = new Error(error.response.data.message || "Đăng nhập thất bại");
            apiError.errors = error.response.data.errors || [];
            throw apiError;
        }
        throw error;
    }
}

const logoutApi = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        const response = await apiClient.post('/api/auths/logout', {
            refreshToken
        });
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Đăng xuất thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const changePasswordApi = async (data) => {
    try {
        const payload = {
            matKhauHienTai: data.matKhauHienTai,
            matKhauMoi: data.matKhauMoi,
        };
        const response = await apiClient.put('/api/auths/change-password', payload);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Đổi mật khẩu thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const enableOrDisable2FAApi = async () => {
    try {
        const response = await apiClient.post('/api/auths/enable-or-disable-2fa');
        if (response.data.success) return response.data;
        else throw new Error(response.data.message || "Lỗi bật/tắt 2FA");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const status2FA = async () => {
    try {
        const response = await apiClient.post('/api/auths/enable-or-disable-2fa');
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy trạng thái 2FA thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const verify2FAApi = async (data) => {
    try {
        const response = await apiClient.post('/api/auths/verify-2fa', {
            otp: data.otp,
            tenDangNhap: data.tenDangNhap,
        });
        if (response.data.success) return response.data;
        else throw new Error(response.data.message || "Xác thực 2FA thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}
export const sendOtpApi = async ({ email, type = 'LOGIN' }) => {
    try {
        const response = await apiClient.post('/api/auths/send-otp', {
            email,
            type
        });

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Gửi OTP thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const sendOtpToEmailApi = async ({ email }) => {
    try {
        const response = await apiClient.post('/api/auths/send-otp?type=RESET_PASSWORD', {
            email
        });

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Gửi OTP để đặt lại mật khẩu thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};


const resetPasswordApi = async (data) => {
    try {
        const response = await apiClient.put('/api/auths/reset-password', {
            email: data.email,
            newPassword: data.matKhauMoi,
            otp: data.otp
        });
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Đặt lại mật khẩu thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const verifiedStatus2FAApi = async (otp) => {
    try {
        const response = await apiClient.post('/api/auths/verify-enable-or-disable-2fa', { otp });
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Xác thực trạng thái 2FA thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const AUTH_API = {
    login: loginApi,
    loginWithCaptcha: loginWithCaptchaApi,
    logout: logoutApi,
    changePassword: changePasswordApi,
    status2FA: status2FA,
    enableOrDisable2FA: enableOrDisable2FAApi,
    verify2FA: verify2FAApi,
    sendOtp: sendOtpApi,
    sendOtpToEmail: sendOtpToEmailApi,
    resetPassword: resetPasswordApi,
    verifiedStatus2FA: verifiedStatus2FAApi,
}


