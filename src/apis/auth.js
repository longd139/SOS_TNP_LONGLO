import apiClient from "../utils/apiClient";

const loginApi = async (credentials) => {
    try {
        const response = await apiClient.post('/api/auths/login', credentials)
        
        if (response.data.success)  return response.data.data;
        else throw new Error("Đăng nhập thất bại");

    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        throw error;
    }
}

const logoutApi = async () => {
    try {
        const response = await apiClient.post('/api/auths/logout');
        if (response.data.success) return response.data.data;
        else throw new Error("Đăng xuất thất bại");
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error); 
        throw error;
    }
}

const changePasswordApi = async (data) => {
    try {
        const response = await apiClient.put('/api/auths/change-password', data);
        if (response.data.success) return response.data.data;
        else throw new Error("Đổi mật khẩu thất bại");
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        throw error;
    }
}

const status2FA = async () => {
    try {
        const response = await apiClient.post('/api/auths/enable-or-disable-2fa');
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy trạng thái 2FA thất bại");
    } catch (error) {
        console.error("Lỗi khi lấy trạng thái 2FA:", error);
        throw error;
    }
}

const verify2FAApi = async (data) => {
    try {
        const response = await apiClient.post('/api/auths/verify-2fa', {
            otp: data.otp,
            tenDangNhap: data.tenDangNhap,
        });
        if (response.data.success) return response.data.data;
        else throw new Error("Xác thực 2FA thất bại");
    } catch (error) {
        console.error("Lỗi khi xác thực 2FA:", error);
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
            console.log(" OTP sent successfully!");
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Gửi OTP thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi gửi OTP:", error);
        throw error;
    }
};




const resetPasswordApi = async (data) => {
    try {
        const response = await apiClient.put('/api/auths/reset-password', {
            email: data.email,
            newPassword: data.newPassword,
            otp: data.otp
        });
        if (response.data.success) return response.data.data;
        else throw new Error("Đặt lại mật khẩu thất bại");
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        throw error;
    }
}

const verifiedStatus2FAApi = async (otp) => {
    try {
        const response = await apiClient.post('/api/auths/verify-enable-or-disable-2fa', { otp });
        if (response.data.success) return response.data.data;
        else throw new Error("Xác thực trạng thái 2FA thất bại");
    } catch (error) {
        console.error("Lỗi khi lấy trạng thái 2FA:", error);
        throw error;
    }
}

export const AUTH_API = {
    login: loginApi,
    logout: logoutApi,
    changePassword: changePasswordApi,
    status2FA: status2FA,
    verify2FA: verify2FAApi,
    sendOtp: sendOtpApi,
    resetPassword: resetPasswordApi,
    verifiedStatus2FA: verifiedStatus2FAApi,
    
}


