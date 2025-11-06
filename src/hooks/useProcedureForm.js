import { useState, useEffect } from 'react';
import { validateFormalityForm } from '../validator/formalityValidator';
import { INITIAL_FORM_STATE, transformInitialData, cleanFormData } from '../components/procedures/transformProcedureData';
import { showToast } from '../utils/toastNotification';

export const useProcedureForm = ({ initialData, mode, isOpen, onSubmit }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const transformedData = transformInitialData(initialData, mode);
        setFormData(transformedData);
    }, [initialData, isOpen, mode]);

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setIsSubmitting(false);
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

    const moveStep = (index, direction) => {
        const newSteps = [...formData.trinhTuThucHien];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newSteps.length) {
            return;
        }

        [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
        
        const reorderedSteps = newSteps.map((step, i) => ({
            ...step,
            thu_tu_buoc: i + 1
        }));
        
        updateField('trinhTuThucHien', reorderedSteps);
    };

    const reorderSteps = (oldIndex, newIndex) => {
        const newSteps = [...formData.trinhTuThucHien];
        const [movedStep] = newSteps.splice(oldIndex, 1);
        newSteps.splice(newIndex, 0, movedStep);
        
        const reorderedSteps = newSteps.map((step, i) => ({
            ...step,
            thu_tu_buoc: i + 1
        }));
        
        updateField('trinhTuThucHien', reorderedSteps);
    };

    const addCachThucHien = () => {
        const newCachThucHien = [
            ...formData.cachThuThucHien,
            {
                hinh_thuc_ap_dung: '',
                mo_ta_chi_tiet: '',
                thoi_gian_giai_quyet: '',
                le_phi: '',
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

    const addMauDon = () => {
        const newMauDon = [
            ...formData.danhSachMauDon,
            {
                id: '',
                so_luong_ban_chinh: 0,
                so_luong_ban_sao: 0,
                ghi_chu: ''
            }
        ];
        updateField('danhSachMauDon', newMauDon);
    };

    const removeMauDon = (index) => {
        const newMauDon = formData.danhSachMauDon.filter((_, i) => i !== index);
        updateField('danhSachMauDon', newMauDon);
    };

    const updateMauDon = (index, field, value) => {
        const newMauDon = [...formData.danhSachMauDon];
        newMauDon[index] = { ...newMauDon[index], [field]: value };
        updateField('danhSachMauDon', newMauDon);
    };

    const addTruongHop = () => {
        const newTruongHop = [
            ...formData.truongHopThuTuc,
            {
                ten_truong_hop: '',
                mo_ta: '',
                thu_tu: formData.truongHopThuTuc.length + 1,
                thanh_phan_ho_so: []
            }
        ];
        updateField('truongHopThuTuc', newTruongHop);
    };

    const removeTruongHop = (index) => {
        const newTruongHop = formData.truongHopThuTuc
            .filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, thu_tu: i + 1 }));
        updateField('truongHopThuTuc', newTruongHop);
    };

    const updateTruongHop = (index, field, value) => {
        const newTruongHop = [...formData.truongHopThuTuc];
        newTruongHop[index] = { ...newTruongHop[index], [field]: value };
        updateField('truongHopThuTuc', newTruongHop);
    };

    const addThanhPhanHoSo = (caseIndex) => {
        const newTruongHop = [...formData.truongHopThuTuc];
        if (!newTruongHop[caseIndex].thanh_phan_ho_so) {
            newTruongHop[caseIndex].thanh_phan_ho_so = [];
        }
        newTruongHop[caseIndex].thanh_phan_ho_so.push({
            ten_thanh_phan: '',
            mo_ta_chi_tiet: '',
            so_luong_ban_chinh: 0,
            so_luong_ban_sao: 0,
            ghi_chu: ''
        });
        updateField('truongHopThuTuc', newTruongHop);
    };

    const removeThanhPhanHoSo = (caseIndex, componentIndex) => {
        const newTruongHop = [...formData.truongHopThuTuc];
        newTruongHop[caseIndex].thanh_phan_ho_so = newTruongHop[caseIndex].thanh_phan_ho_so.filter(
            (_, i) => i !== componentIndex
        );
        updateField('truongHopThuTuc', newTruongHop);
    };

    const updateThanhPhanHoSo = (caseIndex, componentIndex, field, value) => {
        const newTruongHop = [...formData.truongHopThuTuc];
        newTruongHop[caseIndex].thanh_phan_ho_so[componentIndex] = {
            ...newTruongHop[caseIndex].thanh_phan_ho_so[componentIndex],
            [field]: value
        };
        updateField('truongHopThuTuc', newTruongHop);
    };

    const handleSubmit = async () => {
        const validation = await validateFormalityForm(formData, mode === 'edit');

        if (!validation.isValid) {
            setErrors(validation.errors);
            showToast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
            return;
        }

        const cleanedData = cleanFormData(formData);

        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit(cleanedData);
            resetForm();
        } catch (error) {
            showToast.error('Có lỗi xảy ra khi lưu thủ tục!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,

        updateField,
        toggleArea,
        addStep,
        removeStep,
        updateStep,
        moveStep,
        reorderSteps,
        addMauDon,
        removeMauDon,
        updateMauDon,
        addCachThucHien,
        removeCachThucHien,
        updateCachThucHien,
        addTruongHop,
        removeTruongHop,
        updateTruongHop,
        addThanhPhanHoSo,
        removeThanhPhanHoSo,
        updateThanhPhanHoSo,
        handleSubmit,
        resetForm
    };
};
