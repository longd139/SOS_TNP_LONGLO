import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AUTH_API } from '../../apis/auth';
import { jwtDecode } from 'jwt-decode';

const TwoFALoginModal = ({ isOpen, onClose, tenDangNhap, onSuccess, onError }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp.trim()) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            setError('Mã OTP phải là 6 chữ số');
            return;
        }

        setIsLoading(true);
        try {
            const response = await AUTH_API.verify2FA({ otp, tenDangNhap });

            if (!response.success) {
                throw new Error(response.message || 'Xác thực 2FA thất bại');
            }

            const tokenData = response.data;
            const accessToken = tokenData.access_token;
            const refreshToken = tokenData.refresh_token;

            if (!accessToken || !refreshToken) {
                throw new Error('Không nhận được token');
            }

            try {
                const decoded = jwtDecode(accessToken);
                if (decoded.exp && decoded.exp <= Date.now() / 1000) {
                    throw new Error('Token hết hạn');
                }
            } catch (decodeError) {
                throw new Error('Token không hợp lệ');
            }

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            setOtp('');
            onSuccess(tokenData);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Xác thực 2FA thất bại';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOtp('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Xác thực 2FA</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Mã OTP đã được gửi. Vui lòng nhập 6 chữ số để hoàn tất đăng nhập.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã OTP (6 chữ số)
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            maxLength="6"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isLoading || otp.length !== 6}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFALoginModal;
