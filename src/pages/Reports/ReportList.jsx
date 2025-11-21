import React, { useState, useEffect, useCallback } from "react";
import BaseTable from "../../components/base/BaseTable";
import ReportDetailModal from "../../components/report/ReportDetailModal";
import ReportFilter from "../../components/report/ReportFilter";
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
        pageSize: 10,
    });

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([
                    loadExtent(),
                    loadStatusReport(),
                    loadReportAreas({ page: 1, size: 10, isActive: true }),
                ]);
            } catch (error) {
                showToast.error("Lỗi khi tải dữ liệu khởi tạo");
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const params = {
            page: currentPage,
            size: filters.pageSize,
            trangThai: filters.trangThai,
            idLinhVucPhanAnh: filters.idLinhVucPhanAnh,
            mucDo: filters.mucDo,
            maPhanAnh: filters.maPhanAnh,
            sortTime: filters.sortTime,
        };
        
        loadReports(params).catch(() => {
            showToast.error("Lỗi khi tải danh sách phản ánh");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters.pageSize, filters.trangThai, filters.idLinhVucPhanAnh, filters.mucDo, filters.maPhanAnh, filters.sortTime]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            trangThai: "",
            idLinhVucPhanAnh: "",
            mucDo: "",
            maPhanAnh: "",
            sortTime: "desc",
            pageSize: 10,
        });
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
                <span className="text-sm font-medium text-gray-900">
                    #{((pagination?.currentPage || 1) - 1) * (pagination?.pageSize || filters.pageSize) + index + 1}
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
            render: (value) => <span className="text-sm text-gray-600">{dayjs(value).format("DD/MM/YYYY HH:mm")}</span>,
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

            <ReportFilter
                onFilter={handleFilterChange}
                onReset={handleResetFilters}
                filters={filters}
                pagination={pagination}
                statusReport={statusReport}
                reportAreas={reportAreas}
                extent={extent}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-4 py-3">
                <h3 className="font-semibold text-gray-900 mb-0">
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
                        totalPages: pagination.totalPages,
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
                    loadReports({
                        page: currentPage,
                        size: filters.pageSize,
                        trangThai: filters.trangThai,
                        idLinhVucPhanAnh: filters.idLinhVucPhanAnh,
                        mucDo: filters.mucDo,
                        maPhanAnh: filters.maPhanAnh,
                        sortTime: filters.sortTime,
                    });
                }}
                mode={modalMode}
                onModeChange={setModalMode}
            />
        </div>
    );
}
