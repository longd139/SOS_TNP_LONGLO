import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { showToast } from '../../utils/toastNotification';

const CategoryNewsModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    mode = 'create',
    isLoading = false
}) => {
    const [formData, setFormData] = useState({
        ten: '',
        moTa: ''
    });
    const [errors, setErrors] = useState({});

    const prevIsOpen = useRef(false);
    const prevInitialDataId = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const isJustOpened = !prevIsOpen.current;
            const isDataChanged = mode === 'edit' && initialData && prevInitialDataId.current !== initialData.id;

            if (isJustOpened || isDataChanged) {
                if (mode === 'edit' && initialData) {
                    prevInitialDataId.current = initialData.id;
                    setFormData({
                        ten: initialData.ten_danh_muc || initialData.ten || initialData.name || '',
                        moTa: initialData.mo_ta || initialData.moTa || ''
                    });
                } else if (mode === 'create') {
                    prevInitialDataId.current = null;
                    setFormData({
                        ten: '',
                        moTa: ''
                    });
                }
                setErrors({});
            }
        }
        prevIsOpen.current = isOpen;
    }, [initialData, mode, isOpen]);

    const resetForm = () => {
        setFormData({
            ten: '',
            moTa: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.ten || !formData.ten.trim()) {
            newErrors.ten = 'Tên danh mục là bắt buộc';
        } else if (formData.ten.trim().length < 2) {
            newErrors.ten = 'Tên danh mục phải có ít nhất 2 ký tự';
        } else if (formData.ten.trim().length > 200) {
            newErrors.ten = 'Tên danh mục không được vượt quá 200 ký tự';
        }

        if (formData.moTa && formData.moTa.trim().length > 1000) {
            newErrors.moTa = 'Mô tả không được vượt quá 1000 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        const isValid = validateForm();

        if (!isValid) {
            showToast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
            return;
        }

        try {
            const payload = {
                tenDanhMuc: formData.ten.trim(),
                moTa: formData.moTa?.trim() || null
            };
            await onSubmit(payload);
            resetForm();
        } catch (error) {
            // Error handled by parent
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const modalTitle = mode === 'create' ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục';
    const submitText = mode === 'create' ? 'Tạo danh mục' : 'Cập nhật';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={modalTitle}
            size="xl"
            footer={
                <ModalFooter
                    onCancel={handleClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText={submitText}
                    submitDisabled={isLoading}
                    submitLoading={isLoading}
                />
            }
        >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                        Tên danh mục
                    </label>
                    <input
                        type="text"
                        value={formData.ten}
                        onChange={(e) => updateField('ten', e.target.value)}
                        placeholder="Nhập tên danh mục..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ten ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.ten && (
                        <p className="mt-1 text-sm text-red-600">{errors.ten}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                    </label>
                    <textarea
                        value={formData.moTa}
                        onChange={(e) => updateField('moTa', e.target.value)}
                        placeholder="Nhập mô tả danh mục..."
                        rows="4"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.moTa ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.moTa && (
                        <p className="mt-1 text-sm text-red-600">{errors.moTa}</p>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};

CategoryNewsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    mode: PropTypes.oneOf(['create', 'edit']),
    isLoading: PropTypes.bool
};

export default CategoryNewsModal;