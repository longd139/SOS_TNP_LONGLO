import React, { useState, useEffect } from 'react';
import BaseModal, { ModalFooter } from '../BaseModal';
import { ROLE, ROLE_LABELS } from '../../constants/role';
import { validateUserForm } from '../../validator/userValidator';

const UserModal = ({
    isOpen = false,
    onClose,
    onSubmit,
    user = null,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        role: ROLE.NHAN_VIEN,
        password: '',
        confirmPassword: '',
        active: true
    }); const [errors, setErrors] = useState({});
    const isEditMode = !!user;

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setFormData({
                    username: user.username || '',
                    fullName: user.fullName || '',
                    email: user.email || '',
                    role: user.role || ROLE.NHAN_VIEN,
                    password: '',
                    confirmPassword: '',
                    active: user.active !== false
                });
            } else {
                setFormData({
                    username: '',
                    fullName: '',
                    email: '',
                    role: ROLE.NHAN_VIEN,
                    password: '',
                    confirmPassword: '',
                    active: true
                });
            }
            setErrors({});
        }
    }, [isOpen, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = async () => {
        try {
            const result = await validateUserForm(formData, isEditMode, false);
            setErrors(result.errors || {});
            return result.isValid;
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        
        if (isValid) {
            const submitData = { ...formData };
            if (isEditMode && !formData.password) {
                delete submitData.password;
                delete submitData.confirmPassword;
            }

            onSubmit(submitData);
        }
    };

    const handleClose = () => {
        setFormData({
            username: '',
            fullName: '',
            email: '',
            role: ROLE.NHAN_VIEN,
            password: '',
            confirmPassword: '',
            active: true
        });
        setErrors({});
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
            size="lg"
            footer={
                <ModalFooter
                    onCancel={handleClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText={isEditMode ? 'Cập nhật' : 'Tạo tài khoản'}
                    submitLoading={loading}
                    submitDisabled={loading}
                />
            }
        >
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    {isEditMode ? 'Nhập thông tin tài khoản quản trị viên' : 'Nhập thông tin tài khoản quản trị viên'}
                </p>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={isEditMode}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'
                            } ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="VD: admin01"
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="VD: Nguyễn Văn A"
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="VD: nguyenvana@tangnhonphu.gov.vn"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        {Object.entries(ROLE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {errors.role && (
                        <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                </div>

                {!isEditMode && (
                    <>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập lại mật khẩu"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>Quản trị viên:</strong> Toàn quyền | <strong>Nhân viên:</strong> Xử lý phản ánh |
                                <strong> Lãnh đạo/Phó CT/Chủ tịch:</strong> Chỉ xem
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default UserModal;