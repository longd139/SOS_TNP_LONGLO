import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../BaseModal';
import { validateFormalityForm } from '../../validator/formalityValidator';

const INITIAL_FORM_STATE = {
    idCoSoDichVuCong: '',
    tenThuTuc: '',
    maThuTuc: '',
    doiTuongThucHien: '',
    //url_pdf: '',
    yeuCauDieuKienChung: '',
    soQuyetDinh: '',
    isRemoved: false,
    danhSachLinhVucIds: [],
    danhSachMauDon: [],
    cachThuThucHien: [],
    trinhTuThucHien: []
};

const ProcedureForm = ({
    isOpen,
    onClose,
    onSubmit,
    areas = [],
    initialData = null,
    mode = 'create'
}) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData && mode === 'edit') {
            const transformedData = {
                idCoSoDichVuCong: initialData.id_co_so_dich_vu_cong || '',
                tenThuTuc: initialData.ten_thu_tuc || '',
                maThuTuc: initialData.ma_thu_tuc || '',
                doiTuongThucHien: initialData.doi_tuong_thuc_hien || '',
                yeuCauDieuKienChung: initialData.yeu_cau_dieu_kien_chung || '',
                soQuyetDinh: initialData.so_quyet_dinh || '',
                isRemoved: initialData.is_removed || false,
                danhSachLinhVucIds: initialData.thu_tuc_hanh_chinh_linh_vuc?.map(item => item.id_linh_vuc) || [],
                danhSachMauDon: initialData.thu_tuc_hanh_chinh_mau_don?.map(item => ({
                    id: item.id,
                    so_luong_ban_chinh: item.so_luong_ban_chinh || 0,
                    so_luong_ban_sao: item.so_luong_ban_sao || 0,
                    ghi_chu: item.ghi_chu || ''
                })) || [],
                cachThuThucHien: initialData.cach_thuc_thuc_hien?.map(item => ({
                    id: item.id,
                    hinh_thuc_ap_dung: item.hinh_thuc_ap_dung || '',
                    mo_ta_chi_tiet: item.mo_ta_chi_tiet || '',
                    thoi_gian_giai_quyet: item.thoi_gian_giai_quyet || '',
                    le_phi: parseFloat(item.le_phi) || 0,
                    ghi_chu_le_phi: item.ghi_chu_le_phi || ''
                })) || [],
                trinhTuThucHien: initialData.trinh_tu_thuc_hien_thu_tuc?.map(item => ({
                    id: item.id,
                    ten_buoc: item.ten_buoc || '',
                    mo_ta_buoc: item.mo_ta_buoc || '',
                    thu_tu_buoc: item.thu_tu_buoc || 1
                })) || []
            };
            setFormData(transformedData);
        } else if (initialData && mode === 'create') {
            setFormData({
                ...INITIAL_FORM_STATE,
                ...initialData,
                danhSachLinhVucIds: initialData.danhSachLinhVucIds || []
            });
        } else {
            setFormData(INITIAL_FORM_STATE);
        }
    }, [initialData, isOpen, mode]);

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setIsSubmitting(false);
    };

    const handleSubmit = async () => {
        const cleanedData = {
            ...formData,
            // url_pdf: formData.url_pdf?.trim() || null,
            yeuCauDieuKienChung: formData.yeuCauDieuKienChung?.trim() || null,
            soQuyetDinh: formData.soQuyetDinh?.trim() || null
        };

        const validation = await validateFormalityForm(cleanedData, mode === 'edit');

        if (!validation.isValid) {
            setErrors(validation.errors);
            alert('Vui lòng kiểm tra lại các trường bắt buộc!');
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit(formData);
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Có lỗi xảy ra khi lưu thủ tục!');

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

    const toggleArea = (areaId) => {
        const currentAreas = [...formData.danhSachLinhVucIds];
        const index = currentAreas.indexOf(areaId);

        if (index > -1) {
            currentAreas.splice(index, 1);
        } else {
            currentAreas.push(areaId);
        }

        updateField('danhSachLinhVucIds', currentAreas);
    };

    const addStep = () => {
        const newSteps = [
            ...formData.trinhTuThucHien,
            {
                ten_buoc: '',
                mo_ta_buoc: '',
                thu_tu_buoc: formData.trinhTuThucHien.length + 1
            }
        ];
        updateField('trinhTuThucHien', newSteps);
    };

    const removeStep = (index) => {
        const newSteps = formData.trinhTuThucHien
            .filter((_, i) => i !== index)
            .map((step, i) => ({ ...step, thu_tu_buoc: i + 1 }));
        updateField('trinhTuThucHien', newSteps);
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...formData.trinhTuThucHien];
        newSteps[index] = { ...newSteps[index], [field]: value };
        updateField('trinhTuThucHien', newSteps);
    };

    const addCachThucHien = () => {
        const newCachThucHien = [
            ...formData.cachThuThucHien,
            {
                hinh_thuc_ap_dung: '',
                mo_ta_chi_tiet: '',
                thoi_gian_giai_quyet: '',
                le_phi: 0,
                ghi_chu_le_phi: ''
            }
        ];
        updateField('cachThuThucHien', newCachThucHien);
    };

    const removeCachThucHien = (index) => {
        const newCachThucHien = formData.cachThuThucHien.filter((_, i) => i !== index);
        updateField('cachThuThucHien', newCachThucHien);
    };

    const updateCachThucHien = (index, field, value) => {
        const newCachThucHien = [...formData.cachThuThucHien];
        newCachThucHien[index] = { ...newCachThucHien[index], [field]: value };
        updateField('cachThuThucHien', newCachThucHien);
    };

    const modalTitle = mode === 'create' ? 'Thêm thủ tục mới' : 'Chỉnh sửa thủ tục';
    const submitText = mode === 'create' ? 'Lưu thủ tục' : 'Cập nhật';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={modalTitle}
            size="2xl"
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
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã CSDVC <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.idCoSoDichVuCong}
                        onChange={(e) => updateField('idCoSoDichVuCong', e.target.value)}
                        placeholder="Nhập mã cơ sở dịch vụ công (UUID)..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.idCoSoDichVuCong ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.idCoSoDichVuCong && (
                        <p className="mt-1 text-sm text-red-600">{errors.idCoSoDichVuCong}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã thủ tục <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.maThuTuc}
                        onChange={(e) => updateField('maThuTuc', e.target.value)}
                        placeholder="Nhập mã thủ tục..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.maThuTuc ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.maThuTuc && (
                        <p className="mt-1 text-sm text-red-600">{errors.maThuTuc}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên thủ tục <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.tenThuTuc}
                        onChange={(e) => updateField('tenThuTuc', e.target.value)}
                        placeholder="Nhập tên thủ tục..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tenThuTuc ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.tenThuTuc && (
                        <p className="mt-1 text-sm text-red-600">{errors.tenThuTuc}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đối tượng thực hiện <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.doiTuongThucHien}
                        onChange={(e) => updateField('doiTuongThucHien', e.target.value)}
                        placeholder="VD: Cá nhân, Tổ chức..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.doiTuongThucHien ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.doiTuongThucHien && (
                        <p className="mt-1 text-sm text-red-600">{errors.doiTuongThucHien}</p>
                    )}
                </div>

                {mode === 'edit' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
                                    Xóa thủ tục
                                </span>
                            </div>
                        </label>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lĩnh vực <span className="text-red-500">*</span>
                    </label>
                    <div className={`bg-gray-50 p-3 rounded-lg border ${errors.danhSachLinhVucIds ? 'border-red-500' : 'border-gray-300'
                        }`}>
                        <p className="text-xs text-gray-500 mb-2">VD: Hộ tích - Cư trú</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {areas.map((area) => (
                                <label
                                    key={area.id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.danhSachLinhVucIds.includes(area.id)}
                                        onChange={() => toggleArea(area.id)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{area.ten_linh_vuc}</span>
                                </label>
                            ))}
                        </div>
                        {formData.danhSachLinhVucIds.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-600">
                                    Đã chọn: <span className="font-medium">{formData.danhSachLinhVucIds.length}</span> lĩnh vực
                                </p>
                            </div>
                        )}
                    </div>
                    {errors.danhSachLinhVucIds && (
                        <p className="mt-1 text-sm text-red-600">{errors.danhSachLinhVucIds}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yêu cầu điều kiện chung
                    </label>
                    <textarea
                        value={formData.yeuCauDieuKienChung}
                        onChange={(e) => updateField('yeuCauDieuKienChung', e.target.value)}
                        placeholder="Nhập yêu cầu điều kiện chung..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số quyết định
                    </label>
                    <input
                        type="text"
                        value={formData.soQuyetDinh}
                        onChange={(e) => updateField('soQuyetDinh', e.target.value)}
                        placeholder="Nhập số quyết định..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL tài liệu PDF
                    </label>
                    <input
                        type="url"
                        value={formData.url_pdf}
                        onChange={(e) => updateField('url_pdf', e.target.value)}
                        placeholder="https://example.com/document.pdf"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.url_pdf ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.url_pdf && (
                        <p className="mt-1 text-sm text-red-600">{errors.url_pdf}</p>
                    )}
                </div> */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trình tự thực hiện
                    </label>
                    <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                        {formData.trinhTuThucHien.map((step, index) => (
                            <div key={step.id || `step-${index}`} className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Bước {step.thu_tu_buoc}</span>
                                    {formData.trinhTuThucHien.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStep(index)}
                                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={step.ten_buoc}
                                    onChange={(e) => updateStep(index, 'ten_buoc', e.target.value)}
                                    placeholder="Tên bước..."
                                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <textarea
                                    value={step.mo_ta_buoc}
                                    onChange={(e) => updateStep(index, 'mo_ta_buoc', e.target.value)}
                                    placeholder="Mô tả chi tiết bước thực hiện..."
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addStep}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            + Thêm bước thực hiện
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cách thức thực hiện
                    </label>
                    <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                        {formData.cachThuThucHien.map((cach, index) => (
                            <div key={cach.id || `method-${index}`} className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Cách thức {index + 1}</span>
                                    {formData.cachThuThucHien.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCachThucHien(index)}
                                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={cach.hinh_thuc_ap_dung}
                                        onChange={(e) => updateCachThucHien(index, 'hinh_thuc_ap_dung', e.target.value)}
                                        placeholder="Hình thức áp dụng..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <textarea
                                        value={cach.mo_ta_chi_tiet}
                                        onChange={(e) => updateCachThucHien(index, 'mo_ta_chi_tiet', e.target.value)}
                                        placeholder="Mô tả chi tiết..."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={cach.thoi_gian_giai_quyet}
                                            onChange={(e) => updateCachThucHien(index, 'thoi_gian_giai_quyet', e.target.value)}
                                            placeholder="Thời gian giải quyết..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={cach.le_phi}
                                            onChange={(e) => updateCachThucHien(index, 'le_phi', parseFloat(e.target.value) || 0)}
                                            placeholder="Lệ phí (VND)..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={cach.ghi_chu_le_phi}
                                        onChange={(e) => updateCachThucHien(index, 'ghi_chu_le_phi', e.target.value)}
                                        placeholder="Ghi chú lệ phí..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addCachThucHien}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            + Thêm cách thức thực hiện
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

ProcedureForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    areas: PropTypes.array,
    initialData: PropTypes.object,
    mode: PropTypes.oneOf(['create', 'edit'])
};

export default ProcedureForm;
