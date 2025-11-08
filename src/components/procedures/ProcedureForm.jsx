import React from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { useProcedureForm } from '../../hooks/useProcedureForm';
import ProcedureBasicInfo from './ProcedureBasicInfo';
import ProcedureAreasSelector from './ProcedureAreasSelector';
import ProcedureAdditionalInfo from './ProcedureAdditionalInfo';
import ProcedureStepsSection from './ProcedureStepsSection';
import ProcedureMethodsSection from './ProcedureMethodsSection';
import ProcedureMauDonSection from './ProcedureMauDonSection';
import ProcedureCasesSection from './ProcedureCasesSection';

const ProcedureForm = ({
    isOpen,
    onClose,
    onSubmit,
    areas = [],
    initialData = null,
    mode = 'create'
}) => {
    const {
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
    } = useProcedureForm({ initialData, mode, isOpen, onSubmit });

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const modalTitle = mode === 'create' ? 'Thêm thủ tục mới' : 'Chỉnh sửa thủ tục';
    const submitText = mode === 'create' ? 'Lưu thủ tục' : 'Cập nhật';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={modalTitle}
            size="3xl"
            className="max-w-5xl"
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
            <div className="space-y-3 max-h-[70vh] overflow-y-auto px-1 -mx-1">
                <ProcedureBasicInfo
                    formData={formData}
                    errors={errors}
                    updateField={updateField}
                />

                <div className="flex flex-col md:flex-row gap-3 items-stretch">
                    <div className="md:w-1/2 min-w-0">
                        <ProcedureAreasSelector
                            formData={formData}
                            errors={errors}
                            areas={areas}
                            toggleArea={toggleArea}
                            updateField={updateField}
                        />
                    </div>
                    <div className="md:w-1/2 min-w-0">
                        <ProcedureAdditionalInfo
                            formData={formData}
                            updateField={updateField}
                            errors={errors}
                        />
                    </div>
                </div>

                <ProcedureMauDonSection
                    items={formData.danhSachMauDon}
                    addItem={addMauDon}
                    removeItem={removeMauDon}
                    updateItem={updateMauDon}
                    errors={errors}
                />

                <ProcedureCasesSection
                    cases={formData.truongHopThuTuc}
                    addCase={addTruongHop}
                    removeCase={removeTruongHop}
                    updateCase={updateTruongHop}
                    addCaseComponent={addThanhPhanHoSo}
                    removeCaseComponent={removeThanhPhanHoSo}
                    updateCaseComponent={updateThanhPhanHoSo}
                    errors={errors}
                />

                <div className="flex flex-col md:flex-row gap-3 md:items-start">
                    <div className="flex-1 min-w-0">
                        <ProcedureStepsSection
                            steps={formData.trinhTuThucHien}
                            addStep={addStep}
                            removeStep={removeStep}
                            updateStep={updateStep}
                            reorderSteps={reorderSteps}
                            errors={errors}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <ProcedureMethodsSection
                            methods={formData.cachThuThucHien}
                            addMethod={addCachThucHien}
                            removeMethod={removeCachThucHien}
                            updateMethod={updateCachThucHien}
                            errors={errors}
                        />
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
