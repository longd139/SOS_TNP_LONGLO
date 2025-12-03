import React, { useState, useEffect, useMemo } from 'react';
import FieldReportChart from './FieldReportChart';
import StatusReportChart from './StatusReportChart';
import DomainFilter from './DomainFilter';
import Chart from '../dashboard/Chart';
import ReportDetails from './ReportDetails';
import StatisticsByCategory from './StatisticsByCategory';
import CategoryDetails from './CategoryDetails';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function ReportsTab({ dateRange }) {
    const [selectedDomain, setSelectedDomain] = useState('all');
    const { phanAnhReport, loading, loadPhanAnhReport } = useStatisticalReport();

    useEffect(() => {
        const params = {};
        if (dateRange?.from) params.from = dateRange.from;
        if (dateRange?.to) params.to = dateRange.to;
        if (selectedDomain && selectedDomain !== 'all') {
            params.id_linh_vuc = selectedDomain;
        }

        loadPhanAnhReport(params).catch(error => {
            console.error('Error loading phan anh report:', error);
        });
    }, [loadPhanAnhReport, dateRange?.from, dateRange?.to, selectedDomain]);

    const formattedChartData = useMemo(() => {
        if (!phanAnhReport?.xu_huong || typeof phanAnhReport.xu_huong !== 'object') return { trends: [] };
        
        const entries = Object.entries(phanAnhReport.xu_huong);
        if (entries.length === 0) return { trends: [] };

        entries.sort((a, b) => new Date(a[0]) - new Date(b[0]));

        return {
            trends: entries.map(([dateStr, data]) => {
                const date = new Date(dateStr);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                return {
                    date: formattedDate,
                    tongPhanAnh: data?.tong || 0,
                    daGiaiQuyet: data?.da_xu_ly || 0
                };
            })
        };
    }, [phanAnhReport?.xu_huong]);

    const pieChartData = useMemo(() => {
        if (!phanAnhReport?.bieu_do_tron_chi_tiet || typeof phanAnhReport.bieu_do_tron_chi_tiet !== 'object') return [];
        
        const entries = Object.entries(phanAnhReport.bieu_do_tron_chi_tiet);
        if (entries.length === 0) return [];

        const total = phanAnhReport?.tong_phan_anh || entries.reduce((sum, [, count]) => sum + count, 0) || 1;

        return entries.map(([category, count], index) => ({
            category,
            count: count || 0,
            percentage: ((count / total) * 100).toFixed(1),
            color: COLORS[index % COLORS.length]
        }));
    }, [phanAnhReport?.bieu_do_tron_chi_tiet, phanAnhReport?.tong_phan_anh]);

    const totalReportsCount = useMemo(() => {
        return phanAnhReport?.tong_phan_anh || 0;
    }, [phanAnhReport?.tong_phan_anh]);

    const statusData = useMemo(() => {
        if (!phanAnhReport?.phan_bo_theo_trang_thai || typeof phanAnhReport.phan_bo_theo_trang_thai !== 'object') return [];
        
        const entries = Object.entries(phanAnhReport.phan_bo_theo_trang_thai);
        if (entries.length === 0) return [];

        return entries.map(([status, count]) => ({
            status,
            count: count || 0
        }));
    }, [phanAnhReport?.phan_bo_theo_trang_thai]);

    const latestReports = useMemo(() => {
        if (!phanAnhReport?.phan_anh_moi_cap_nhat || !Array.isArray(phanAnhReport.phan_anh_moi_cap_nhat)) return [];
        
        return phanAnhReport.phan_anh_moi_cap_nhat.map(item => ({
            id: item.ma_phan_anh || item.id,
            title: item.tieu_de,
            category: item.linh_vuc_phan_anh || item.linh_vuc || item.ten_linh_vuc,
            status: item.trang_thai_hien_tai || item.trang_thai,
            statusColor: getStatusColor(item.trang_thai_hien_tai || item.trang_thai),
            statusBg: getStatusBg(item.trang_thai_hien_tai || item.trang_thai),
            createdDate: formatDateTime(item.thoi_gian_cap_nhat || item.ngay_cap_nhat || item.ngay_tao)
        }));
    }, [phanAnhReport?.phan_anh_moi_cap_nhat]);

    const categoryStats = useMemo(() => {
        if (!phanAnhReport?.top_5_linh_vuc_theo_phan_anh) return [];
        
        if (Array.isArray(phanAnhReport.top_5_linh_vuc_theo_phan_anh)) {
            return phanAnhReport.top_5_linh_vuc_theo_phan_anh.map((data) => ({
                category: data.ten_linh_vuc || data.category || '',
                nameArea: data.ten_linh_vuc || '',
                totalReports: data.tong_phan_anh || 0,
                resolved: data.da_xu_ly || 0,
                unresolved: data.chua_xu_ly || 0,
                averageProcessingTime: data.thoi_gian_xu_ly_tb || 0,
                percentage: data.ty_le || 0
            }));
        }

        if (typeof phanAnhReport.top_5_linh_vuc_theo_phan_anh === 'object') {
            const entries = Object.entries(phanAnhReport.top_5_linh_vuc_theo_phan_anh);
            if (entries.length === 0) return [];

            return entries.map(([category, data]) => ({
                category,
                nameArea: data.ten_linh_vuc || '',
                totalReports: data.tong_phan_anh || 0,
                resolved: data.da_xu_ly || 0,
                unresolved: data.chua_xu_ly || 0,
                averageProcessingTime: data.thoi_gian_xu_ly_tb || 0,
                percentage: data.ty_le || 0
            }));
        }

        return [];
    }, [phanAnhReport?.top_5_linh_vuc_theo_phan_anh]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="space-y-3 md:space-y-4">
            <DomainFilter
                selectedDomain={selectedDomain}
                onDomainChange={setSelectedDomain}
            />

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4">
                <Chart
                    type="line"
                    title="Xu hướng phản ánh"
                    data={formattedChartData?.trends}
                />
            </div>

            <ReportDetails data={latestReports} />

            <StatisticsByCategory data={categoryStats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <FieldReportChart 
                    dateRange={dateRange}
                    total={totalReportsCount} 
                    cateData={pieChartData} 
                    title="Biểu Đồ Tròn Phản Ánh"
                    subTotal="Tổng số phản ánh"
                    nameCate="phản ánh"
                />
                <CategoryDetails data={pieChartData} total={totalReportsCount} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4">
                <StatusReportChart dateRange={dateRange} data={statusData} />
            </div>
        </div>
    );
}

function getStatusColor(status) {
    const statusColors = {
        'Đã giải quyết': '#059669',
        'Đang xử lý': '#2563EB',
        'Đã tiếp nhận': '#D97706',
        'Đã gửi': '#6B7280',
        'Đóng': '#7C3AED',
        'Mới': '#DC2626'
    };
    return statusColors[status] || '#6B7280';
}

function getStatusBg(status) {
    const statusBgs = {
        'Đã giải quyết': '#D1FAE5',
        'Đang xử lý': '#DBEAFE',
        'Đã tiếp nhận': '#FEF3C7',
        'Đã gửi': '#F3F4F6',
        'Đóng': '#E9D5FF',
        'Mới': '#FEE2E2'
    };
    return statusBgs[status] || '#F3F4F6';
}
