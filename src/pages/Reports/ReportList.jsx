import React, { useState, useEffect, useCallback } from "react";
import BaseTable from "../../components/base/BaseTable";
import ReportDetailModal from "../../components/report/ReportDetailModal";
import { useReports } from "../../hooks/useReports";
import { useReportAreas } from "../../hooks/useReportAreas";
import { showToast } from "../../utils/toastNotification";
import {
    renderStatusBadge,
    renderCategoryBadge,
    renderUrgencyBadge,
    renderContactInfo,
} from "../../utils/badgeUtils";
import dayjs from "dayjs";

export default function ReportList() {
    const {
        reports,
        loading,
        pagination,
        loadReports,
        loadReportById,
        loadExtent,
        loadStatusReport,
        extent,
        statusReport,
        clearError,
    } = useReports({ autoFetch: false });

    const { reportAreas, loadReportAreas } = useReportAreas({ autoFetch: false });
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [modalMode, setModalMode] = useState("view"); 

    const [filters, setFilters] = useState({
        trangThai: "",
        idLinhVucPhanAnh: "",
        mucDo: "",
        maPhanAnh: "",
        sortTime: "desc",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const loadInitialData = async () => {
        try {
            await Promise.all([
                loadExtent(),
                loadStatusReport(),
                loadReportAreas({ page: 1, size: 100, isActive: true }),
            ]);
        } catch (error) {
            showToast.error("Lỗi khi tải dữ liệu khởi tạo");
        }
    };

    const fetchReports = useCallback(async () => {
        try {
            await loadReports({
                page: currentPage,
                size: pageSize,
                ...filters,
            });
        } catch (error) {
            showToast.error("Lỗi khi tải danh sách phản ánh");
        }
    }, [currentPage, pageSize, filters, loadReports]);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value === "all" ? "" : value,
        }));
        setCurrentPage(1);
    };

    const handleView = async (item) => {
        try {
            setModalMode("view");
            setIsPreviewModalOpen(true);
            const reportData = await loadReportById(item.id);
            setSelectedReport(reportData);
        } catch (error) {
            showToast.error("Lỗi khi tải chi tiết phản ánh");
            setIsPreviewModalOpen(false);
        }
    };

    const handleEdit = async (item) => {
        try {
            setModalMode("edit");
            setIsPreviewModalOpen(true);
            const reportData = await loadReportById(item.id);
            setSelectedReport(reportData);
        } catch (error) {
            showToast.error("Lỗi khi tải chi tiết phản ánh");
            setIsPreviewModalOpen(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (value, record, index) => (
                <span className="text-sm text-gray-600">
                    #{(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                </span>
            ),
        },
        {
            title: "Mã phản ánh",
            dataIndex: "ma_phan_anh",
            key: "ma_phan_anh",
            render: (value) => (
                <span className="text-sm text-gray-900">{value}</span>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "tieu_de",
            key: "tieu_de",
            width: "200px",
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value}
                >
                    {value}
                </div>
            ),
        },
        {
            title: "Lĩnh vực",
            dataIndex: "linh_vuc_phan_anh",
            key: "linh_vuc_phan_anh",
            render: (value) => renderCategoryBadge(value),
        },
        {
            title: "Trạng thái",
            dataIndex: "lich_su_trang_thai",
            key: "lich_su_trang_thai",
            render: (value) => renderStatusBadge(value),
        },
        {
            title: "Độ khẩn",
            dataIndex: "muc_do",
            key: "muc_do",
            render: (value) => renderUrgencyBadge(value),
        },
        {
            title: "Ngày gửi",
            dataIndex: "thoi_gian_tao",
            key: "thoi_gian_tao",
            render: (value) => <span className="text-sm text-gray-600">{dayjs(value).format("HH:mm DD/MM/YYYY")}</span>,
        },
        {
            title: "Thông tin liên hệ",
            key: "thong_tin_lien_he",
            width: "180px",
            render: (value, record) => {
                const name = record.ten_nguoi_phan_anh || "Ẩn danh";
                const phone = record.sdt_nguoi_phan_anh || null;
                return renderContactInfo({ name, phone }, 180);
            },
        },
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý phản ánh</h1>
                <p className="text-gray-600 mt-1">Xem và xử lý phản ánh từ người dân</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Bộ lọc</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={filters.trangThai || "all"}
                            onChange={(e) => handleFilterChange("trangThai", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        >
                            <option value="all">Tất cả</option>
                            {statusReport &&
                                Object.entries(statusReport).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lĩnh vực
                        </label>
                        <select
                            value={filters.idLinhVucPhanAnh || "all"}
                            onChange={(e) =>
                                handleFilterChange("idLinhVucPhanAnh", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        >
                            <option value="all">Tất cả</option>
                            {reportAreas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.ten}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mức độ
                        </label>
                        <select
                            value={filters.mucDo || "all"}
                            onChange={(e) => handleFilterChange("mucDo", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        >
                            <option value="all">Tất cả</option>
                            {extent &&
                                Object.entries(extent).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sắp xếp theo thời gian
                        </label>
                        <select
                            value={filters.sortTime || "desc"}
                            onChange={(e) => handleFilterChange("sortTime", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        >
                            <option value="desc">Mới nhất trước</option>
                            <option value="asc">Cũ nhất trước</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã phản ánh
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm theo mã phản ánh..."
                                value={filters.maPhanAnh}
                                onChange={(e) =>
                                    handleFilterChange("maPhanAnh", e.target.value)
                                }
                                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-4 py-3">
                <h3 className="font-semibold text-gray-900">
                    Danh sách phản ánh ({pagination.totalItems || 0})
                </h3>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <BaseTable
                    data={reports}
                    columns={columns}
                    onView={handleView}
                    onEdit={handleEdit}
                    showActions={true}
                    emptyMessage="Không có phản ánh nào"
                    pagination={{
                        current: pagination.currentPage,
                        pageSize: pagination.pageSize,
                        total: pagination.totalItems,
                        onChange: handlePageChange,
                    }}
                />
            )}

            <ReportDetailModal
                isOpen={isPreviewModalOpen}
                onClose={() => {
                    setIsPreviewModalOpen(false);
                    setSelectedReport(null);
                    setModalMode("view");
                    clearError(); 
                }}
                report={selectedReport}
                loading={!selectedReport && isPreviewModalOpen}
                onStatusUpdated={() => {
                    clearError();
                    fetchReports();
                }}
                mode={modalMode}
            />
        </div>
    );
}
