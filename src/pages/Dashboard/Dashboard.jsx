import React from 'react';
import StatCard from '../../components/StatCard';
import Chart from '../../components/Chart';
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
        <div className="space-y-6 min-h-full">
            <div className="grid grid-cols-4 gap-6">
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

            <div className="grid grid-cols-2 gap-6">
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

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Phản ánh gần đây
                </h3>

                <div className="space-y-6">
                    {recentReports.map((report) => (
                        <div key={report.id} className="pb-6 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className="text-sm font-semibold text-gray-700">{report.id}</span>
                                        {report.isUrgent && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                <AlertTriangle className="w-3 h-3" />
                                                Khẩn
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h4 className="text-base font-medium text-gray-900 mb-3 leading-tight">
                                        {report.title}
                                    </h4>
                                    
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            {report.category}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span>
                                            {report.reporter}
                                            {report.phone && ` - ${report.phone}`}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span>{report.timeAgo}</span>
                                    </div>
                                </div>
                                
                                <div className="ml-6 flex-shrink-0">
                                    <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(report.status)}`}>
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
