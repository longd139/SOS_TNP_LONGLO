import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import BaseModal from '../base/BaseModal';
import { changePassword } from '../../features/auth/authThunks';
import { clearChangePasswordSuccess, clearErrors } from '../../features/auth/authSlice';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { loading, apiError, changePasswordSuccess } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        matKhauHienTai: '',
        matKhauMoi: '',
        confirmMatKhauMoi: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [localErrors, setLocalErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (changePasswordSuccess) {
            setSuccessMessage('Đổi mật khẩu thành công!');
            dispatch(clearChangePasswordSuccess());
            setTimeout(() => {
                handleClose();
            }, 2000);
        }
    }, [changePasswordSuccess, dispatch]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                matKhauHienTai: '',
                matKhauMoi: '',
                confirmMatKhauMoi: '',
            });
            setLocalErrors({});
            setSuccessMessage('');
            dispatch(clearErrors());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const validateForm = () => {
        const errors = {};

        if (!formData.matKhauHienTai) {
            errors.matKhauHienTai = 'Vui lòng nhập mật khẩu cũ';
        }

        if (!formData.matKhauMoi) {
            errors.matKhauMoi = 'Vui lòng nhập mật khẩu mới';
        } else if (formData.matKhauMoi.length < 6) {
            errors.matKhauMoi = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmMatKhauMoi) {
            errors.confirmMatKhauMoi = 'Vui lòng xác nhận mật khẩu mới';
        } else if (formData.matKhauMoi !== formData.confirmMatKhauMoi) {
            errors.confirmMatKhauMoi = 'Mật khẩu xác nhận không khớp';
        }

        if (formData.matKhauHienTai && formData.matKhauMoi && formData.matKhauHienTai === formData.matKhauMoi) {
            errors.matKhauMoi = 'Mật khẩu mới phải khác mật khẩu cũ';
        }

        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(changePassword(formData)).unwrap();
        } catch (error) {

        }
    };

    const handleClose = () => {
        setFormData({
            matKhauHienTai: '',
            matKhauMoi: '',
            confirmMatKhauMoi: '',
        });
        setLocalErrors({});
        setSuccessMessage('');
        dispatch(clearErrors());
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (localErrors[name]) {
            setLocalErrors({ ...localErrors, [name]: '' });
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} title="Đổi mật khẩu">
            <form onSubmit={handleSubmit} className="space-y-4">
                {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        {successMessage}
                    </div>
                )}

                {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {apiError}
                    </div>
                )}

                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Mật khẩu cũ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="matKhauHienTai"
                            value={formData.matKhauHienTai}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu cũ"
                            className={`w-full px-2.5 md:px-3 py-1.5 md:py-2 pr-10 border rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                localErrors.matKhauHienTai ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={loading}
                        >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {localErrors.matKhauHienTai && (
                        <p className="mt-1 text-xs text-red-600">{localErrors.matKhauHienTai}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="matKhauMoi"
                            value={formData.matKhauMoi}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới"
                            className={`w-full px-2.5 md:px-3 py-1.5 md:py-2 pr-10 border rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                localErrors.matKhauMoi ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={loading}
                        >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {localErrors.matKhauMoi && (
                        <p className="mt-1 text-xs text-red-600">{localErrors.matKhauMoi}</p>
                    )}
                </div>


                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirmMatKhauMoi"
                            value={formData.confirmMatKhauMoi}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu mới"
                            className={`w-full px-2.5 md:px-3 py-1.5 md:py-2 pr-10 border rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                localErrors.confirmMatKhauMoi ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={loading}
                        >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {localErrors.confirmMatKhauMoi && (
                        <p className="mt-1 text-xs text-red-600">{localErrors.confirmMatKhauMoi}</p>
                    )}
                </div>

                <div className="flex gap-3 justify-end pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-1.5 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default ChangePasswordModal;