import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useOtp } from "../../hooks/useOtp";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import ROUTE_PATH from "../../constants/routes";

export default function OtpModal({ onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { sendOtp, verifyOtp, loading, error } = useOtp();

    useAuthRedirect();

    const { email, tenDangNhap } = useMemo(() => {
        const s = location.state || {};
        if (s?.tenDangNhap) return s;
        try {
            const cached = JSON.parse(sessionStorage.getItem("otp_ctx") || "{}");
            return { email: cached.email, tenDangNhap: cached.tenDangNhap };
        } catch {
            return {};
        }
    }, [location.state]);

    const [otp, setOtp] = useState("");

    if (!tenDangNhap) {
        return (
            <div className="p-4 text-red-600">
                Không có thông tin OTP. Vui lòng quay lại đăng nhập.
                <button onClick={() => navigate(ROUTE_PATH.LOGIN)} className="ml-2 underline text-blue-600">
                    Quay lại
                </button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) return alert("Vui lòng nhập mã OTP.");

        const res = await verifyOtp({ otp, tenDangNhap });

        if (res?.success) {
            const data = res.data ?? res;
            const accessToken =
                data?.accessToken ?? data?.token ?? data?.access_token ?? null;
            const refreshToken =
                data?.refreshToken ?? data?.refresh_token ?? null;

            if (accessToken) localStorage.setItem("accessToken", accessToken);
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

            sessionStorage.removeItem("otp_ctx");

            if (onClose) onClose();
            navigate(ROUTE_PATH.DASHBOARD, { replace: true });
        } else {
            alert(res?.message || "Mã OTP không đúng hoặc đã hết hạn!");
        }
    };

    const handleResendOtp = async () => {
        if (!email) return alert("Không có email để gửi lại mã OTP.");
        const r = await sendOtp({ email, type: "LOGIN" });
        alert(r?.success ? "OTP mới đã được gửi!" : (r?.message || "Không gửi được OTP"));
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-[400px] shadow-lg">
                <div className="flex flex-col items-center mb-4">
                    <div className="bg-blue-600 rounded-full p-3 mb-2">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <h2 className="text-lg font-semibold">Xác thực OTP</h2>
                    {email ? (
                        <p className="text-sm text-gray-500 text-center mt-1">
                            Mã OTP đã được gửi đến <strong>{email}</strong>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 text-center mt-1">
                            Nhập mã OTP cho tài khoản <strong>{tenDangNhap}</strong>
                        </p>
                    )}
                </div>

                {!!error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="Mã OTP (6 chữ số)"
                        maxLength={6}
                        className="w-full border border-gray-300 rounded-lg p-2 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Đang xác thực..." : "Xác thực và đăng nhập"}
                    </button>
                </form>

                <button
                    onClick={() => (onClose ? onClose() : navigate(ROUTE_PATH.LOGIN))}
                    className="w-full text-sm text-gray-500 mt-3 hover:underline"
                >
                    ← Quay lại
                </button>

                <button
                    onClick={handleResendOtp}
                    className="w-full text-sm text-blue-600 mt-2 hover:underline"
                    disabled={loading || !email}
                    title={!email ? "Không có email để gửi lại" : ""}
                >
                    Gửi lại mã OTP
                </button>
            </div>
        </div>
    );
}
