import React, { useState, useEffect } from "react";
import {
    X,
    Calendar,
    User,
    MapPin,
    FileText,
    Image as ImageIcon,
    MessageCircle,
    MessageSquare,
    Clock4,
    SquarePen,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import {
    renderStatusBadge,
    renderCategoryBadgeStyled,
    renderUrgencyBadge,
    renderContactInfo,
    getStatusStyle,
} from "../../utils/badgeUtils";
import { useReports } from "../../hooks/useReports";
import { showToast } from "../../utils/toastNotification";
import { validateReport } from "../../validator/reportValidator";
import dayjs from "dayjs";
import MediaGallery from "./MediaGallery";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import { DateTimePicker, utcToVietnamTime, vietnamTimeToUTC } from "../../utils/datePicker";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import "antd/dist/reset.css";
import UserService from "../../services/userService";
import { ROLE_LABELS } from "../../constants/role";

const ReportDetailModal = ({ isOpen, onClose, report, loading = false, onStatusUpdated, mode = "edit", onModeChange }) => {
    const { statusReport, updateStatus, clearError } = useReports();
    const [selectedStatus, setSelectedStatus] = useState("");
    const [responseContent, setResponseContent] = useState("");
    const [expectedResponseDate, setExpectedResponseDate] = useState(null);
    const [expectedCompletionDate, setExpectedCompletionDate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = mode === "edit";

    const [userCache, setUserCache] = useState({});

    const handleEditMode = () => {
        if (onModeChange) {
            onModeChange("edit");
        }
    };

    useEffect(() => {
    async function fetchUsers() {
        const map = {};

        const entries = report?.lich_su_trang_thai || [];
        for (const item of entries) {
            if (item.nguoi_tao && !map[item.nguoi_tao]) {
                try {
                    const user = await UserService.getUserById(item.nguoi_tao);

                    const role = user?.vai_tro;
                    const roleLabel = ROLE_LABELS[role] || "Không xác định";

                    map[item.nguoi_tao] = `${user?.ho_va_ten || "Không xác định"} - ${roleLabel}`;
                } catch (e) {
                    map[item.nguoi_tao] = "Không xác định";
                }
            }
        }

        setUserCache(map);
    }

    fetchUsers();
}, [report?.lich_su_trang_thai]);


    useEffect(() => {
        if (isOpen && report) {
            if (report.lich_su_trang_thai && report.lich_su_trang_thai.length > 0) {
                const latest = report.lich_su_trang_thai.reduce((prev, curr) => {
                    try {
                        return dayjs(prev.thoi_gian_tao).isSameOrAfter(dayjs(curr.thoi_gian_tao)) ? curr : prev;
                    } catch (e) {
                        return prev;
                    }
                }, report.lich_su_trang_thai[0]);

                const latestName = (latest && latest.ten) ? latest.ten : "";
                setSelectedStatus(latestName);

                setResponseContent(latest?.ghi_chu || "");
            }

            setExpectedResponseDate(utcToVietnamTime(report.thoi_gian_phan_hoi_du_kien));
            setExpectedCompletionDate(utcToVietnamTime(report.ngay_du_kien_hoan_thanh));
        }
    }, [report?.id, statusReport, isOpen]);

    const handleUpdateStatus = async () => {
        try {
            setIsSubmitting(true);
            clearError();

            const formData = {
                selectedStatus,
                responseContent,
                expectedResponseDate: expectedResponseDate ? expectedResponseDate.toDate() : null,
                expectedCompletionDate: expectedCompletionDate ? expectedCompletionDate.toDate() : null,
            };

            const { isValid, errors } = await validateReport(formData);

            if (!isValid) {
                const firstError = Object.values(errors)[0];
                showToast.error(firstError);
                setIsSubmitting(false);
                return;
            }

            const statusData = {
                trangThai: selectedStatus,
                ghiChu: responseContent,
            };

            if (expectedResponseDate) {
                statusData.thoiGianPhanHoiDuKien = vietnamTimeToUTC(expectedResponseDate);
            }

            if (expectedCompletionDate) {
                statusData.ngayDuKienHoanThanh = vietnamTimeToUTC(expectedCompletionDate);
            }

            await updateStatus(report.id, statusData);
            showToast.success("Cập nhật trạng thái thành công");
            setSelectedStatus("");
            setResponseContent("");
            setExpectedResponseDate(null);
            setExpectedCompletionDate(null);

            if (onStatusUpdated) {
                onStatusUpdated();
            }

            onClose();
        } catch (error) {
            
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
            
            clearError();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const API_URL = process.env.REACT_APP_API_URL;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`${isEditMode ? "Cập nhật phản ánh" : "Chi tiết phản ánh"}: #${report?.ma_phan_anh || ''}`}
            subtitle={isEditMode ? "Cập nhật trạng thái phản ánh" : "Xem chi tiết phản ánh"}
            size="3xl"
            className="max-w-5xl"
            footer={
                isEditMode ? (
                    <ModalFooter
                        onCancel={onClose}
                        onSubmit={handleUpdateStatus}
                        cancelText="Hủy"
                        submitText="Lưu và gửi thông báo"
                        submitDisabled={isSubmitting}
                        submitLoading={isSubmitting}
                    />
                ) : (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                )
            }
        >
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                </div>
            ) : report ? (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto overflow-x-hidden px-1 -mx-1 break-words">
                    <div className="flex-1">
                        <p className="text-lg mb-2 font-medium break-words overflow-wrap-anywhere">
                            {report.tieu_de}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                            {renderStatusBadge(report.lich_su_trang_thai)}
                            {renderUrgencyBadge(report.muc_do)}
                            {renderCategoryBadgeStyled(report.linh_vuc_phan_anh)}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                                Ngày gửi:
                            </span>
                            <span className="text-sm text-gray-600">
                                {formatDate(report.thoi_gian_tao)}
                            </span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0 flex-shrink">
                            <User className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600 flex-shrink-0">
                                Người gửi:
                            </span>
                            <div className="min-w-0 flex-1">
                                {renderContactInfo({
                                    name: report.ten_nguoi_phan_anh,
                                    phone: report.so_dien_thoai_nguoi_phan_anh,
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            Mô tả chi tiết
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words overflow-wrap-anywhere word-break-break-word">
                                {report.mo_ta || "Không có mô tả"}
                            </p>
                        </div>
                    </div>

                    <MediaGallery
                        images={report.dinh_kem_phan_anh || []}
                        videos={report.videos || []}
                        apiUrl={API_URL}
                    />

                    <div className="border-b pb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Vị trí
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-100 p-3.5 rounded-md break-words overflow-wrap-anywhere">
                            {report.vi_tri || "Không có thông tin vị trí"}
                        </p>
                    </div>

                    {!isEditMode && (
                        <>
                            <div className="">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        Trạng thái hiện tại
                                    </h4>
                                    <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                                        <SquarePen className="w-4 h-4 flex-shrink-0" />
                                        <button onClick={handleEditMode}>
                                            Cập nhật trạng thái
                                        </button>
                                    </div>
                                </div>
                                <p>
                                    {renderStatusBadge(report.lich_su_trang_thai)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock4 className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-900 leading-none">
                                        Lịch sử cập nhật ({report.lich_su_trang_thai?.length || 0})
                                    </span>
                                </div>

                                {report.lich_su_trang_thai && report.lich_su_trang_thai.length > 0 ? (
                                    <div className="relative pl-8">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                                        {report.lich_su_trang_thai.map((item, index) => {
                                            const statusStyle = getStatusStyle(item.ten);
                                            const isLatest = index === 0;
                                            return (
                                                <div key={item.id} className="mb-2 relative">
                                                    <span
                                                        className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 ${isLatest
                                                            ? "bg-blue-600 border-blue-600"
                                                            : "bg-white border-gray-400"
                                                            }`}
                                                    ></span>

                                                    <div className="p-2 bg-gray-50 ml-2 rounded-md">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <span
                                                                className="px-3 py-1 text-xs font-medium rounded-full"
                                                                style={{
                                                                    backgroundColor: statusStyle.bg,
                                                                    color: statusStyle.color,
                                                                }}
                                                            >
                                                                {item.ten}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(item.thoi_gian_tao)}
                                                            </span>
                                                        </div>
                                                        {item.nguoi_tao && (
                                                            <p className="text-sm text-gray-700">
                                                                <User className="inline-block mr-2 text-gray-400 w-4 h-4" />
                                                                {userCache[item.nguoi_tao] || "Đang tải..."}
                                                            </p>
                                                        )}

                                                        {item.ghi_chu && (
                                                            <p className="text-sm text-gray-700 break-words overflow-wrap-anywhere">
                                                                <MessageSquare className="inline-block mr-2 text-gray-400 w-4 h-4" />
                                                                {item.ghi_chu}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        Không có lịch sử cập nhật
                                    </div>
                                )}
                            </div>
                        </>

                    )}
                    {
                        isEditMode && (
                            <>
                                <div className="mt-0">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3 required-label">
                                        Cập nhật trạng thái
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                disabled={!isEditMode}
                                                style={{ border: 'none' }}
                                                className={`w-full px-3 py-2.5 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none break-words ${!isEditMode ? 'cursor-not-allowed opacity-75' : ''}`}
                                            >
                                                {statusReport &&
                                                    Object.entries(statusReport).map(([key, value]) => (
                                                        <option key={key} value={value}>
                                                            {value}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        {isEditMode && (
                                            <ConfigProvider locale={viVN}>
                                                {/* <div>
                                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${selectedStatus !== 'Đã giải quyết' && selectedStatus !== 'Đóng' ? 'required-label' : ''}`}>
                                                        Thời gian phản hồi dự kiến
                                                    </label>
                                                    <DateTimePicker
                                                        value={expectedResponseDate}
                                                        onChange={(date) => setExpectedResponseDate(date)}
                                                        placeholder="Chọn thời gian phản hồi"
                                                    />
                                                </div>

                                                <div>
                                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${selectedStatus !== 'Đã giải quyết' && selectedStatus !== 'Đóng' ? 'required-label' : ''}`}>
                                                        Ngày dự kiến hoàn thành
                                                    </label>
                                                    <DateTimePicker
                                                        value={expectedCompletionDate}
                                                        onChange={(date) => setExpectedCompletionDate(date)}
                                                        placeholder="Chọn ngày hoàn thành"
                                                    />
                                                </div> */}
                                            </ConfigProvider>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nội dung phản hồi
                                            </label>
                                            <textarea
                                                placeholder="Nhập nội dung phản hồi cho người dân..."
                                                rows="3"
                                                disabled={!isEditMode}
                                                value={responseContent}
                                                onChange={(e) => setResponseContent(e.target.value)}
                                                className={`w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none break-words overflow-wrap-anywhere word-break-break-word ${!isEditMode ? 'cursor-not-allowed opacity-75' : ''}`}
                                                style={{ minHeight: '72px', wordWrap: 'break-word' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                        Lịch sử trạng thái
                                    </h4>

                                    {report.lich_su_trang_thai && report.lich_su_trang_thai.length > 0 ? (
                                        <div className="space-y-4">
                                            {report.lich_su_trang_thai.map((item, index) => (
                                                <div key={item.id} className="p-3 bg-gray-50 rounded-md space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock4 className="w-4 h-4" />
                                                        <span>{formatDate(item.thoi_gian_tao)}</span>
                                                    </div>
                                                    
                                                    {item.nguoi_tao && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <User className="w-4 h-4" />
                                                            <span>{userCache[item.nguoi_tao] || "Đang tải..."}</span>
                                                        </div>
                                                    )}

                                                    {item.ghi_chu && (
                                                        <div className="flex items-start gap-2 text-sm text-gray-700">
                                                            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                            <span className="break-words overflow-wrap-anywhere">
                                                                {item.ghi_chu}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            Không có lịch sử cập nhật
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    }
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">Không có dữ liệu</p>
                </div>
            )}
        </BaseModal>
    );
};

export default ReportDetailModal;
