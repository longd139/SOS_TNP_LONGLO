import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Phone, Clock, Square, SquarePen, X, Save } from "lucide-react";
import { fetchContact, updateContact } from "../../features/contact/contactThunks";
import { clearError, clearUpdateSuccess } from "../../features/contact/contactSlice";
import {
    selectContact,
    selectLoading,
    selectError,
    selectUpdateSuccess,
} from "../../features/contact/contactSelectors";
import { showToast } from "../../utils/toastNotification";
import { validateContactForm } from "../../validator/contactValidator";

export default function ContactInfo() {
    const dispatch = useDispatch();
    const contact = useSelector(selectContact);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const updateSuccess = useSelector(selectUpdateSuccess);

    const [formData, setFormData] = useState({
        id: "",
        tenDonVi: "",
        diaChi: "",
        soDienThoai: "",
        email: "",
        gioLamViec: {
            buoi_sang: {
                tu: "07:30",
                den: "11:30",
            },
            buoi_chieu: {
                tu: "13:00",
                den: "17:00",
            },
            ghi_chu: "",
        },
        linkGoogleMap: "",
    });

    const [originalData, setOriginalData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchContact());
    }, [dispatch]);

    useEffect(() => {
        if (contact) {
            setFormData(contact);
            setOriginalData(contact);
        }
    }, [contact]);

    useEffect(() => {
        if (updateSuccess) {
            showToast.success("Cập nhật thông tin thành công!");
            dispatch(clearUpdateSuccess());
        }
    }, [updateSuccess, dispatch]);

    useEffect(() => {
        if (error) {
            if (error?.message) {
                            showToast.error(error.message);
                        }
                        
                        if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
                            error.errors.forEach((err) => {
                                if (err?.message) {
                                    showToast.error(err.message);
                                }
                            });
                        } else if (typeof error === 'string') {
                            showToast.error(error);
                        } else if (!error?.message && !error?.errors) {
                            showToast.error('Có lỗi xảy ra khi cập nhật trạng thái');
                        }

            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChange = (path, value) => {
        const keys = path.split(".");
        setFormData((prev) => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setErrors({});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(originalData);
        setErrors({});
    };

    const handleSave = async () => {
        if (!formData.id) {
            showToast.error("ID ủy ban không hợp lệ");
            return;
        }

        const { isValid, errors: validationErrors } = await validateContactForm(formData, true);

        if (!isValid) {
            setErrors(validationErrors);
            showToast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        setErrors({});

        const result = await dispatch(
            updateContact({
                committeeId: formData.id,
                contactData: formData,
            })
        );

        if (result.type === 'contact/updateContact/fulfilled') {
            setIsEditing(false);
            setOriginalData(formData);
        }
    };

    if (loading && !contact) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="px-2 py-1 md:py-2">
                <div className="mb-3 md:mb-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        Ủy ban Phường
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Cập nhật thông tin Ủy ban Phường
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <h2 className="text-base font-semibold text-gray-900">
                                Thông tin đơn vị
                            </h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1 required-label">
                                Tên đơn vị
                            </label>
                            <input
                                type="text"
                                value={formData?.tenDonVi}
                                onChange={(e) => handleChange("tenDonVi", e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['tenDonVi'] ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors['tenDonVi'] && (
                                <p className="mt-1 text-xs text-red-600">{errors['tenDonVi']}</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <h2 className="text-base font-semibold text-gray-900">
                                Địa chỉ văn phòng
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1 required-label">
                                    Địa chỉ đầy đủ
                                </label>
                                <input
                                    type="text"
                                    value={formData?.diaChi}
                                    onChange={(e) => handleChange("diaChi", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['diaChi'] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors['diaChi'] && (
                                    <p className="mt-1 text-xs text-red-600">{errors['diaChi']}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1 required-label">
                                    Link Google Map
                                </label>
                                <input
                                    type="text"
                                    value={formData?.linkGoogleMap}
                                    onChange={(e) => handleChange("linkGoogleMap", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['linkGoogleMap'] ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="https://maps.google.com/?q=10.8231,106.6297"
                                />
                                {errors['linkGoogleMap'] && (
                                    <p className="mt-1 text-xs text-red-600">{errors['linkGoogleMap']}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <h2 className="text-base font-semibold text-gray-900">
                                Thông tin liên lạc
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1 required-label">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={formData?.soDienThoai}
                                    onChange={(e) => handleChange("soDienThoai", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['soDienThoai'] ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="0813241516540"
                                />
                                {errors['soDienThoai'] && (
                                    <p className="mt-1 text-xs text-red-600">{errors['soDienThoai']}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1 required-label">
                                    Email liên hệ
                                </label>
                                <input
                                    type="email"
                                    value={formData?.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['email'] ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="user@example.com"
                                />
                                {errors['email'] && (
                                    <p className="mt-1 text-xs text-red-600">{errors['email']}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <h2 className="text-base font-semibold text-gray-900">
                                Giờ làm việc
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1 required-label">
                                        Buổi sáng
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData?.gioLamViec?.buoi_sang?.tu}
                                                onChange={(e) =>
                                                    handleChange("gioLamViec.buoi_sang.tu", e.target.value)
                                                }
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['gioLamViec.buoi_sang.tu'] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="07:30"
                                            />
                                        </div>
                                        <span className="text-gray-500 font-medium text-sm">-</span>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData?.gioLamViec?.buoi_sang?.den}
                                                onChange={(e) =>
                                                    handleChange("gioLamViec.buoi_sang.den", e.target.value)
                                                }
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['gioLamViec.buoi_sang.den'] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="11:30"
                                            />
                                        </div>
                                    </div>
                                    {(errors['gioLamViec.buoi_sang.tu'] || errors['gioLamViec.buoi_sang.den']) && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors['gioLamViec.buoi_sang.tu'] || errors['gioLamViec.buoi_sang.den']}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1 required-label">
                                        Buổi chiều
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData?.gioLamViec?.buoi_chieu?.tu}
                                                onChange={(e) =>
                                                    handleChange("gioLamViec.buoi_chieu.tu", e.target.value)
                                                }
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['gioLamViec.buoi_chieu.tu'] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="13:00"
                                            />
                                        </div>
                                        <span className="text-gray-500 font-medium text-sm">-</span>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData?.gioLamViec?.buoi_chieu?.den}
                                                onChange={(e) =>
                                                    handleChange("gioLamViec.buoi_chieu.den", e.target.value)
                                                }
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['gioLamViec.buoi_chieu.den'] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="17:00"
                                            />
                                        </div>
                                    </div>
                                    {(errors['gioLamViec.buoi_chieu.tu'] || errors['gioLamViec.buoi_chieu.den']) && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors['gioLamViec.buoi_chieu.tu'] || errors['gioLamViec.buoi_chieu.den']}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {errors['gioLamViec'] && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-600 font-medium">
                                        {errors['gioLamViec']}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Ghi chú
                                </label>
                                <input
                                    type="text"
                                    value={formData?.gioLamViec?.ghi_chu || ''}
                                    onChange={(e) =>
                                        handleChange("gioLamViec.ghi_chu", e.target.value)
                                    }
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors['gioLamViec.ghi_chu'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Ghi chú thêm về giờ làm việc"
                                />
                                {errors['gioLamViec.ghi_chu'] && (
                                    <p className="mt-1 text-xs text-red-600">{errors['gioLamViec.ghi_chu']}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white text-base font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm transition-colors"
                            >
                                <SquarePen className="w-5 h-5" />
                                Chỉnh sửa
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white text-base font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5" />
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-bold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X className="w-5 h-5" />
                                    Hủy bỏ
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}