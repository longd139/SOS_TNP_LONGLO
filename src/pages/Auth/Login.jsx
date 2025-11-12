import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, Loader2, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogin } from "../../hooks/useLogin";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import { restoreUser } from "../../features/auth/authSlice";
import { fetchMyProfile } from "../../features/userProfile/userProfileThunks";
import TwoFALoginModal from "../../components/twoFactor/TwoFALoginModal";
import ROUTE_PATH from "../../constants/routes";
import { getRedirectPathIfDisabled } from "../../utils/routeRedirectUtils";
import { validateAuth } from "../../validator/loginValidator";

export default function Login() {
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [hasInteracted, setHasInteracted] = useState(false);

    const { login, loading, errors, apiError, requiresTwoFactorAuth, clearErrors } = useLogin();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useAuthRedirect();

    useEffect(() => {
        if (hasInteracted && (tenDangNhap || matKhau)) {
            if (apiError || Object.keys(errors).length > 0) {
                clearErrors();
            }
            if (Object.keys(validationErrors).length > 0) {
                setValidationErrors({});
            }
        }
    }, [tenDangNhap, matKhau]);

    const handleInputChange = (setter) => (e) => {
        setHasInteracted(true);
        setter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasInteracted(true);

        const credentials = { tenDangNhap, matKhau };

        const { valid, errors: validationErrs } = await validateAuth(credentials);
        
        if (!valid) {
            setValidationErrors(validationErrs);
            return;
        }
        
        setValidationErrors({});
        
        const result = await login(credentials);
        if (result?.requiresTwoFactorAuth) {
            setShow2FAModal(true);
            return;
        }
    };
    
    const handle2FASuccess = (result) => {
        setShow2FAModal(false);
        dispatch(restoreUser());
        dispatch(fetchMyProfile());
        const redirectPath = getRedirectPathIfDisabled(ROUTE_PATH.DASHBOARD);
        navigate(redirectPath, { replace: true });
    };

    const handle2FAError = (error) => {
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-[450px] text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <ShieldCheck className="text-blue-600 w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-lg font-semibold">Cổng quản trị viên</h1>
                <p className="text-sm text-gray-500 mb-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                            Tên đăng nhập
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                value={tenDangNhap}
                                onChange={handleInputChange(setTenDangNhap)}
                                placeholder="Nhập tên đăng nhập"
                                className={`pl-10 w-full border rounded-lg py-2 ${validationErrors.tenDangNhap || errors.tenDangNhap ? "border-red-400" : "border-gray-300"
                                    }`}
                                disabled={loading}
                            />
                        </div>
                        {(validationErrors.tenDangNhap || errors.tenDangNhap) && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.tenDangNhap || errors.tenDangNhap}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Lock
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="password"
                                value={matKhau}
                                onChange={handleInputChange(setMatKhau)}
                                placeholder="Nhập mật khẩu"
                                className={`pl-10 pr-10 w-full border rounded-lg py-2 ${validationErrors.matKhau || errors.matKhau ? "border-red-400" : "border-gray-300"
                                    }`}
                                disabled={loading}
                            />
                        </div>
                        {(validationErrors.matKhau || errors.matKhau) && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.matKhau || errors.matKhau}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <div className="text-center mt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                </form>
            </div>

            <TwoFALoginModal
                isOpen={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                tenDangNhap={tenDangNhap}
                onSuccess={handle2FASuccess}
                onError={handle2FAError}
            />
        </div>
    );
}
