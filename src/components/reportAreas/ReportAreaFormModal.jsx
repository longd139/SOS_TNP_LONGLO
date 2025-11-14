import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { validateReportArea } from '../../validator/reportAreaValidator';
import { showToast } from '../../utils/toastNotification';

const ReportAreaFormModal = ({
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

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                ten: initialData.ten || '',
                moTa: initialData.mo_ta || initialData.moTa || ''
            });
        } else {
            setFormData({
                ten: '',
                moTa: ''
            });
        }
        setErrors({});
    }, [initialData, mode, isOpen]);

    const resetForm = () => {
        setFormData({
            ten: '',
            moTa: ''
        });
        setErrors({});
    };

    const validateForm = async () => {
        const { isValid, errors: validationErrors } = await validateReportArea(formData);
        setErrors(validationErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        
        if (!isValid) {
            showToast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
            return;
        }

        try {
            await onSubmit({
                ten: formData.ten.trim(),
                moTa: formData.moTa?.trim() || null
            });
            resetForm();
        } catch (error) {
            showToast.error(error.message || 'Đã có lỗi xảy ra khi gửi dữ liệu!');
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

    const modalTitle = mode === 'create' ? 'Thêm lĩnh vực mới' : 'Chỉnh sửa lĩnh vực';
    const submitText = mode === 'create' ? 'Tạo lĩnh vực' : 'Cập nhật';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={modalTitle}
            size="xl"
            className="max-w-5xl"
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
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                        Tên lĩnh vực
                    </label>
                    <input
                        type="text"
                        value={formData.ten}
                        onChange={(e) => updateField('ten', e.target.value)}
                        placeholder="Nhập tên lĩnh vực..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.ten ? 'border-red-500' : 'border-gray-300'
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
                        placeholder="Nhập mô tả lĩnh vực..."
                        rows="4"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.moTa ? 'border-red-500' : 'border-gray-300'
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

ReportAreaFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    mode: PropTypes.oneOf(['create', 'edit']),
    isLoading: PropTypes.bool
};

export default ReportAreaFormModal;
