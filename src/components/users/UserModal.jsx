import React, { useEffect, useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { useUserForm } from '../../hooks/useUserForm';
import { useRoles } from '../../hooks/useRoles';
import { Search, X, ChevronDown } from 'lucide-react';

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
        prepareSubmitData,
        updateField
    } = useUserForm({ initialUser: user, isOpen });

    const { allRoles, allRolesLoading, loadAllRoles } = useRoles();

    const [roleSearch, setRoleSearch] = useState('');
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const roleInputRef = useRef(null);
    const roleDropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            loadAllRoles();
        }
    }, [isOpen, loadAllRoles]);

    useEffect(() => {
        if (isOpen && formData.role && allRoles.length > 0) {
            const selectedRole = allRoles.find(r => r.id === formData.role || r.name === formData.role);
            if (selectedRole) {
                setRoleSearch(selectedRole.name);
                if (formData.role !== selectedRole.id) {
                    updateField('role', selectedRole.id);
                }
            }
        } else if (!isOpen) {
            setRoleSearch('');
            setIsRoleDropdownOpen(false);
        }
    }, [isOpen, formData.role, allRoles, updateField]);

    useEffect(() => {
        const updatePosition = () => {
            if (roleInputRef.current && isRoleDropdownOpen) {
                const rect = roleInputRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };

        if (isRoleDropdownOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isRoleDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                roleDropdownRef.current &&
                !roleDropdownRef.current.contains(event.target) &&
                roleInputRef.current &&
                !roleInputRef.current.contains(event.target)
            ) {
                setIsRoleDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        const isValid = await validateForm();

        if (isValid) {
            const submitData = prepareSubmitData();
            await onSubmit(submitData);
        }
    };

    const handleClose = () => {
        resetForm();
        setRoleSearch('');
        setIsRoleDropdownOpen(false);
        onClose();
    };

    const activeRoles = useMemo(() => 
        allRoles.filter(role => role.is_active !== false),
        [allRoles]
    );

    const filteredRoles = useMemo(() => {
        if (!roleSearch.trim()) return activeRoles;
        const searchLower = roleSearch.toLowerCase();
        return activeRoles.filter(role =>
            role.name?.toLowerCase().includes(searchLower) ||
            role.description?.toLowerCase().includes(searchLower)
        );
    }, [activeRoles, roleSearch]);

    const handleRoleSearchChange = (e) => {
        const value = e.target.value;
        setRoleSearch(value);
        setIsRoleDropdownOpen(true);
        
        if (!value.trim()) {
            updateField('role', '');
        }
    };

    const handleRoleSelect = (role) => {
        updateField('role', role.id);
        setRoleSearch(role.name);
        setIsRoleDropdownOpen(false);
    };

    const handleClearRole = () => {
        updateField('role', '');
        setRoleSearch('');
        setIsRoleDropdownOpen(false);
    };

    const handleRoleInputFocus = () => {
        setIsRoleDropdownOpen(true);
    };

    const renderDropdown = () => {
        if (!isRoleDropdownOpen || allRolesLoading) return null;

        return ReactDOM.createPortal(
            <div
                ref={roleDropdownRef}
                style={{
                    position: 'fixed',
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width,
                    maxHeight: '100px',
                    overflowY: 'auto',
                    zIndex: 9999
                }}
                className="bg-white border border-gray-300 rounded-md shadow-lg"
            >
                {filteredRoles.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                        {activeRoles.length === 0 
                            ? "Không có vai trò nào" 
                            : "Không tìm thấy vai trò phù hợp"}
                    </div>
                ) : (
                    filteredRoles.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => handleRoleSelect(role)}
                            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                                formData.role === role.id ? 'bg-blue-100 text-blue-800' : ''
                            }`}
                        >
                            <div className="font-medium text-sm">{role.name}</div>
                            {role.description && (
                                <div className="text-xs text-gray-500">{role.description}</div>
                            )}
                        </div>
                    ))
                )}
            </div>,
            document.body
        );
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                title={isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
                subtitle='Nhập thông tin tài khoản quản trị viên'
                size="xl"
                className="max-w-5xl"
                footer={
                    <ModalFooter
                        onCancel={handleClose}
                        onSubmit={handleSubmit}
                        cancelText="Hủy"
                        submitText={isEditMode ? 'Cập nhật' : 'Tạo tài khoản'}
                        submitLoading={loading}
                        submitDisabled={loading || allRolesLoading}
                    />
                }
            >
                <div className="grid grid-cols-2 gap-4">
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
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'
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
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="VD: nguyenvana@tangnhonphu.gov.vn"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {isEditMode && (
                        <div className="grid grid-cols-2 gap-4 w-full col-span-2">
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
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
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
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="VD: 0901234567"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="col-span-2 w-full">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 required-label">
                            Vai trò
                        </label>
                        <div className="relative">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    ref={roleInputRef}
                                    type="text"
                                    id="role"
                                    value={roleSearch}
                                    onChange={handleRoleSearchChange}
                                    onFocus={handleRoleInputFocus}
                                    disabled={allRolesLoading}
                                    className={`w-full pl-9 pr-16 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'
                                        } ${allRolesLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder={allRolesLoading ? "Đang tải vai trò..." : "Tìm kiếm vai trò..."}
                                    autoComplete="off"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    {roleSearch && (
                                        <button
                                            type="button"
                                            onClick={handleClearRole}
                                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    <ChevronDown 
                                        size={16} 
                                        className={`text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium text-gray-700 mb-1 ${!isEditMode ? 'required-label' : ''}`}>
                                Mật khẩu {isEditMode && <span className="text-gray-500 text-xs">(Để trống nếu không đổi)</span>}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder={isEditMode ? "Để trống nếu không thay đổi" : "Nhập mật khẩu (tối thiểu 8 ký tự)"}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className={`block text-sm font-medium text-gray-700 mb-1 ${!isEditMode ? 'required-label' : ''}`}>
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder={isEditMode ? "Để trống nếu không thay đổi" : "Nhập lại mật khẩu"}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                </div>
            </BaseModal>
            {renderDropdown()}
        </>
    );
};

export default UserModal;
