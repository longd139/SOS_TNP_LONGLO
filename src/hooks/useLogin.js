import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import { AUTH_API } from "../apis/auth";
import { validateAuth } from "../validator/loginValidator";
import { ROLE } from "../constants/role";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [otpRequired, setOtpRequired] = useState(false);
    const [email, setEmail] = useState("");

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const validateCredentials = async (credentials) => {
        try {
            await validateAuth(credentials);
            setErrors({});
            return true;
        } catch (validationErrors) {
            const formattedErrors = {};
            if (validationErrors.inner) {
                validationErrors.inner.forEach((error) => {
                    formattedErrors[error.path] = error.message;
                });
            } else {
                formattedErrors.general = "Validation failed";
            }
            setErrors(formattedErrors);
            return false;
        }
    };

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp <= currentTime) throw new Error("Token has expired");
            return {
                userId: decoded.userId,
                role: decoded.role,
                ip: decoded.ip,
                iat: decoded.iat,
                exp: decoded.exp,
            };
        } catch (error) {
            return null;
        }
    };

    const handleRedirect = (role) => {
        if (role === ROLE.ADMIN) navigate("/dashboard", { replace: true });
        else navigate("/", { replace: true });
    };

    const storeTokens = (accessToken, refreshToken = null) => {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    };

    const login = async (credentials) => {
        setLoading(true);
        setApiError("");
        setErrors({});

        try {
            const isValid = await validateCredentials(credentials);
            if (!isValid) {
                setLoading(false);
                return { success: false, errors };
            }

            const res = await AUTH_API.login(credentials);
            const response = res?.data || res;

            if (response?.requireOtp) {
                setOtpRequired(true);
                setEmail(response.email || "");
                navigate("/OtpModal", {
                    state: { email: response.email, tenDangNhap: credentials.tenDangNhap },
                });
                setLoading(false);
                return { success: false, needOtp: true };
            }

            if (!response?.accessToken) throw new Error("Invalid response from server");

            const decodedToken = decodeToken(response.accessToken);
            if (!decodedToken) throw new Error("Invalid token received");

            storeTokens(response.accessToken, response.refreshToken);

            setAuth({
                userId: decodedToken.userId,
                role: decodedToken.role,
                accessToken: response.accessToken,
            });

            handleRedirect(decodedToken.role);

            setLoading(false);
            return {
                success: true,
                user: {
                    userId: decodedToken.userId,
                    role: decodedToken.role,
                    email: response.email,
                },
            };
        } catch (error) {
            setApiError(error.message || "Đăng nhập thất bại");
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const verifyOtp = async ({ otp, tenDangNhap }) => {
        setLoading(true);
        setApiError("");

        try {
            const result = await AUTH_API.verify2FA({ otp, tenDangNhap });

            if (!result.success) throw new Error(result.message || "Xác thực OTP thất bại");
            if (!result.accessToken) throw new Error("Không nhận được accessToken");

            const decodedToken = decodeToken(result.accessToken);
            if (!decodedToken) throw new Error("Không thể giải mã token");

            storeTokens(result.accessToken, result.refreshToken);

            setAuth({
                userId: decodedToken.userId,
                role: decodedToken.role,
                accessToken: result.accessToken,
            });

            setOtpRequired(false);
            handleRedirect(decodedToken.role);
            setLoading(false);

            return { success: true };
        } catch (error) {
            setApiError(error.message || "Xác thực OTP thất bại");
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const clearErrors = () => {
        setErrors({});
        setApiError("");
    };

    return {
        login,
        verifyOtp,
        loading,
        errors,
        apiError,
        otpRequired,
        email,
        clearErrors,
    };
};
