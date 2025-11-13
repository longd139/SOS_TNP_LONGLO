import React, { useState, useEffect } from "react";
import {
    X,
    Calendar,
    User,
    MapPin,
    FileText,
    Image as ImageIcon,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import {
    renderStatusBadge,
    renderCategoryBadgeStyled,
    renderUrgencyBadge,
    renderContactInfo,
} from "../../utils/badgeUtils";
import { useReports } from "../../hooks/useReports";
import { showToast } from "../../utils/toastNotification";
import { validateReport } from "../../validator/reportValidator";
import dayjs from "dayjs";
import MediaGallery from "./MediaGallery";

const ReportDetailModal = ({ isOpen, onClose, report, loading = false, onStatusUpdated, mode = "view" }) => {
    const { statusReport, updateStatus, clearError } = useReports();
    const [selectedStatus, setSelectedStatus] = useState("");
    const [responseContent, setResponseContent] = useState("");
    const [expectedResponseDate, setExpectedResponseDate] = useState("");
    const [expectedCompletionDate, setExpectedCompletionDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = mode === "edit";

    useEffect(() => {
        if (isOpen && report && report.lich_su_trang_thai && report.lich_su_trang_thai.length > 0) {
            const latest = report.lich_su_trang_thai.reduce((prev, curr) => {
                try {
                    return dayjs(prev.thoi_gian_tao).isSameOrAfter(dayjs(curr.thoi_gian_tao)) ? curr : prev;
                } catch (e) {
                    return prev;
                }
            }, report.lich_su_trang_thai[0]);

            const latestName = (latest && latest.ten) ? latest.ten : "";
            
            setSelectedStatus(latestName);
            setResponseContent("");
            setExpectedResponseDate("");
            setExpectedCompletionDate("");
        }
    }, [report?.id, statusReport, isOpen]);

    const handleUpdateStatus = async () => {
        try {
            setIsSubmitting(true);
            clearError();

            const formData = {
                selectedStatus,
                responseContent,
                expectedResponseDate: expectedResponseDate ? new Date(expectedResponseDate) : null,
                expectedCompletionDate: expectedCompletionDate ? new Date(expectedCompletionDate) : null,
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
                statusData.thoiGianPhanHoiDuKien = new Date(expectedResponseDate).toISOString();
            }

            if (expectedCompletionDate) {
                statusData.ngayDuKienHoanThanh = new Date(expectedCompletionDate).toISOString();
            }

            await updateStatus(report.id, statusData);
            showToast.success("Cập nhật trạng thái thành công");
            setSelectedStatus("");
            setResponseContent("");
            setExpectedResponseDate("");
            setExpectedCompletionDate("");

            if (onStatusUpdated) {
                onStatusUpdated();
            }

            onClose();
        } catch (error) {
            showToast.error(error);
            clearError();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const API_URL = process.env.REACT_APP_API_URL;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                    {loading ? (
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center justify-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                            </div>
                        </div>
                    ) : report ? (
                        <>
                            <div className="bg-white px-4 pt-5 sm:p-6 sm:pb-0 max-h-[calc(100vh-100px)] max-w-2xl overflow-y-auto">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="items-center gap-2 mb-4">
                                            <h2 className="text-md text-black font-semibold mb-2">
                                                {isEditMode ? "Cập nhật phản ánh" : "Chi tiết phản ánh"}: #{report.ma_phan_anh}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {isEditMode ? "Cập nhật trạng thái phản ánh" : "Xem chi tiết phản ánh"}
                                            </p>
                                        </div>
                                        <p className="text-lg mb-2">
                                            {report.tieu_de}
                                        </p>
                                        <div className="flex items-center gap-2 mb-4">
                                            {renderStatusBadge(report.lich_su_trang_thai)}
                                            {renderUrgencyBadge(report.muc_do)}
                                            {renderCategoryBadgeStyled(report.linh_vuc_phan_anh)}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Đóng</span>
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-600">
                                                Ngày gửi:
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {formatDate(report.thoi_gian_tao)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <User className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-600">
                                                Người gửi:
                                            </span>
                                            {renderContactInfo({
                                                name: report.ten_nguoi_phan_anh,
                                                phone: report.so_dien_thoai_nguoi_phan_anh,
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            Mô tả chi tiết
                                        </h4>
                                        <p className="text-sm text-gray-700 rounded-md whitespace-pre-wrap mb-6">
                                            {report.mo_ta || "Không có mô tả"}
                                        </p>
                                    </div>

                                    <MediaGallery
                                        images={report.dinh_kem_phan_anh || []}
                                        videos={report.videos || []}
                                        apiUrl={API_URL}
                                    />

                                    <div className="border-b">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2 ">
                                            <MapPin className="w-4 h-4" />
                                            Vị trí
                                        </h4>
                                        <p className="text-sm text-gray-700 bg-gray-100 p-3.5 rounded-md mb-6">
                                            {report.vi_tri || "Không có thông tin vị trí"}
                                        </p>
                                    </div>

                                    <div className="mt-0">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 required-label">
                                            {isEditMode ? "Cập nhật trạng thái" : "Trạng thái"}
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    disabled={!isEditMode}
                                                    style={{ border: 'none' }}
                                                    className={`w-full px-3 py-2.5 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none ${!isEditMode ? 'cursor-not-allowed opacity-75' : ''}`}
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
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                                                            Thời gian phản hồi dự kiến
                                                        </label>
                                                        <input
                                                            type="datetime-local"
                                                            value={expectedResponseDate}
                                                            onChange={(e) => setExpectedResponseDate(e.target.value)}
                                                            className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                                                            Ngày dự kiến hoàn thành
                                                        </label>
                                                        <input
                                                            type="datetime-local"
                                                            value={expectedCompletionDate}
                                                            onChange={(e) => setExpectedCompletionDate(e.target.value)}
                                                            className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        />
                                                    </div>
                                                </>)}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                                                    Nội dung phản hồi
                                                </label>
                                                <textarea
                                                    placeholder="Nhập nội dung phản hồi cho người dân..."
                                                    rows="3"
                                                    value={responseContent}
                                                    onChange={(e) => setResponseContent(e.target.value)}
                                                    className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                                {isEditMode ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleUpdateStatus}
                                            disabled={isSubmitting}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "Đang xử lý..." : "Lưu và gửi thông báo"}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                        >
                                            Hủy
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                                        onClick={onClose}
                                    >
                                        Đóng
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                            <div className="text-center py-12">
                                <p className="text-gray-500">Không có dữ liệu</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportDetailModal;
