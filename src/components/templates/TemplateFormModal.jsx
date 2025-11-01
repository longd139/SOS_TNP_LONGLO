import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../BaseModal';
import { Upload, Eye, Download } from 'lucide-react';
import { validateTemplateForm } from '../../validator/templateValidator';

const TemplateFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    mode = 'create'
}) => {
    const [formData, setFormData] = useState({
        tenMauDon: '',
        maMauDon: '',
        moTa: '',
        file: null,
        isRemoved: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState('');

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                tenMauDon: initialData.ten_mau_don || '',
                maMauDon: initialData.ma_mau_don || '',
                moTa: initialData.mo_ta || '',
                file: null,
                isRemoved: initialData.is_removed || false
            });
            setFileName('');
        } else {
            setFormData({
                tenMauDon: '',
                maMauDon: '',
                moTa: '',
                file: null,
                isRemoved: false
            });
            setFileName('');
        }
        setErrors({});
    }, [initialData, mode, isOpen]);

    const resetForm = () => {
        setFormData({
            tenMauDon: '',
            maMauDon: '',
            moTa: '',
            file: null,
            isRemoved: false
        });
        setFileName('');
        setErrors({});
        setIsSubmitting(false);
    };

    const validateForm = async () => {
        const { isValid, errors: validationErrors } = await validateTemplateForm(formData, mode === 'edit');
        setErrors(validationErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        
        if (!isValid) {
            alert('Vui lòng kiểm tra lại các trường bắt buộc!');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('tenMauDon', formData.tenMauDon.trim());
            
            formDataToSubmit.append('maMauDon', formData.maMauDon.trim().toUpperCase());

            if (formData.moTa.trim()) {
                formDataToSubmit.append('moTa', formData.moTa.trim());
            }

            if (mode === 'edit') {
                formDataToSubmit.append('isRemoved', formData.isRemoved);
            }

            if (formData.file) {
                formDataToSubmit.append('file', formData.file);
            }

            await onSubmit(formDataToSubmit);
            resetForm();
        } catch (error) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Có lỗi xảy ra khi lưu biểu mẫu!');
            }
        } finally {
            setIsSubmitting(false);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Chỉ chấp nhận file PDF!');
                e.target.value = '';
                return;
            }
            updateField('file', file);
            setFileName(file.name);
        }
    };

    const handleRemoveFile = () => {
        setFileName('');
        updateField('file', null);
    };

    const modalTitle = mode === 'create' ? 'Thêm biểu mẫu mới' : 'Chỉnh sửa biểu mẫu';
    const submitText = mode === 'create' ? 'Tạo biểu mẫu' : 'Cập nhật';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={modalTitle}
            size="lg"
            footer={
                <ModalFooter
                    onCancel={handleClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText={submitText}
                    disabled={isSubmitting}
                />
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên biểu mẫu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.tenMauDon}
                        onChange={(e) => updateField('tenMauDon', e.target.value)}
                        placeholder="Nhập tên biểu mẫu..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tenMauDon ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.tenMauDon && (
                        <p className="mt-1 text-sm text-red-600">{errors.tenMauDon}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã biểu mẫu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.maMauDon}
                        onChange={(e) => updateField('maMauDon', e.target.value)}
                        placeholder="Nhập mã biểu mẫu"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.maMauDon ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.maMauDon && (
                        <p className="mt-1 text-sm text-red-600">{errors.maMauDon}</p>
                    )}
                    {formData.maMauDon && (
                        <p className="mt-1 text-xs text-gray-500">
                            Sẽ được lưu là: <span className="font-semibold">{formData.maMauDon.toUpperCase()}</span>
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                    </label>
                    <textarea
                        value={formData.moTa}
                        onChange={(e) => updateField('moTa', e.target.value)}
                        placeholder="Nhập mô tả biểu mẫu..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        File PDF {mode === 'create' && <span className="text-red-500">*</span>}
                    </label>

                    {mode === 'edit' && initialData?.url_file_pdf && !fileName && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0 max-w-[50%]">
                                    <p className="text-sm font-medium text-gray-900 truncate" title={initialData.url_file_pdf.split('/').pop()}>
                                        {initialData.url_file_pdf.split('/').pop()}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {initialData.kich_thuoc_file_mb} MB
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                                    <a
                                        href={`${baseUrl}${initialData.url_file_pdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                                        title="Xem file PDF"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={`${baseUrl}${initialData.url_file_pdf}`}
                                        download
                                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                                        title="Tải xuống file PDF"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {fileName && (
                        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0 max-w-[50%]">
                                    <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
                                        {fileName}
                                    </p>
                                    <p className="text-xs text-green-600">
                                        File mới sẽ được upload khi lưu
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-100 rounded transition-colors flex-shrink-0 ml-auto"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.file ? 'border-red-500' : 'border-gray-300'
                        }`}>
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <div className="mb-2">
                            <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                {fileName ? 'Chọn file khác' : (mode === 'edit' ? 'Thay đổi file PDF' : 'Chọn file PDF')}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {!fileName && mode === 'create' && (
                            <p className="text-xs text-gray-500 mt-2">
                                Chỉ chấp nhận file PDF, tối đa 1 file
                            </p>
                        )}
                        {!fileName && mode === 'edit' && (
                            <p className="text-xs text-gray-500 mt-2">
                                Chọn file mới để thay thế file hiện tại
                            </p>
                        )}
                    </div>
                    {errors.file && (
                        <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                    )}
                </div>

                {mode === 'edit' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative inline-block w-12 h-6">
                                <input
                                    type="checkbox"
                                    checked={formData.isRemoved}
                                    onChange={(e) => updateField('isRemoved', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                    Đánh dấu xóa biểu mẫu
                                </span>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

TemplateFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    mode: PropTypes.oneOf(['create', 'edit'])
};

export default TemplateFormModal;
