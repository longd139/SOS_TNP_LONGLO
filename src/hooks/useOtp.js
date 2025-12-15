import { useState } from "react";
import { AUTH_API } from "../apis/auth";

export const useOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const sendOtp = async ({ email, type = "LOGIN" }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AUTH_API.sendOtp({ email, type }); 
      setSuccess(true);
      setMessage("Mã OTP đã được gửi tới email của bạn!");
      return { success: true, data: result };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Không thể gửi mã OTP!";
      setError(msg);
      setSuccess(false);
      setMessage(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async ({ otp, tenDangNhap }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AUTH_API.verify2FA({ otp, tenDangNhap }); 
      const accessToken =
        data?.accessToken ?? data?.token ?? data?.access_token ?? null;
      const isOk = data?.success ?? !!accessToken;

      if (isOk && accessToken) {
        setSuccess(true);
        setMessage("Xác thực OTP thành công!");
        return { success: true, data };
      }
      const msg = data?.message || "OTP không hợp lệ hoặc đã hết hạn.";
      setError(msg);
      return { success: false, message: msg };
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi xác minh mã OTP.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, verifyOtp, loading, error, success, message };
};
