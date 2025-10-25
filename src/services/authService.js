import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "https://ubnd-be.noah-group.org/api/auths";

export const login = async  (tenDangNhap, matKhau) => {
    try {
        const res = await axios.post("https://ubnd-be.noah-group.org/api/auths/login", { tenDangNhap, matKhau });
        return res.data;
    }catch (error) {
        throw error.response.data|| { mesage : "lỗi kết nối máy chủ"};
    }
};
export const verifyOTP = async (tempToken, otp) => {
    try {
        const res = await axios.post("https://ubnd-be.noah-group.org/api/auths/verify-2fa", { tempToken, otp });
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: "Xác thực OTP thất bại" };
    }
};
export const getProfile  = async (token) => { 
    try {
        const res = await axios.get("https://ubnd-be.noah-group.org/api/users/my-profile", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return res.data;
    }catch (error) {
        throw error.response.data|| { mesage : "không lấy được thông tin của người dùng"};
    }
};
