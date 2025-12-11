import React, { useEffect, useMemo } from 'react';
import Chart from '../dashboard/Chart';
import NewsDetailsTable from './NewsDetailsTable';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';

export default function NewsTab({ dateRange }) {
    const { tinTucReport, loading, loadTinTucReport } = useStatisticalReport();

    useEffect(() => {
        const params = {};
        if (dateRange?.from) params.from = dateRange.from;
        if (dateRange?.to) params.to = dateRange.to;

        loadTinTucReport(params).catch(error => {
            //console.error('Error loading tin tuc report:', error);
        });
    }, [loadTinTucReport, dateRange?.from, dateRange?.to]);

    const { chartData, tableData } = useMemo(() => {
        if (!tinTucReport || typeof tinTucReport !== 'object') return { chartData: [], tableData: [] };

        const entries = Object.entries(tinTucReport);
        if (entries.length === 0) return { chartData: [], tableData: [] };
        
        const chartData = entries.map(([date, data]) => {
            const dateObj = new Date(date);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
            return {
                date: formattedDate,
                banNhap: data.ban_nhap || 0,
                luotXem: data.luot_xem || 0,
                daXuatBan: data.da_xuat_ban || 0
            };
        });

        const tableData = entries.map(([date, data]) => {
            const dateObj = new Date(date);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
            return {
                date: formattedDate,
                daXuatBan: data.da_xuat_ban || 0,
                banNhap: data.ban_nhap || 0,
                tongBaiViet: data.tong || 0,
                luotXem: data.luot_xem || 0
            };
        });

        return { chartData, tableData };
    }, [tinTucReport]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4">
                <Chart
                    type="line"
                    title="Xu hướng tin tức"
                    data={chartData}
                    lines={[
                        { key: 'banNhap', color: '#FF8C00', name: 'Bản nháp' },
                        { key: 'luotXem', color: '#3B82F6', name: 'Lượt xem' },
                        { key: 'daXuatBan', color: '#10B981', name: 'Đã xuất bản' }
                    ]}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Thống kê tin tức chi tiết
                </h3>
                <NewsDetailsTable data={tableData} />
            </div>
        </div>
    );
}