import React, { useState } from 'react';
import BaseModal from '../base/BaseModal';
import { AlertCircle } from 'lucide-react';

const TwoFactorToggleModal = ({ isOpen, onClose, currentStatus, onToggle, isLoading }) => {
    const [error, setError] = useState('');

    const handleToggle = async () => {
        setError('');
        try {
            await onToggle();
        } catch (err) {
            setError(err.message || 'Lỗi khi thay đổi trạng thái 2FA');
        }
    };

    const isEnabled = currentStatus;
    const action = isEnabled ? 'tắt' : 'bật';
    const actionUpper = isEnabled ? 'Tắt' : 'Bật';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`${actionUpper} Xác thực 2FA`}
        >
            <div className="space-y-4">
                {/* Alert */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                        {isEnabled
                            ? 'Bạn sắp tắt xác thực 2 yếu tố. Tài khoản sẽ kém bảo mật hơn.'
                            : 'Bạn sắp bật xác thực 2 yếu tố. Mỗi lần đăng nhập sẽ cần xác nhận OTP.'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {error}
                    </div>
                )}

                {/* Current Status */}
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Trạng thái hiện tại</p>
                    <p className="text-sm font-medium text-gray-900">
                        2FA {isEnabled ? 'đã bật' : 'chưa bật'}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleToggle}
                        className={`px-4 py-1.5 md:py-2 text-xs md:text-sm text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isEnabled
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? `Đang ${action}...` : `${actionUpper} 2FA`}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default TwoFactorToggleModal;
