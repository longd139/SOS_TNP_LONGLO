import React, { useEffect, useMemo } from 'react';
import { ClipboardList, FileText, FileX } from 'lucide-react';
import ProceduresBarChart from './ProceduresBarChart';
import FieldReportChart from './FieldReportChart';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const iconMap = {
    total: ClipboardList,
    withForm: FileText,
    withoutForm: FileX
};

const colorMap = {
    blue: {
        bg: 'bg-white',
        text: 'text-blue-600',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600'
    },
    green: {
        bg: 'bg-white',
        text: 'text-green-600',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600'
    },
    orange: {
        bg: 'bg-white',
        text: 'text-orange-600',
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600'
    }
};

export default function ProceduresTab({ dateRange }) {
    const { thuTucReport, loading, loadThuTucReport } = useStatisticalReport();

    useEffect(() => {
        const params = {};
        if (dateRange?.from) params.from = dateRange.from;
        if (dateRange?.to) params.to = dateRange.to;

        loadThuTucReport(params).catch(error => {
            console.error('Error loading thu tuc report:', error);
        });
    }, [loadThuTucReport, dateRange?.from, dateRange?.to]);

    const statsData = useMemo(() => {
        if (!thuTucReport) return [];

        return [
            {
                title: "Tổng thủ tục",
                value: thuTucReport.tong_thu_tuc || 0,
                icon: "total",
                color: "blue"
            },
            {
                title: "Có biểu mẫu",
                value: thuTucReport.thu_tuc_co_mau_don || 0,
                icon: "withForm",
                color: "green"
            },
            {
                title: "Không biểu mẫu",
                value: thuTucReport.thu_tuc_khong_mau_don || 0,
                icon: "withoutForm",
                color: "orange"
            }
        ];
    }, [thuTucReport]);

    const pieChartData = useMemo(() => {
        if (!thuTucReport?.thu_tuc_linh_vuc) return [];

        const total = thuTucReport.tong_thu_tuc || 1;

        if (typeof thuTucReport.thu_tuc_linh_vuc === 'object' && !Array.isArray(thuTucReport.thu_tuc_linh_vuc)) {
            const entries = Object.entries(thuTucReport.thu_tuc_linh_vuc);
            return entries.map(([category, data], index) => ({
                category,
                count: data?.count || 0,
                percentage: data?.percent || ((data?.count || 0) / total * 100).toFixed(2),
                color: COLORS[index % COLORS.length]
            }));
        }

        if (Array.isArray(thuTucReport.thu_tuc_linh_vuc)) {
            return thuTucReport.thu_tuc_linh_vuc.map((item, index) => ({
                category: item.ten_linh_vuc || item.linh_vuc,
                count: item.so_luong || item.count || 0,
                percentage: item.percent || ((item.so_luong || item.count || 0) / total * 100).toFixed(2),
                color: COLORS[index % COLORS.length]
            }));
        }

        return [];
    }, [thuTucReport]);

    const totalProceduresCount = useMemo(() => {
        return thuTucReport?.tong_thu_tuc || 0;
    }, [thuTucReport]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData.map((stat, index) => {
                    const IconComponent = iconMap[stat.icon];
                    const colors = colorMap[stat.color];

                    return (
                        <div key={index} className={`${colors.bg} rounded-lg p-4 shadow-sm border border-gray-200`}>
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className={`text-xl font-bold ${colors.text}`}>
                                        {stat.value.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`${colors.iconBg} ${colors.iconText} rounded-lg p-2.5 ml-4`}>
                                    <IconComponent size={20} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <FieldReportChart
                    dateRange={dateRange}
                    total={totalProceduresCount}
                    cateData={pieChartData}
                    title="Biểu Đồ Tròn Thủ Tục"
                    subTotal="Tổng số thủ tục"
                />
                <ProceduresBarChart data={pieChartData} total={totalProceduresCount} />
            </div>
        </div>
    );
}