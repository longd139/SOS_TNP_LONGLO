import React from 'react';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { ROLE_LABELS } from '../../constants/role';
import { useUserForm } from '../../hooks/useUserForm';

const UserModal = ({
    isOpen = false,
    onClose,
    onSubmit,
    user = null,
    loading = false
}) => {
    const {
        formData,
        errors,
        isEditMode,
        handleInputChange,
        validateForm,
        resetForm,
        prepareSubmitData
    } = useUserForm({ initialUser: user, isOpen });

    const handleSubmit = async () => {
        const isValid = await validateForm();

        if (isValid) {
            const submitData = prepareSubmitData();
            await onSubmit(submitData);
        }
    };

    const handleClose = () => {
        resetForm();
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
                {!isEditMode && (
                    <>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="VD: admin01"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="VD: nguyenvana@tangnhonphu.gov.vn"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </>
                )}

                {isEditMode && (
                    <>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="VD: Nguyễn Văn A"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 required-label">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="VD: 0901234567"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>
                    </>
                )}

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 required-label">
                        Vai trò
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.role ? 'border-red-500' : 'border-gray-300'
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

                {isEditMode && (
                    <div>
                        <label htmlFor="active" className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                Tài khoản đang hoạt động
                            </span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                            Bỏ chọn để khóa tài khoản này
                        </p>
                    </div>
                )}

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
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nhập lại mật khẩu"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </BaseModal>
    );
};

export default UserModal;