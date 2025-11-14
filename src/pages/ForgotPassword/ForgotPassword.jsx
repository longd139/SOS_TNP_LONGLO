import { useState } from "react";
import { Mail, AlertCircle, Loader2, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpToEmail, resetPassword } from "../../features/auth/authThunks";
import ROUTE_PATH from "../../constants/routes";
import { showToast } from "../../utils/toastNotification";

export default function ForgotPassword() {
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [matKhauMoi, setMatKhauMoi] = useState("");
    const [confirmMatKhauMoi, setConfirmMatKhauMoi] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { loading: authLoading } = useSelector((state) => state.auth);
    const [sendOtpLoading, setSendOtpLoading] = useState(false);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        setSendOtpLoading(true);

        try {
            const result = await dispatch(sendOtpToEmail({ email }));
            
            if (sendOtpToEmail.fulfilled.match(result)) {
                setStep(2);
            } else {
                setValidationErrors(result.payload?.errors || {});
            }
        } catch (error) {
            showToast.error("Có lỗi xảy ra khi gửi OTP");
        } finally {
            setSendOtpLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        try {
            const result = await dispatch(resetPassword({
                email,
                matKhauMoi,
                confirmMatKhauMoi,
                otp
            }));
            
            if (resetPassword.fulfilled.match(result)) {
                navigate(ROUTE_PATH.LOGIN, { replace: true });
            } else {
                setValidationErrors(result.payload?.errors || {});
            }
        } catch (error) {
            showToast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
        }
    };

    const handleBackToStep1 = () => {
        setStep(1);
        setOtp("");
        setMatKhauMoi("");
        setConfirmMatKhauMoi("");
        setValidationErrors({});
    };

    const handleBackToLogin = () => {
        navigate(ROUTE_PATH.LOGIN);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-[450px] text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        {step === 1 ? (
                            <Mail className="text-blue-600 w-8 h-8" />
                        ) : (
                            <Lock className="text-blue-600 w-8 h-8" />
                        )}
                    </div>
                </div>

                <h1 className="text-lg font-semibold">
                    {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                    {step === 1 
                        ? "Nhập email để nhận mã OTP đặt lại mật khẩu"
                        : "Nhập mã OTP và mật khẩu mới"
                    }
                </p>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4 text-left" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    placeholder="Nhập địa chỉ email của bạn"
                                    className={`pl-10 w-full border rounded-lg py-2 ${
                                        validationErrors.email ? "border-red-400" : "border-gray-300"
                                    }`}
                                    disabled={sendOtpLoading}
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={sendOtpLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {sendOtpLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {sendOtpLoading ? "Đang gửi..." : "Gửi mã OTP"}
                        </button>

                        <div className="text-center mt-2">
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
                            >
                                <ArrowLeft size={14} />
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4 text-left" noValidate>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle size={16} />
                                <span className="text-sm">
                                    Mã OTP đã được gửi đến: <strong>{email}</strong>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Mã OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleInputChange(setOtp)}
                                placeholder=""
                                maxLength={6}
                                autoComplete="off"
                                className={`w-full border rounded-lg py-2 px-3 text-center text-lg tracking-widest ${
                                    validationErrors.otp ? "border-red-400" : "border-gray-300"
                                }`}
                                disabled={authLoading}
                            />
                            {validationErrors.otp && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.otp}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    value={matKhauMoi}
                                    onChange={handleInputChange(setMatKhauMoi)}
                                    placeholder="Nhập mật khẩu mới"
                                    className={`pl-10 w-full border rounded-lg py-2 ${
                                        validationErrors.matKhauMoi ? "border-red-400" : "border-gray-300"
                                    }`}
                                    disabled={authLoading}
                                />
                            </div>
                            {validationErrors.matKhauMoi && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.matKhauMoi}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    value={confirmMatKhauMoi}
                                    onChange={handleInputChange(setConfirmMatKhauMoi)}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className={`pl-10 w-full border rounded-lg py-2 ${
                                        validationErrors.confirmMatKhauMoi ? "border-red-400" : "border-gray-300"
                                    }`}
                                    disabled={authLoading}
                                />
                            </div>
                            {validationErrors.confirmMatKhauMoi && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmMatKhauMoi}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleBackToStep1}
                                disabled={authLoading}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                disabled={authLoading}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {authLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                            </button>
                        </div>

                        <div className="text-center mt-2">
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
                            >
                                <ArrowLeft size={14} />
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
