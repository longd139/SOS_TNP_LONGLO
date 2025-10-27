import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, Loader2, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");

    const { login, loading, errors, apiError, clearErrors } = useLogin();
    const { isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && isAdmin()) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, isAdmin, navigate]);

    useEffect(() => {
        if (Object.keys(errors).length > 0 || apiError) {
            clearErrors();
        }
    }, [tenDangNhap, matKhau]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            tenDangNhap,
            matKhau
        };

        const result = await login(credentials);

        if (result.success) {
            console.log('Login successful:', result.user);
        } else {
            console.error('Login failed:', result.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-[450px] text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <ShieldCheck className="text-blue-600 w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-lg font-semibold">Cổng quản trị viên</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Ứng dụng công dân Phường Tăng Nhơn Phú
                </p>

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
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={tenDangNhap}
                                onChange={(e) => setTenDangNhap(e.target.value)}
                                placeholder="Nhập tên đăng nhập"
                                className={`pl-10 w-full border rounded-lg py-2 ${errors.tenDangNhap ? 'border-red-400' : 'border-gray-300'
                                    }`}
                                disabled={loading}
                            />
                        </div>
                        {errors.tenDangNhap && (
                            <p className="text-red-500 text-xs mt-1">{errors.tenDangNhap}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={matKhau}
                                onChange={(e) => setMatKhau(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className={`pl-10 pr-10 w-full border rounded-lg py-2 ${errors.matKhau ? 'border-red-400' : 'border-gray-300'
                                    }`}
                                disabled={loading}
                            />
                        </div>
                        {errors.matKhau && (
                            <p className="text-red-500 text-xs mt-1">{errors.matKhau}</p>
                        )}
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
        </div>
    )
}
