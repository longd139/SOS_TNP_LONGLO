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
import BaseModal, { ModalFooter } from "../base/BaseModal";

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
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                                            Thời gian phản hồi dự kiến
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={expectedResponseDate || dayjs(report?.thoi_gian_phan_hoi_du_kien).format('YYYY-MM-DDTHH:mm') || ''}
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
                                            value={expectedCompletionDate || dayjs(report?.ngay_du_kien_hoan_thanh).format('YYYY-MM-DDTHH:mm') || ''}
                                            onChange={(e) => setExpectedCompletionDate(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
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
