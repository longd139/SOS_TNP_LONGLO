import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Chart from '../../components/dashboard/Chart';
import { dashboardStats, chartData, recentReports } from '../../mockData';
import { AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

export default function Dashboard() {
    const getStatusColor = (status) => {
        const colors = {
            'Chờ xử lý': 'bg-orange-100 text-orange-800',
            'Đang xử lý': 'bg-blue-100 text-blue-800',
            'Đã giải quyết': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-3 md:space-y-4 min-h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard
                    title="Tổng phản ánh hôm nay"
                    value={dashboardStats.totalReports}
                    icon={<MessageSquare />}
                    color="blue"
                />
                <StatCard
                    title="Chờ xử lý"
                    value={dashboardStats.pendingReports}
                    icon={<Clock />}
                    color="orange"
                />
                <StatCard
                    title="Đã giải quyết"
                    value={dashboardStats.resolvedReports}
                    icon={<CheckCircle />}
                    color="green"
                />
                <StatCard
                    title="Khẩn cấp"
                    value={dashboardStats.urgentReports}
                    icon={<AlertTriangle />}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <Chart
                    type="line"
                    title="Xu hướng phản ánh"
                    data={chartData.trends}
                />
                <Chart
                    type="bar"
                    title="Lượt truy cập ứng dụng"
                    data={chartData.visits}
                />
            </div>

            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                    Phản ánh gần đây
                </h3>

                <div className="space-y-3 md:space-y-4">
                    {recentReports.map((report) => (
                        <div key={report.id} className="pb-3 md:pb-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-2 mb-2 md:mb-3">
                                        <span className="text-xs md:text-sm font-semibold text-gray-700">{report.id}</span>
                                        {report.isUrgent && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                <AlertTriangle className="w-3 h-3" />
                                                Khẩn
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h4 className="text-sm md:text-base font-medium text-gray-900 mb-2 md:mb-3 leading-tight">
                                        {report.title}
                                    </h4>
                                    
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2 md:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            {report.category}
                                        </span>
                                        <span className="hidden sm:inline text-gray-400">•</span>
                                        <span className="truncate max-w-full sm:max-w-xs">
                                            {report.reporter}
                                            {report.phone && <span className="hidden md:inline"> - {report.phone}</span>}
                                        </span>
                                        <span className="hidden sm:inline text-gray-400">•</span>
                                        <span className="whitespace-nowrap">{report.timeAgo}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0 self-start">
                                    <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
