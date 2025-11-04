import React, { useState, useEffect } from 'react';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCategories } from '../../hooks/useCategories';
import { downloadUtils } from '../../utils/downLoadUtils';
import { validateNewsForm } from '../../validator/newsValidator';
import { STATUS_NEWS, STATUS_NEWS_OPTIONS } from '../../constants/status';
import NewsPreviewModal from './NewsPreviewModal';

const NewsFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
    const [formData, setFormData] = useState({
        idDanhMuc: '',
        tieuDe: '',
        noiDung: '',
        trangThai: STATUS_NEWS.DRAFT,
        tacGia: '',
        isRemoved: false,
        file: null
    });
    const [filePreview, setFilePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { activeCategories, loading: categoriesLoading } = useCategories({ autoFetch: true, isRemoved: false });

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'align',
        'link', 'image'
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                idDanhMuc: initialData.id_danh_muc || '',
                tieuDe: initialData.tieu_de || '',
                noiDung: initialData.noi_dung || '',
                trangThai: initialData.trang_thai || STATUS_NEWS.DRAFT,
                tacGia: initialData.tac_gia || '',
                isRemoved: initialData.is_removed || false,
                file: null
            });
            if (initialData.url_anh_dai_dien) {
                const fullImageUrl = downloadUtils.handleViewImage(initialData);
                setFilePreview(fullImageUrl);
            }
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setFormData({
            idDanhMuc: '',
            tieuDe: '',
            noiDung: '',
            trangThai: STATUS_NEWS.DRAFT,
            tacGia: '',
            isRemoved: false,
            file: null
        });
        setFilePreview(null);
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleContentChange = (value) => {
        setFormData(prev => ({
            ...prev,
            noiDung: value
        }));
        if (errors.noiDung) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.noiDung;
                return newErrors;
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);

            if (errors.file) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.file;
                    return newErrors;
                });
            }
        }
    };

    const validateForm = async () => {
        const dataToValidate = {
            idDanhMuc: formData.idDanhMuc,
            tieuDe: formData.tieuDe,
            noiDung: formData.noiDung,
            trangThai: formData.trangThai,
            file: !initialData ? formData.file : (formData.file || 'existing')
        };

        const { isValid, errors: validationErrors } = await validateNewsForm(dataToValidate);
        
        if (!isValid) {
            setErrors(validationErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        const submitData = new FormData();
        submitData.append('idDanhMuc', formData.idDanhMuc);
        submitData.append('tieuDe', formData.tieuDe);
        submitData.append('noiDung', formData.noiDung);
        submitData.append('trangThai', formData.trangThai);

        if (initialData) {
            submitData.append('isRemoved', formData.isRemoved);
        }

        if (formData.tacGia) {
            submitData.append('tacGia', formData.tacGia);
        }
        if (formData.file) {
            submitData.append('file', formData.file);
        }

        onSubmit(submitData);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handlePreview = () => {
        const selectedCategory = activeCategories.find(cat => cat.id === formData.idDanhMuc);
        setIsPreviewOpen(true);
    };

    const getPreviewData = () => {
        const selectedCategory = activeCategories.find(cat => cat.id === formData.idDanhMuc);
        return {
            tieuDe: formData.tieuDe,
            noiDung: formData.noiDung,
            trangThai: formData.trangThai,
            tacGia: formData.tacGia,
            filePreview: filePreview,
            categoryName: selectedCategory?.ten_danh_muc || 'Chưa chọn danh mục'
        };
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                title={initialData ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                size="lg"
                footer={
                    <ModalFooter
                        onCancel={handlePreview}
                        onSubmit={handleSubmit}
                        cancelText="Xem trước"
                        submitText="Lưu bài viết"
                        submitDisabled={isLoading}
                        submitLoading={isLoading}
                    />
                }
            >
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                        Tiêu đề
                    </label>
                    <input
                        type="text"
                        name="tieuDe"
                        value={formData.tieuDe}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu đề bài viết..."
                        className={`w-full px-2.5 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tieuDe ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.tieuDe && (
                        <p className="mt-0.5 text-sm text-red-600">{errors.tieuDe}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 -mx-1 px-1 relative z-10">
                    <div className="relative px-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                            Loại bài viết
                        </label>
                        <select
                            name="idDanhMuc"
                            value={formData.idDanhMuc}
                            onChange={handleInputChange}
                            disabled={categoriesLoading}
                            className={`w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idDanhMuc ? 'border-red-500' : ''} ${categoriesLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {activeCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.ten_danh_muc}
                                </option>
                            ))}
                        </select>
                        {errors.idDanhMuc && (
                            <p className="mt-0.5 text-sm text-red-600">{errors.idDanhMuc}</p>
                        )}
                    </div>

                    <div className="relative px-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                            Trạng thái
                        </label>
                        <select
                            name="trangThai"
                            value={formData.trangThai}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {STATUS_NEWS_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {initialData && (
                    <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isRemoved"
                                checked={formData.isRemoved}
                                onChange={(e) => setFormData(prev => ({ ...prev, isRemoved: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Đánh dấu là đã xóa
                            </span>
                        </label>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh đại diện {!initialData && <span className="text-red-500">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {filePreview ? (
                            <div className="space-y-2">
                                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={filePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilePreview(null);
                                        setFormData(prev => ({ ...prev, file: null }));
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Xóa ảnh
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <svg
                                    className="mx-auto h-10 w-10 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <div className="mt-1.5">
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                                    >
                                        Click để tải ảnh lên
                                    </label>
                                    <input
                                        id="file-upload"
                                        name="file"
                                        type="file"
                                        className="sr-only"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    PNG, JPG tối đa 5MB
                                </p>
                            </div>
                        )}
                    </div>
                    {errors.file && (
                        <p className="mt-0.5 text-sm text-red-600">{errors.file}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung <span className="text-red-500">*</span>
                    </label>
                    <div className={`border rounded-md ${errors.noiDung ? 'border-red-500' : 'border-gray-300'}`}>
                        <ReactQuill
                            theme="snow"
                            value={formData.noiDung}
                            onChange={handleContentChange}
                            modules={modules}
                            formats={formats}
                            placeholder="Nhập nội dung bài viết..."
                            className="bg-white"
                            style={{ minHeight: '150px' }}
                        />
                    </div>
                    {errors.noiDung && (
                        <p className="mt-0.5 text-sm text-red-600">{errors.noiDung}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tác giả
                    </label>
                    <input
                        type="text"
                        name="tacGia"
                        value={formData.tacGia}
                        onChange={handleInputChange}
                        placeholder="Nhập tên tác giả..."
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày xuất bản
                    </label>
                    <input
                        type="date"
                        name="ngayXuatBan"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                    />
                </div>
            </div>
        </BaseModal>

        <NewsPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            newsData={getPreviewData()}
            isPreview={true}
        />
        </>
    );
};

export default NewsFormModal;
