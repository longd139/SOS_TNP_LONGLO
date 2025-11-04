import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { validateAreaForm } from '../../validator/areaValidator';

const AreaFormModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        ten_linh_vuc: '',
        mo_ta: ''
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
                ten_linh_vuc: '',
                mo_ta: ''
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error submitting area:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            ten_linh_vuc: '',
            mo_ta: ''
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
                        value={formData.ten_linh_vuc}
                        onChange={(e) => handleChange('ten_linh_vuc', e.target.value)}
                        placeholder="Nhập tên lĩnh vực..."
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.ten_linh_vuc
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    />
                    {errors.ten_linh_vuc && (
                        <p className="mt-1 text-xs text-red-600">{errors.ten_linh_vuc}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        value={formData.mo_ta}
                        onChange={(e) => handleChange('mo_ta', e.target.value)}
                        placeholder="Nhập mô tả về lĩnh vực..."
                        rows="3"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.mo_ta
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    />
                    {errors.mo_ta && (
                        <p className="mt-1 text-xs text-red-600">{errors.mo_ta}</p>
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
