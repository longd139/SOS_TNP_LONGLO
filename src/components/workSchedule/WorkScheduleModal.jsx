import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import { 
  validateCreateWorkScheduleForm, 
  validateUpdateWorkScheduleForm,
  canEditWorkSchedule,
  convertTo24Hour 
} from "../../validator/workScheduleValidator";
import dayjs from "dayjs";
import { hourFormat } from "../../utils/dateUtils";
import { showToast } from "../../utils/toastNotification";

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
  const [originalDate, setOriginalDate] = useState(null);
  const [originalStartTime, setOriginalStartTime] = useState(null);
  const canEdit = mode === "create" || canEditWorkSchedule(originalDate, originalStartTime);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        const dateValue = initialData.ngay_tiep_dan || initialData.ngayTiepDan;
        const formattedDate = dateValue
          ? dayjs(dateValue).format("YYYY-MM-DD")
          : "";
        const { start, end } = hourFormat(initialData.thoi_gian || "");

        setOriginalDate(dateValue);
        setOriginalStartTime(start);

        setFormData({
          diaDiem: initialData.dia_diem || initialData.diaDiem || "",
          tenCanBo: initialData.ten_can_bo || initialData.tenCanBo || "",
          batDau: initialData.batDau || start || "",
          ketThuc: initialData.ketThuc || end || "",
          ngayTiepDan: formattedDate,
          ghiChu: initialData.ghi_chu || initialData.ghiChu || "",
        });

        if (!canEditWorkSchedule(dateValue, start)) {
          showToast.warning("Lịch công tác này đã bắt đầu hoặc đã qua, không thể chỉnh sửa!");
        }
      } else {
        setOriginalDate(null);
        setOriginalStartTime(null);
        resetForm();
      }
      setErrors({});
    }
  }, [initialData, mode, isOpen]);

  const getMinTimeForToday = useCallback(() => {
    const now = new Date();
    const selectedDate = new Date(formData.ngayTiepDan);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    

    if (selectedDate.getTime() === today.getTime()) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      

      const minMinute = currentMinute + 1;
      if (minMinute >= 60) {
        return `${String(currentHour + 1).padStart(2, '0')}:00`;
      } else {
        return `${String(currentHour).padStart(2, '0')}:${String(minMinute).padStart(2, '0')}`;
      }
    }
    
    return null;
  }, [formData.ngayTiepDan]);

  useEffect(() => {
    if (mode === "create" && formData.ngayTiepDan) {
      const minTime = getMinTimeForToday();
      const updates = {};
      
      if (minTime && formData.batDau < minTime) {
        updates.batDau = minTime;
      }
      
      if (minTime && formData.ketThuc < minTime) {
        updates.ketThuc = minTime;
      }
      
      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({
          ...prev,
          ...updates
        }));
      }
    }
  }, [formData.ngayTiepDan, formData.batDau, formData.ketThuc, mode, getMinTimeForToday]);

  const getMinDateForInput = () => {
    if (mode === "create") {
      return dayjs().format("YYYY-MM-DD");
    } else {
      return dayjs().format("YYYY-MM-DD"); 
    }
  };

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
    if (mode === "create") {
      const { isValid, errors: validationErrors } = await validateCreateWorkScheduleForm(formData);
      setErrors(validationErrors || {});
      return isValid;
    } else {
      const { isValid, errors: validationErrors } = await validateUpdateWorkScheduleForm(
        formData, 
        originalDate, 
        originalStartTime
      );
      setErrors(validationErrors || {});
      return isValid;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (mode === "edit" && !canEdit) {
        showToast.error("Không thể chỉnh sửa lịch công tác đã qua ngày hiện tại!");
        setIsSubmitting(false);
        return;
      }

      const isValid = await validateForm();

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        ...formData,
        ngayTiepDan: formData.ngayTiepDan,
      };

      const success = await onSubmit(submitData, mode);

      if (success) {
        resetForm();
        onClose();
      }
    } catch (error) {
      showToast.error(error?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
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

    if (mode === "create" && field === "batDau") {
      const ngayTiepDan = formData.ngayTiepDan;
      if (ngayTiepDan && value) {
        const now = new Date();
        const selectedDate = new Date(ngayTiepDan);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate.getTime() === today.getTime()) {
          const time24h = value.includes('CH') || value.includes('SA') 
            ? convertTo24Hour(value) 
            : value;
          const [hours, minutes] = time24h.split(':').map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);
          
          if (selectedDateTime <= now) {
            setErrors((prev) => ({
              ...prev,
              [field]: "Giờ bắt đầu phải là thời điểm trong tương lai",
            }));
          }
        }
      }
    }

    if (mode === "create" && field === "ngayTiepDan") {
      const batDau = formData.batDau;
      if (batDau && value) {
        const now = new Date();
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate.getTime() === today.getTime()) {
          const [hours, minutes] = batDau.split(':').map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);
          
          if (selectedDateTime <= now) {
            setErrors((prev) => ({
              ...prev,
              batDau: "Giờ bắt đầu phải là thời điểm trong tương lai",
            }));
          }
        }
      }
    }

    if (mode === "create" && field === "ketThuc") {
      const ngayTiepDan = formData.ngayTiepDan;
      if (ngayTiepDan && value) {
        const now = new Date();
        const selectedDate = new Date(ngayTiepDan);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate.getTime() === today.getTime()) {
          const time24h = value.includes('CH') || value.includes('SA') 
            ? convertTo24Hour(value) 
            : value;
          const [hours, minutes] = time24h.split(':').map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);
          
          if (selectedDateTime <= now) {
            setErrors((prev) => ({
              ...prev,
              [field]: "Giờ kết thúc phải là thời điểm trong tương lai",
            }));
          }
        }
      }
    }

    if ((field === "batDau" || field === "ketThuc")) {
      const batDauValue = field === "batDau" ? value : formData.batDau;
      const ketThucValue = field === "ketThuc" ? value : formData.ketThuc;
      
      if (batDauValue && ketThucValue) {
        const startTime24h = batDauValue.includes('CH') || batDauValue.includes('SA') 
          ? convertTo24Hour(batDauValue) 
          : batDauValue;
        const endTime24h = ketThucValue.includes('CH') || ketThucValue.includes('SA') 
          ? convertTo24Hour(ketThucValue) 
          : ketThucValue;
        
        if (startTime24h >= endTime24h) {
          if (field === "batDau") {
            setErrors((prev) => ({
              ...prev,
              batDau: "Giờ bắt đầu phải trước giờ kết thúc",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              ketThuc: "Giờ kết thúc phải sau giờ bắt đầu",
            }));
          }
        }
      }
    }

    if (field === "ngayTiepDan" && value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (mode === "create" && selectedDate < today) {
        setErrors((prev) => ({
          ...prev,
          ngayTiepDan: "Không thể chọn ngày trong quá khứ",
        }));
      } else if (mode === "edit" && selectedDate < today) {
        setErrors((prev) => ({
          ...prev,
          ngayTiepDan: "Khi chỉnh sửa lịch, không được chọn ngày trong quá khứ",
        }));
      }
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
      size="3xl"
      className="max-w-5xl"
      footer={
        <ModalFooter
          onCancel={handleClose}
          onSubmit={handleSubmit}
          submitText={submitText}
          submitDisabled={isSubmitting || (mode === "edit" && !canEdit)}
          submitLoading={isSubmitting}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm required-label font-medium text-gray-700 mb-1">
            Ngày tiếp dân
          </label>
          <input
            type="date"
            value={formData.ngayTiepDan}
            onChange={(e) => updateField("ngayTiepDan", e.target.value)}
            min={getMinDateForInput()}
            disabled={mode === "edit" && !canEdit}
            className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              errors.ngayTiepDan ? "border-red-500" : "border-gray-300"
            } ${mode === "edit" && !canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.ngayTiepDan && (
            <p className="mt-1 text-sm text-red-500">{errors.ngayTiepDan}</p>
          )}
          {mode === "edit" && !canEdit && (
            <p className="mt-1 text-sm text-orange-500">
              * Lịch công tác đã qua không thể chỉnh sửa ngày
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block required-label text-sm font-medium text-gray-700 mb-1">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              value={formData.batDau}
              onChange={(e) => updateField("batDau", e.target.value)}
              disabled={mode === "edit" && !canEdit}
              min={mode === "create" ? getMinTimeForToday() : undefined}
              className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                errors.batDau ? "border-red-500" : "border-gray-300"
              } ${mode === "edit" && !canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
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
              disabled={mode === "edit" && !canEdit}
              min={mode === "create" ? getMinTimeForToday() : undefined}
              className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                errors.ketThuc ? "border-red-500" : "border-gray-300"
              } ${mode === "edit" && !canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.ketThuc && (
              <p className="mt-1 text-sm text-red-500">{errors.ketThuc}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block required-label text-sm font-medium text-gray-700 mb-1">
            Cán bộ tiếp dân
          </label>
          <input
            type="text"
            value={formData.tenCanBo}
            onChange={(e) => updateField("tenCanBo", e.target.value)}
            placeholder="VD: Ông Nguyễn Văn A - Chủ tịch UBND"
            disabled={mode === "edit" && !canEdit}
            className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              errors.tenCanBo ? "border-red-500" : "border-gray-300"
            } ${mode === "edit" && !canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.tenCanBo && (
            <p className="mt-1 text-sm text-red-500">{errors.tenCanBo}</p>
          )}
        </div>

        <div>
          <label className="block required-label text-sm font-medium text-gray-700 mb-1">
            Địa điểm
          </label>
          <input
            type="text"
            value={formData.diaDiem}
            onChange={(e) => updateField("diaDiem", e.target.value)}
            placeholder="VD: Phòng tiếp dân - Tầng 1"
            disabled={mode === "edit" && !canEdit}
            className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              errors.diaDiem ? "border-red-500" : "border-gray-300"
            } ${mode === "edit" && !canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.diaDiem && (
            <p className="mt-1 text-sm text-red-500">{errors.diaDiem}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú
          </label>
          <textarea
            value={formData.ghiChu}
            onChange={(e) => updateField("ghiChu", e.target.value)}
            placeholder="Nội dung tiếp dân, vấn đề cần giải quyết..."
            rows={4}
            disabled={mode === "edit" && !canEdit}
            className={`w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none ${
              mode === "edit" && !canEdit ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          {mode === "edit" && !canEdit && (
            <p className="mt-1 text-sm text-orange-500">
              * Lịch công tác đã qua không thể chỉnh sửa
            </p>
          )}
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
