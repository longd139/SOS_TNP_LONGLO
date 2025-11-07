import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BaseTable from '../../components/base/BaseTable';
import { useReports } from '../../hooks/useReports';
import { useReportAreas } from '../../hooks/useReportAreas';
import { formatDate } from '../../utils/formatDate';
import { showToast } from '../../utils/toastNotification';

export default function ReportList() {
    const navigate = useNavigate();
    const {
        reports,
        loading,
        error,
        pagination,
        loadReports,
        loadExtent,
        loadStatusReport,
        extent,
        statusReport
    } = useReports({ autoFetch: false });

    const { reportAreas, loadReportAreas } = useReportAreas({ autoFetch: false });

    const [filters, setFilters] = useState({
        trangThai: '',
        idLinhVucPhanAnh: '',
        mucDo: '',
        maPhanAnh: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const loadInitialData = async () => {
        try {
            await Promise.all([
                loadExtent(),
                loadStatusReport(),
                loadReportAreas({ page: 1, size: 100, isActive: true })
            ]);
        } catch (error) {
            showToast.error('Lỗi khi tải dữ liệu khởi tạo');
        }
    };

    const fetchReports = async () => {
        try {
            await loadReports({
                page: currentPage,
                size: pageSize,
                ...filters
            });
        } catch (error) {
            showToast.error('Lỗi khi tải danh sách phản ánh');
        }
    };

    useEffect(() => {
        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchReports();
    }, [currentPage, filters]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value === 'all' ? '' : value
        }));
        setCurrentPage(1);
    };

    const handleView = (item) => {
        showToast.info(`Chức năng xem phản ánh ${item.id} đang được phát triển!`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const calculateDaysOpen = (createdDate) => {
        const created = new Date(createdDate);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} ngày`;
    };

    const getStatusStyle = (statusName) => {
        const styles = {
            'Đã gửi': { bg: '#FEF3C7', color: '#92400E' },
            'Đã tiếp nhận': { bg: '#DBEAFE', color: '#1E40AF' },
            'Đang xử lý': { bg: '#FED7AA', color: '#9A3412' },
            'Đã giải quyết': { bg: '#D1FAE5', color: '#065F46' },
            'Đóng': { bg: '#E5E7EB', color: '#374151' }
        };
        return styles[statusName] || { bg: '#F3F4F6', color: '#6B7280' };
    };

    const getUrgencyStyle = (mucDo) => {
        if (mucDo === 'Khẩn cấp') {
            return { bg: '#FEE2E2', color: '#991B1B', showIcon: true };
        }
        return { bg: '#F3F4F6', color: '#6B7280', showIcon: false };
    };

    const transformedData = reports.map((report, index) => {
        const statusStyle = getStatusStyle(report.lich_su_trang_thai?.[report.lich_su_trang_thai.length - 1]?.ten);
        const urgencyStyle = getUrgencyStyle(report.muc_do);
        
        return {
            id: report.ma_phan_anh || report.id,
            actualId: report.id,
            title: report.tieu_de || 'Không có tiêu đề',
            category: report.linh_vuc_phan_anh?.ten || 'Chưa phân loại',
            status: report.lich_su_trang_thai?.[report.lich_su_trang_thai.length - 1]?.ten || 'Chưa xác định',
            statusBg: statusStyle.bg,
            statusColor: statusStyle.color,
            urgency: report.muc_do || 'Thông thường',
            urgencyBg: urgencyStyle.bg,
            urgencyColor: urgencyStyle.color,
            urgencyIcon: urgencyStyle.showIcon,
            submittedDate: formatDate(report.thoi_gian_tao),
            daysOpen: calculateDaysOpen(report.thoi_gian_tao),
            contact: {
                name: report.ten_nguoi_phan_anh || 'Ẩn danh',
                phone: report.sdt_nguoi_phan_anh || ''
            }
        };
    });

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (value, record, index) => (
                <span className="text-sm text-gray-600">
                    #{(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                </span>
            )
        },
        {
            title: 'Mã phản ánh',
            dataIndex: 'id',
            key: 'id',
            render: (value) => (
                <span className="text-sm font-medium text-gray-900">{value}</span>
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '200px',
            render: (value) => (
                <div 
                    className="text-sm text-gray-900 max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value}
                >
                    {value}
                </div>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value, record) => (
                <span
                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                        backgroundColor: record.statusBg,
                        color: record.statusColor
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            title: 'Độ khẩn',
            dataIndex: 'urgency',
            key: 'urgency',
            render: (value, record) => (
                <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                        backgroundColor: record.urgencyBg,
                        color: record.urgencyColor
                    }}
                >
                    {record.urgencyIcon && <AlertTriangle className="w-3 h-3" />}
                    {value}
                </span>
            )
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'submittedDate',
            key: 'submittedDate',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Số ngày mở',
            dataIndex: 'daysOpen',
            key: 'daysOpen',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Thông tin liên hệ',
            dataIndex: 'contact',
            key: 'contact',
            width: '180px',
            render: (value) => {
                const name = value.name || 'Ẩn danh';
                const fullText = value.phone ? `${name}\n${value.phone}` : name;
                return (
                    <div className="text-sm max-w-[180px]" title={fullText}>
                        <div className="text-gray-900 truncate text-ellipsis overflow-hidden whitespace-nowrap">
                            {name}
                        </div>
                        {value.phone && (
                            <div className="text-gray-500 truncate text-ellipsis overflow-hidden whitespace-nowrap">
                                {value.phone}
                            </div>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý phản ánh</h1>
                <p className="text-gray-600 mt-1">Xem và xử lý phản ánh từ người dân</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Bộ lọc</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={filters.trangThai || 'all'}
                            onChange={(e) => handleFilterChange('trangThai', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            {statusReport && Object.entries(statusReport).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lĩnh vực
                        </label>
                        <select
                            value={filters.idLinhVucPhanAnh || 'all'}
                            onChange={(e) => handleFilterChange('idLinhVucPhanAnh', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            {reportAreas.map((area) => (
                                <option key={area.id} value={area.id}>{area.ten}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mức độ
                        </label>
                        <select
                            value={filters.mucDo || 'all'}
                            onChange={(e) => handleFilterChange('mucDo', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            {extent && Object.entries(extent).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
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
                                onChange={(e) => handleFilterChange('maPhanAnh', e.target.value)}
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
            ) : error ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            ) : (
                <BaseTable
                    data={transformedData}
                    columns={columns}
                    onView={(item) => handleView(item)}
                    showActions={true}
                    emptyMessage="Không có phản ánh nào"
                    pagination={{
                        current: pagination.currentPage,
                        pageSize: pagination.pageSize,
                        total: pagination.totalItems,
                        onChange: handlePageChange
                    }}
                />
            )}
        </div>
    );
}
