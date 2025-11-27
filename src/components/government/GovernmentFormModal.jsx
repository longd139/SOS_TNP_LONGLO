import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import { validateGovernmentForm } from "../../validator/governmentValidator";
import { GOVERNMENT_API } from "../../apis/government";
import { showToast } from "../../utils/toastNotification";

const initialState = {
    tenCoSo: "",
    diaChi: "",
    soDienThoai: "",
    moTa: "",
    linkGoogleMap: "",
};

const GovernmentFormModal = ({
    isOpen,
    onClose,
    onCreate,
    onSubmit,
    mode = "create",
    initialData = null,
    isLoading = false,
}) => {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && initialData) {
                setForm({
                    tenCoSo: initialData.tenCoSo || initialData.ten_co_so || "",
                    diaChi: initialData.diaChi || initialData.dia_chi || "",
                    soDienThoai:
                        initialData.soDienThoai || initialData.so_dien_thoai || "",
                    moTa: initialData.moTa || initialData.mo_ta || "",
                    linkGoogleMap:
                        initialData.linkGoogleMap || initialData.link_google_map || "",
                });
            } else {
                setForm(initialState);
            }
        } else {
            setForm(initialState);
            setErrors({});
        }
    }, [isOpen, mode, initialData]);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: null }));
        }
    };

    const handleSubmit = async () => {
        const { isValid, errors: validationErrors } = await validateGovernmentForm(
            form
        );

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            tenCoSo: form.tenCoSo,
            diaChi: form.diaChi,
            soDienThoai: form.soDienThoai,
            moTa: form.moTa?.trim() || null,
            linkGoogleMap: form.linkGoogleMap,
        };

        setIsSubmitting(true);
        try {
            if (onSubmit) {
                await onSubmit(payload);
                setForm(initialState);
                setErrors({});
                onClose();
            } else if (mode === "create") {
                const apiCreated = await GOVERNMENT_API.createGovernment(payload);
                if (apiCreated) {
                    if (onCreate) {
                        try {
                            onCreate(apiCreated);
                        } catch (e) {
                        }
                    }

                    setForm(initialState);
                    setErrors({});
                    onClose();
                }
            }
        } catch (err) {
            if (err?.message) {
                showToast?.error(err.message);
            } else {
                showToast?.error("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                mode === "edit"
                    ? "Chỉnh sửa cơ sở dịch vụ công"
                    : "Tạo mới cơ sở dịch vụ công"
            }
            size="xl"
            className="max-w-5xl"
            footer={
                <ModalFooter
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText={mode === "edit" ? "Cập nhật" : "Tạo"}
                    submitDisabled={false}
                    submitLoading={isLoading}
                />
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 required-label">
                        Tên cơ sở
                    </label>
                    <input
                        type="text"
                        value={form.tenCoSo}
                        onChange={(e) => updateField("tenCoSo", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.tenCoSo ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.tenCoSo && (
                        <p className="mt-1 text-sm text-red-600">{errors.tenCoSo}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 required-label">
                        Địa chỉ
                    </label>
                    <input
                        type="text"
                        value={form.diaChi}
                        onChange={(e) => updateField("diaChi", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.diaChi ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.diaChi && (
                        <p className="mt-1 text-sm text-red-600">{errors.diaChi}</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 required-label">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            value={form.soDienThoai}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || /^[0-9]*$/.test(value)) {
                                    updateField("soDienThoai", value);
                                }
                            }}
                            placeholder="Ví dụ: 0123456789"
                            maxLength="11"
                            className={`w-full px-3 py-2 border rounded-lg ${errors.soDienThoai ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.soDienThoai && (
                            <p className="mt-1 text-sm text-red-600">{errors.soDienThoai}</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Mô tả
                    </label>
                    <textarea
                        value={form.moTa}
                        onChange={(e) => updateField("moTa", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.moTa ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.moTa && (
                        <p className="mt-1 text-sm text-red-600">{errors.moTa}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 required-label">
                        Vị trí trên Google Maps
                    </label>
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={form.linkGoogleMap}
                            onChange={(e) => updateField("linkGoogleMap", e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg ${errors.linkGoogleMap ? "border-red-500" : "border-gray-300"
                                }`}
                        />

                    </div>
                    {errors.linkGoogleMap && (
                        <p className="mt-1 text-sm text-red-600">{errors.linkGoogleMap}</p>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};

GovernmentFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func,
    onSubmit: PropTypes.func,
    mode: PropTypes.oneOf(["create", "edit"]),
    initialData: PropTypes.object,
    isLoading: PropTypes.bool,
};

export default GovernmentFormModal;
