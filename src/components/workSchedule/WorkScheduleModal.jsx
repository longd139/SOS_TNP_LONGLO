import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import { validateCreateWorkScheduleForm } from "../../validator/workScheduleValidator";
import dayjs from "dayjs";

const WorkScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    diaDiem: "",
    tenCanBo: "",
    batDau: "08:00",
    ketThuc: "10:00",
    ngayTiepDan: dayjs().format("YYYY-MM-DD"),
    ghiChu: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        // Convert date format for datetime-local input
        const dateValue = initialData.ngay_tiep_dan || initialData.ngayTiepDan;
        const formattedDate = dateValue
          ? dayjs(dateValue).format("YYYY-MM-DD")
          : "";

        setFormData({
          diaDiem: initialData.dia_diem || initialData.diaDiem || "",
          tenCanBo: initialData.ten_can_bo || initialData.tenCanBo || "",
          batDau: initialData.bat_dau || initialData.batDau || "",
          ketThuc: initialData.ket_thuc || initialData.ketThuc || "",
          ngayTiepDan: formattedDate,
          ghiChu: initialData.ghi_chu || initialData.ghiChu || "",
        });
      } else {
        resetForm();
      }
      setErrors({});
    }
  }, [initialData, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      diaDiem: "",
      tenCanBo: "",
      batDau: "08:00",
      ketThuc: "10:00",
      ngayTiepDan: dayjs().format("YYYY-MM-DD"),
      ghiChu: "",
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = async () => {
    const { isValid, errors: validationErrors } =
      await validateCreateWorkScheduleForm(formData);
    setErrors(validationErrors || {});
    return isValid;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const isValid = await validateForm();

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Convert date to ISO format for API
      const submitData = {
        ...formData,
        ngayTiepDan: dayjs(formData.ngayTiepDan).toISOString(),
      };

      const success = await onSubmit(submitData, mode);

      if (success) {
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const modalTitle =
    mode === "create" ? "Thêm lịch tiếp dân" : "Chỉnh sửa lịch tiếp dân";
  const submitText = mode === "create" ? "Tạo lịch" : "Cập nhật";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      subtitle="Nhập thông tin lịch tiếp dân của lãnh đạo"
      size="md"
      footer={
        <ModalFooter
          onCancel={handleClose}
          onSubmit={handleSubmit}
          submitText={submitText}
          submitDisabled={isSubmitting}
          submitLoading={isSubmitting}
        />
      }
    >
      <div className="space-y-4">
        {/* Ngày tiếp dân */}
        <div>
          <label className="block text-sm required-label font-medium text-gray-700 mb-1">
            Ngày tiếp dân
          </label>
          <input
            type="date"
            value={formData.ngayTiepDan}
            onChange={(e) => updateField("ngayTiepDan", e.target.value)}
            className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              errors.ngayTiepDan ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.ngayTiepDan && (
            <p className="mt-1 text-sm text-red-500">{errors.ngayTiepDan}</p>
          )}
        </div>

        {/* Giờ bắt đầu và kết thúc */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block required-label text-sm font-medium text-gray-700 mb-1">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              value={formData.batDau}
              onChange={(e) => updateField("batDau", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                errors.batDau ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.batDau && (
              <p className="mt-1 text-sm text-red-500">{errors.batDau}</p>
            )}
          </div>

          <div>
            <label className="block required-label text-sm font-medium text-gray-700 mb-1">
              Giờ kết thúc
            </label>
            <input
              type="time"
              value={formData.ketThuc}
              onChange={(e) => updateField("ketThuc", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                errors.ketThuc ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.ketThuc && (
              <p className="mt-1 text-sm text-red-500">{errors.ketThuc}</p>
            )}
          </div>
        </div>

        {/* Tên cán bộ */}
        <div>
          <label className="block required-label text-sm font-medium text-gray-700 mb-1">
            Cán bộ tiếp dân 
          </label>
          <input
            type="text"
            value={formData.tenCanBo}
            onChange={(e) => updateField("tenCanBo", e.target.value)}
            placeholder="VD: Ông Nguyễn Văn A - Chủ tịch UBND"
            className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              errors.tenCanBo ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.tenCanBo && (
            <p className="mt-1 text-sm text-red-500">{errors.tenCanBo}</p>
          )}
        </div>

        {/* Địa điểm */}
        <div>
          <label className="block required-label text-sm font-medium text-gray-700 mb-1">
            Địa điểm 
          </label>
          <input
            type="text"
            value={formData.diaDiem}
            onChange={(e) => updateField("diaDiem", e.target.value)}
            placeholder="VD: Phòng tiếp dân - Tầng 1"
            className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              errors.diaDiem ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.diaDiem && (
            <p className="mt-1 text-sm text-red-500">{errors.diaDiem}</p>
          )}
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú
          </label>
          <textarea
            value={formData.ghiChu}
            onChange={(e) => updateField("ghiChu", e.target.value)}
            placeholder="Nội dung tiếp dân, vấn đề cần giải quyết..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
        </div>
      </div>
    </BaseModal>
  );
};

WorkScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  mode: PropTypes.oneOf(["create", "edit"]),
};

export default WorkScheduleModal;
