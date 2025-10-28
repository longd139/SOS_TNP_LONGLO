import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../BaseModal';

const INITIAL_FORM_STATE = {
    ten_thu_tuc: '',
    linh_vuc: [],
    cac_buoc_thuc_hien: ['', '', ''],
    ho_so_yeu_cau: [''],
    thoi_gian_xu_ly: '',
    le_phi: '',
    dia_diem_tiep_nhan: '',
    so_dien_thoai_ho_tro: ''
};

const ProcedureForm = ({
    isOpen,
    onClose,
    onSubmit,
    areas = [],
    initialData = null,
    mode = 'create'
}) => {
    const [formData, setFormData] = useState(initialData || INITIAL_FORM_STATE);

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
    };

    const handleSubmit = async () => {
        await onSubmit(formData);
        resetForm();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArea = (areaId) => {
        const currentAreas = [...formData.linh_vuc];
        const index = currentAreas.indexOf(areaId);

        if (index > -1) {
            currentAreas.splice(index, 1);
        } else {
            currentAreas.push(areaId);
        }

        updateField('linh_vuc', currentAreas);
    };

    const addStep = () => {
        updateField('cac_buoc_thuc_hien', [...formData.cac_buoc_thuc_hien, '']);
    };

    const removeStep = (index) => {
        const newSteps = formData.cac_buoc_thuc_hien.filter((_, i) => i !== index);
        updateField('cac_buoc_thuc_hien', newSteps);
    };

    const updateStep = (index, value) => {
        const newSteps = [...formData.cac_buoc_thuc_hien];
        newSteps[index] = value;
        updateField('cac_buoc_thuc_hien', newSteps);
    };

    const addDocument = () => {
        updateField('ho_so_yeu_cau', [...formData.ho_so_yeu_cau, '']);
    };

    const removeDocument = (index) => {
        const newDocs = formData.ho_so_yeu_cau.filter((_, i) => i !== index);
        updateField('ho_so_yeu_cau', newDocs);
    };

    const updateDocument = (index, value) => {
        const newDocs = [...formData.ho_so_yeu_cau];
        newDocs[index] = value;
        updateField('ho_so_yeu_cau', newDocs);
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
                />
            }
        >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên thủ tục <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.ten_thu_tuc}
                        onChange={(e) => updateField('ten_thu_tuc', e.target.value)}
                        placeholder="Nhập tên thủ tục..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lĩnh vực <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                        <p className="text-xs text-gray-500 mb-2">VD: Hộ tích - Cư trú</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {areas.map((area) => (
                                <label
                                    key={area.id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.linh_vuc.includes(area.id)}
                                        onChange={() => toggleArea(area.id)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{area.ten_linh_vuc}</span>
                                </label>
                            ))}
                        </div>
                        {formData.linh_vuc.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-600">
                                    Đã chọn: <span className="font-medium">{formData.linh_vuc.length}</span> lĩnh vực
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Các bước thực hiện
                    </label>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        {formData.cac_buoc_thuc_hien.map((step, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={step}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    placeholder={`Bước ${index + 1}:`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                />
                                {formData.cac_buoc_thuc_hien.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addStep}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            + Thêm bước
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hồ sơ yêu cầu
                    </label>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        {formData.ho_so_yeu_cau.map((doc, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={doc}
                                    onChange={(e) => updateDocument(index, e.target.value)}
                                    placeholder="- Chứng minh nhân dân/Căn cước công dân"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                />
                                {formData.ho_so_yeu_cau.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDocument(index)}
                                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addDocument}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            + Thêm hồ sơ
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thời gian xử lý
                        </label>
                        <input
                            type="text"
                            value={formData.thoi_gian_xu_ly}
                            onChange={(e) => updateField('thoi_gian_xu_ly', e.target.value)}
                            placeholder="VD: 7 ngày làm việc"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lệ phí
                        </label>
                        <input
                            type="text"
                            value={formData.le_phi}
                            onChange={(e) => updateField('le_phi', e.target.value)}
                            placeholder="VD: 100.000 VND hoặc Miễn phí"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Địa điểm tiếp nhận
                    </label>
                    <input
                        type="text"
                        value={formData.dia_diem_tiep_nhan}
                        onChange={(e) => updateField('dia_diem_tiep_nhan', e.target.value)}
                        placeholder="VD: Phòng Hộ tích - Tầng 2, UBND Phường"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại hỗ trợ
                    </label>
                    <input
                        type="text"
                        value={formData.so_dien_thoai_ho_tro}
                        onChange={(e) => updateField('so_dien_thoai_ho_tro', e.target.value)}
                        placeholder="VD: 028-1234-5678"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
