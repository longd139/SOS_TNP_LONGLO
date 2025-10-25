import React, { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function Login() {
  const [twoFA, setTwoFA] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch("https://ubnd-be.noah-group.org/api/auths/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenDangNhap: tenDangNhap,
        matKhau: matKhau,
      }),
    });
    const data = await res.json();
    console.log("Kết quả đăng nhập:", data);
    if (data.success || data.message?.includes("thành công")) {
      setStep(2);
      alert("Hệ thống đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra hộp thư!");
    } else {
      alert("Đăng nhập thất bại: " + (data.message || "Sai thông tin đăng nhập."));
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    alert("Đã xảy ra lỗi trong quá trình đăng nhập.");
  } finally {
    setLoading(false);
  }
};

const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch("https://ubnd-be.noah-group.org/api/auths/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenDangNhap: tenDangNhap,
        otp: otp,
      }),
    });

    const data = await res.json();
    console.log("Kết quả xác thực OTP:", data);

<<<<<<< HEAD
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      alert("Xác thực OTP thành công!");
      window.location.href = "/dashboard";
    } else {
      alert("Xác thực thất bại: " + (data.message || "Sai hoặc hết hạn OTP."));
    }
  } catch (error) {
    console.error("Lỗi xác thực OTP:", error);
    alert("Đã xảy ra lỗi khi xác thực OTP.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[380px] text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <ShieldCheck className="text-blue-600 w-8 h-8" />
          </div>
=======
                {apiError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{apiError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={tenDangNhap}
                            onChange={(e) => setTenDangNhap(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                errors.tenDangNhap ? 'border-red-400' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {errors.tenDangNhap && (
                            <p className="text-red-500 text-xs mt-1">{errors.tenDangNhap}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                errors.matKhau ? 'border-red-400' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {errors.matKhau && (
                            <p className="text-red-500 text-xs mt-1">{errors.matKhau}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="2fa"
                            type="checkbox"
                            checked={twoFA}
                            onChange={(e) => setTwoFA(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={loading}
                        />
                        <label htmlFor="2fa" className="text-sm text-gray-700">
                            Bật xác thực 2 yếu tố (2FA)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>

                    <div className="text-center mt-2">
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                </form>
            </div>
>>>>>>> 05a0d7e0fa94dab45b48b80419370be5e0bf58d8
        </div>
        <h1 className="text-lg font-semibold">Cổng quản trị viên</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ứng dụng công dân Phường Tăng Nhơn Phú
        </p>

        {step === 1 && (
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="2fa"
                type="checkbox"
                checked={twoFA}
                onChange={(e) => setTwoFA(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="2fa" className="text-sm text-gray-700">
                Bật xác thực 2 yếu tố (2FA)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>

            <div className="text-center mt-2">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Đang xác minh...
                </span>
              ) : (
                "Xác nhận OTP"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
              }}
              className="w-full border border-gray-400 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Quay lại
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
