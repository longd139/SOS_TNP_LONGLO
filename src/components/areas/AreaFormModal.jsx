import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { validateAreaForm } from '../../validator/areaValidator';
import { showToast } from '../../utils/toastNotification';

let _persistedAreaForm = null;
let _persistedAreaId = null;

const AreaFormModal = ({ isOpen, onClose, onSubmit, initialData = null, mode = 'create', isLoading = false }) => {
    const [formData, setFormData] = useState({
        tenLinhVuc: '',
        moTa: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const prevIsOpen = useRef(false);

    useEffect(() => {
        if (!prevIsOpen.current && isOpen) {
            if (mode === 'edit' && initialData && _persistedAreaId !== initialData.id) {
                _persistedAreaForm = null;
                _persistedAreaId = initialData.id;
            }

            if (mode === 'create' && _persistedAreaId !== null) {
                _persistedAreaForm = null;
                _persistedAreaId = null;
            }

            if (_persistedAreaForm) {
                setFormData(_persistedAreaForm);
            } else if (initialData && mode === 'edit') {
                setFormData({
                    tenLinhVuc: initialData.ten_linh_vuc || '',
                    moTa: initialData.mo_ta || ''
                });
            } else if (mode === 'create') {
                setFormData({
                    tenLinhVuc: '',
                    moTa: ''
                });
            }
        }
        prevIsOpen.current = isOpen;
    }, [isOpen, initialData, mode]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        _persistedAreaForm = { ...formData, [field]: value };
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const validation = await validateAreaForm(formData);

            if (!validation.isValid) {
                setErrors(validation.errors);
                showToast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
                setIsSubmitting(false);
                return;
            }

            await onSubmit(formData);

            setFormData({
                tenLinhVuc: '',
                moTa: ''
            });
            setErrors({});
            _persistedAreaForm = null;
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            tenLinhVuc: '',
            moTa: ''
        });
        setErrors({});
        _persistedAreaForm = null;
        _persistedAreaId = null;
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={mode === 'create' ? 'Thêm lĩnh vực mới' : 'Chỉnh sửa lĩnh vực'}
            size="xl"
            className="max-w-5xl "
            footer={
                <ModalFooter
                    onCancel={handleClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText={mode === 'create' ? 'Tạo lĩnh vực' : 'Cập nhật'}
                    submitDisabled={isSubmitting || isLoading}
                    submitLoading={isSubmitting || isLoading}
                />
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                        Tên lĩnh vực
                    </label>
                    <input
                        type="text"
                        value={formData.tenLinhVuc}
                        onChange={(e) => handleChange('tenLinhVuc', e.target.value)}
                        placeholder="Nhập tên lĩnh vực..."
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${errors.tenLinhVuc
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                    />
                    {errors.tenLinhVuc && (
                        <p className="mt-1 text-xs text-red-600">{errors.tenLinhVuc}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        value={formData.moTa}
                        onChange={(e) => handleChange('moTa', e.target.value)}
                        placeholder="Nhập mô tả về lĩnh vực..."
                        rows="3"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${errors.moTa
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                    />
                    {errors.moTa && (
                        <p className="mt-1 text-xs text-red-600">{errors.moTa}</p>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};

AreaFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    mode: PropTypes.oneOf(['create', 'edit']),
    isLoading: PropTypes.bool
};

export default AreaFormModal;
