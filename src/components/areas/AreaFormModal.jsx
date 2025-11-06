import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { validateAreaForm } from '../../validator/areaValidator';

const AreaFormModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        tenLinhVuc: '',
        moTa: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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
                setIsSubmitting(false);
                return;
            }

            await onSubmit(formData);
            
            setFormData({
                tenLinhVuc: '',
                moTa: ''
            });
            setErrors({});
            onClose();
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
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Thêm lĩnh vực mới"
            size="md"
            footer={
                <ModalFooter
                    onCancel={handleClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText="Tạo lĩnh vực"
                    submitDisabled={isSubmitting}
                    submitLoading={isSubmitting}
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
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.tenLinhVuc
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
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.moTa
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
    onSubmit: PropTypes.func.isRequired
};

export default AreaFormModal;
