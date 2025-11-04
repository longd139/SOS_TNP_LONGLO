import React, { useState } from 'react';
import BaseModal from '../base/BaseModal';

const TwoFactorOTPModal = ({ isOpen, onClose, onVerify, isLoading, action = 'bật' }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

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

        try {
            await onVerify(otp);
            setOtp('');
        } catch (err) {
            setError(err.message || 'Xác thực OTP thất bại');
        }
    };

    const handleClose = () => {
        setOtp('');
        setError('');
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Xác thực OTP"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Instructions */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    Mã OTP đã được gửi. Vui lòng nhập 6 chữ số để xác nhận {action} xác thực 2 yếu tố.
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {error}
                    </div>
                )}

                {/* OTP Input */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Mã OTP (6 chữ số)
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength="6"
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-1.5 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || otp.length !== 6}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default TwoFactorOTPModal;
