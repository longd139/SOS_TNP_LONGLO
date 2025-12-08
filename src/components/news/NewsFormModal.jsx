import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCategories } from '../../hooks/useCategories';
import { downloadUtils } from '../../utils/downLoadUtils';
import { validateNewsForm } from '../../validator/newsValidator';
import NewsPreviewModal from './NewsPreviewModal';
import { uploadNewsFile } from '../../features/news/newsThunks';
import { showToast } from '../../utils/toastNotification';
import DOMPurify from 'dompurify';

const NewsFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        idDanhMuc: '',
        tieuDe: '',
        noiDung: '',
        tacGia: '',
        isActive: true,
        file: null
    });
    const [filePreview, setFilePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [contentImages, setContentImages] = useState([]);
    const { activeCategories, loading: categoriesLoading } = useCategories({ autoFetch: true });

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
        'list',
        'align',
        'link', 'image',
        'direction',
        'indent'
    ];

    useEffect(() => {
        if (initialData) {
            let processedContent = initialData.noi_dung || '';
            if (initialData.dinh_kem_tin_tuc && initialData.dinh_kem_tin_tuc.length > 0) {
                const baseUrl = process.env.REACT_APP_API_URL;
                initialData.dinh_kem_tin_tuc.forEach((attachment, index) => {
                    const placeholder = `<!--IMAGE_PLACEHOLDER_${index}-->`;
                    if (processedContent.includes(placeholder)) {
                        const imgTag = `<img src="${baseUrl}${attachment.url_file}" alt="content-image" />`;
                        processedContent = processedContent.replace(placeholder, imgTag);
                    }
                });
            }

            setFormData({
                idDanhMuc: initialData.id_danh_muc || '',
                tieuDe: initialData.tieu_de || '',
                noiDung: processedContent,
                tacGia: initialData.tac_gia || '',
                isActive: initialData.is_active !== undefined ? initialData.is_active : true,
                file: null
            });
            if (initialData.url_anh_dai_dien || initialData.urlAnhDaiDien) {
                const fullImageUrl = downloadUtils.handleViewImage(initialData);
                setFilePreview(fullImageUrl);
            }
            setErrors({});
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setFormData({
            idDanhMuc: '',
            tieuDe: '',
            noiDung: '',
            tacGia: '',
            isActive: true,
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
        const isEditMode = !!initialData;
        const hasExistingImage = isEditMode && !!filePreview;

        const dataToValidate = {
            idDanhMuc: formData.idDanhMuc,
            tieuDe: formData.tieuDe,
            noiDung: formData.noiDung,
            tacGia: formData.tacGia,
            file: formData.file
        };

        const { isValid, errors: validationErrors } = await validateNewsForm(
            dataToValidate, 
            isEditMode, 
            hasExistingImage
        );

        if (!isValid) {
            setErrors(validationErrors);
            showToast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
            return false;
        }

        setErrors({});
        return true;
    };

    const extractBase64Images = (html) => {
        const imgRegex = /<img([^>]*)src="data:image\/([^;]+);base64,([^"]+)"([^>]*)>/g;
        const images = [];
        let match;
        let index = 0;

        while ((match = imgRegex.exec(html)) !== null) {
            const beforeSrc = match[1] || '';
            const afterSrc = match[4] || '';
            images.push({
                format: match[2],
                base64: match[3],
                fullTag: match[0],
                placeholder: `<!--IMAGE_PLACEHOLDER_${index}-->`,
                attributes: beforeSrc + afterSrc,
                index: index
            });
            index++;
        }

        return images;
    };

    const replaceBase64WithPlaceholders = (html, images) => {
        let result = html;
        images.forEach((image) => {
            result = result.replace(image.fullTag, image.placeholder);
        });
        return result;
    };

    const ensureLinksOpenInNewTab = (html) => {
        if (!html) return html;
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const anchors = doc.querySelectorAll('a[href]');
            anchors.forEach(a => {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
            });
            const updated = doc.body.innerHTML;
            return DOMPurify.sanitize(updated, { 
                ADD_ATTR: ['target', 'rel', 'class', 'style'],
                ADD_TAGS: ['ol', 'ul', 'li', 'img', 'a', 'p', 'br', 'h1', 'h2', 'h3', 'strong', 'em', 'u'],
                ALLOW_DATA_ATTR: true
            });
        } catch (e) {
            return DOMPurify.sanitize(html, { 
                ADD_ATTR: ['target', 'rel', 'class', 'style'],
                ADD_TAGS: ['ol', 'ul', 'li', 'img', 'a', 'p', 'br', 'h1', 'h2', 'h3', 'strong', 'em', 'u'],
                ALLOW_DATA_ATTR: true
            });
        }
    };

    const base64ToFile = (base64String, format, index) => {
        const byteString = atob(base64String);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: `image/${format}` });
        return new File([blob], `content-image-${index}.${format}`, { type: `image/${format}` });
    };

    const uploadContentImages = async (newsId, images) => {
        const uploadedImages = [];
        let currentNewsId = newsId;

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const file = base64ToFile(image.base64, image.format, i);

            const fileFormData = new FormData();
            if (currentNewsId) {
                fileFormData.append('idTinTuc', currentNewsId);
            } else {
                fileFormData.append('idTinTuc', '');
            }
            fileFormData.append('file', file);

            try {
                const result = await dispatch(uploadNewsFile({ idTinTuc: currentNewsId, fileData: fileFormData })).unwrap();
                
                if (!currentNewsId && result.idTinTuc) {
                    currentNewsId = result.idTinTuc;
                }
                
                if (result.url_file) {
                    uploadedImages.push({
                        placeholder: image.placeholder,
                        url: process.env.REACT_APP_API_URL + result.url_file,
                        attributes: image.attributes,
                        index: image.index
                    });
                }
            } catch (error) {
                showToast.error(`Lỗi khi tải ảnh lên: ${error.message || 'Không xác định'}`);
            }
        }

        return { uploadedImages, newsId: currentNewsId };
    };

    const replacePlaceholdersWithUrls = (html, uploadedImages) => {
        let result = html;
        uploadedImages.forEach((image) => {
            const imgTag = `<img${image.attributes} src="${image.url}" />`;
            result = result.replace(image.placeholder, imgTag);
        });
        return result;
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        const base64Images = extractBase64Images(formData.noiDung);
        setContentImages(base64Images);

        const submitData = new FormData();
        submitData.append('idDanhMuc', formData.idDanhMuc);
        submitData.append('tieuDe', formData.tieuDe);
        
        let contentToSave = formData.noiDung;
        if (base64Images.length > 0) {
            contentToSave = replaceBase64WithPlaceholders(formData.noiDung, base64Images);
        }
        const contentForSubmit = ensureLinksOpenInNewTab(contentToSave);
        submitData.append('noiDung', contentForSubmit);
        
        submitData.append('isActive', String(formData.isActive));

        if (formData.tacGia) {
            submitData.append('tacGia', formData.tacGia);
        }
        if (formData.file) {
            submitData.append('file', formData.file);
        }

        await onSubmit(submitData, async (createdNewsId) => {
            if (base64Images.length > 0 && createdNewsId) {
                const { uploadedImages, newsId } = await uploadContentImages(createdNewsId, base64Images);

                if (uploadedImages.length > 0) {
                    const finalContent = replacePlaceholdersWithUrls(contentToSave, uploadedImages);
                    const finalContentWithLinks = ensureLinksOpenInNewTab(finalContent);

                    const updateFormData = new FormData();
                    updateFormData.append('idDanhMuc', formData.idDanhMuc);
                    updateFormData.append('tieuDe', formData.tieuDe);
                    updateFormData.append('noiDung', finalContentWithLinks);
                    updateFormData.append('isActive', String(formData.isActive));

                    if (formData.tacGia) {
                        updateFormData.append('tacGia', formData.tacGia);
                    }

                    await onSubmit(updateFormData, null, true, createdNewsId);
                }
            }
        });
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
        
        let previewContent = formData.noiDung;
        
        return {
            tieuDe: formData.tieuDe,
            noiDung: previewContent,
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
                subtitle='Nhập thông tin bài viết để đăng tải'
                size="3xl"
                className="max-w-5xl"
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

                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex-1'>
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
                                <option value="" className="text-gray-500">-- Chọn danh mục --</option>
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

                        <div className="flex-shrink-0 mt-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Kích hoạt bài viết
                                </span>
                            </label>
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                            Ảnh đại diện
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 required-label">
                            Nội dung
                        </label>
                        <style>{`
                        .ql-toolbar.ql-snow {
                            display: flex !important;
                            flex-wrap: wrap !important;
                            overflow-x: visible !important;
                            white-space: normal !important;
                            padding: 8px !important;
                            border-bottom: 1px solid #ccc !important;
                        }
                        .ql-toolbar.ql-snow .ql-formats {
                            display: inline-flex !important;
                            margin-right: 8px !important;
                            margin-bottom: 4px !important;
                        }
                        .ql-toolbar .ql-picker {
                            position: relative !important;
                        }
                        .ql-toolbar .ql-picker.ql-header {
                            width: 95px !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-label {
                            font-size: 13px !important;
                            padding: 5px 8px !important;
                            border: 1px solid #ccc !important;
                            border-radius: 4px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: flex-start !important;
                            text-align: left !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-label::before {
                            content: 'Định dạng' !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-options {
                            position: absolute !important;
                            top: 100% !important;
                            left: 0 !important;
                            z-index: 9999 !important;
                            background: white !important;
                            border: 1px solid #ccc !important;
                            border-radius: 4px !important;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                            margin-top: 2px !important;
                            width: 160px !important;
                            max-height: 200px !important;
                            overflow-y: auto !important;
                            display: none !important;
                        }
                        .ql-toolbar .ql-picker.ql-header.ql-expanded .ql-picker-options {
                            display: block !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item {
                            font-size: 14px !important;
                            padding: 8px 12px !important;
                            cursor: pointer !important;
                            border-bottom: 1px solid #f0f0f0 !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item:last-child {
                            border-bottom: none !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item:hover {
                            background-color: #e8f4ff !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item.ql-selected {
                            background-color: #d4edff !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
                            content: 'Tiêu đề 1' !important;
                            font-size: 18px !important;
                            font-weight: bold !important;
                            display: block !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
                            content: 'Tiêu đề 2' !important;
                            font-size: 16px !important;
                            font-weight: bold !important;
                            display: block !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
                            content: 'Tiêu đề 3' !important;
                            font-size: 14px !important;
                            font-weight: bold !important;
                            display: block !important;
                        }
                        .ql-toolbar .ql-picker.ql-header .ql-picker-item:not([data-value])::before {
                            content: 'Đoạn văn' !important;
                            font-size: 14px !important;
                            display: block !important;
                        }
                        /* Style links inside Quill editor */
                        .ql-editor a {
                            color: #1d4ed8 !important;
                            text-decoration: underline !important;
                            cursor: pointer !important;
                        }
                        .ql-editor a:hover {
                            color: #1e40af !important;
                        }
                        .ql-tooltip {
                            position: absolute !important;
                            z-index: 10000 !important;
                            background-color: #f3f3f3 !important;
                            border: 1px solid #ccc !important;
                            border-radius: 4px !important;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
                            padding: 5px 10px !important;
                            left: auto !important;
                            right: auto !important;
                        }
                        .ql-tooltip.ql-flip {
                            top: auto !important;
                            bottom: auto !important;
                        }
                        .ql-tooltip input[type="text"] {
                            display: inline-block !important;
                            width: 200px !important;
                            padding: 5px 8px !important;
                            border: 1px solid #999 !important;
                            border-radius: 3px !important;
                            font-size: 12px !important;
                            margin: 0 5px !important;
                        }
                        .ql-tooltip a {
                            display: inline-block !important;
                            padding: 3px 8px !important;
                            margin-left: 5px !important;
                            border-radius: 3px !important;
                            background-color: #1d4ed8 !important;
                            color: white !important;
                            text-decoration: none !important;
                            font-size: 12px !important;
                            cursor: pointer !important;
                        }
                        .ql-tooltip a:hover {
                            background-color: #1e40af !important;
                        }
                        .ql-tooltip a.ql-action {
                            margin-right: 5px !important;
                        }
                        .ql-editor p.ql-align-center img,
                        .ql-editor div.ql-align-center img {
                            display: block !important;
                            margin-left: auto !important;
                            margin-right: auto !important;
                        }
                        .ql-editor p.ql-align-right img,
                        .ql-editor div.ql-align-right img {
                            display: block !important;
                            margin-left: auto !important;
                            margin-right: 0 !important;
                        }
                        .ql-editor p.ql-align-left img,
                        .ql-editor div.ql-align-left img {
                            display: block !important;
                            margin-left: 0 !important;
                            margin-right: auto !important;
                        }
                        /* Also handle images that may be direct children */
                        .ql-editor img {
                            max-width: 100% !important;
                            height: auto !important;
                        }
                    `}</style>
                        <div className={`border rounded-md overflow-visible ${errors.noiDung ? 'border-red-500' : 'border-gray-300'}`}>
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

                    <div className="flex items-center justify-between gap-4 ">
                        <div className="flex-1 w-full">
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
                            {errors.tacGia && (
                            <p className="mt-0.5 text-sm text-red-600">{errors.tacGia}</p>
                        )}
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
