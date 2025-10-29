import React, { useState } from 'react';
import { Download, FileText, Users, Activity, Clock } from 'lucide-react';
import { statisticsData } from '../../mockData';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    LineChart, Line
} from 'recharts';

export default function Statistic() {
    const [activeTab, setActiveTab] = useState('reports');
    const [dateRange, setDateRange] = useState({
        from: '2025-10-01',
        to: '2025-10-22'
    });
    const [reportType, setReportType] = useState('overview');

    const handleExportExcel = () => {
        console.log('Export to Excel');
    };

    const handleExportPDF = () => {
        console.log('Export to PDF');
    };

    return (
        <div className="p-4 md:p-6">
            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                        Báo cáo & Thống kê
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Phân tích dữ liệu và xuất báo cáo
                    </p>
                </div>

                <div className="flex gap-2 md:gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Xuất Excel</span>
                        <span className="sm:hidden">Excel</span>
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Xuất PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
                <div className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Bộ lọc báo cáo</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                            Loại báo cáo
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="overview">Tổng quan</option>
                            <option value="reports">Phản ánh</option>
                            <option value="users">Người dùng</option>
                            <option value="procedures">Thủ tục</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                            Từ ngày
                        </label>
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                            Đến ngày
                        </label>
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4 md:mb-6">
                <div className="flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
                            activeTab === 'reports'
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Báo cáo phản ánh
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
                            activeTab === 'users'
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Hoạt động người dùng
                    </button>
                </div>
            </div>

            {activeTab === 'reports' ? (
                <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">Tổng lượt truy cập</div>
                                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                                        {statisticsData.summary.totalUsers.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                                    <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">Người dùng hoạt động</div>
                                    <div className="text-xl md:text-2xl font-bold text-green-600">
                                        {statisticsData.summary.activeUsers.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">Tính năng phổ biến</div>
                                    <div className="text-xl md:text-2xl font-bold text-purple-600">
                                        {statisticsData.summary.totalReports}
                                    </div>
                                </div>
                                <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">TG phiên trung bình</div>
                                    <div className="text-xl md:text-2xl font-bold text-orange-600">
                                        {statisticsData.summary.avgResponseTime}
                                    </div>
                                </div>
                                <div className="bg-orange-100 p-2 md:p-3 rounded-lg">
                                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo lĩnh vực</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={statisticsData.reportsByCategory}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="percentage"
                                    >
                                        {statisticsData.reportsByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {statisticsData.reportsByCategory.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs md:text-sm">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-gray-700">{item.category}: {item.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo trạng thái</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={statisticsData.reportsByStatus}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Xu hướng phản ánh theo tháng</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={statisticsData.feedbackTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#3B82F6" 
                                    strokeWidth={2}
                                    dot={{ fill: '#3B82F6', r: 4 }}
                                    name="Số phản ánh"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Top 5 vấn đề thường gặp</h3>
                        <div className="space-y-3 md:space-y-4">
                            {statisticsData.topIssues.map((issue, index) => {
                                const maxCount = Math.max(...statisticsData.topIssues.map(i => i.count));
                                const percentage = (issue.count / maxCount) * 100;
                                return (
                                    <div key={index} className="flex items-center gap-3 md:gap-4">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs md:text-sm font-semibold text-blue-600">{index + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1 gap-2">
                                                <span className="text-xs md:text-sm text-gray-700 truncate">{issue.title}</span>
                                                <span className="text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">{issue.count} lượt</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">Tổng lượt truy cập</div>
                                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                                        {statisticsData.summary.totalUsers.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                                    <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">Người dùng hoạt động</div>
                                    <div className="text-xl md:text-2xl font-bold text-green-600">
                                        {statisticsData.summary.activeUsers.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">Tính năng phổ biến</div>
                                    <div className="text-xl md:text-2xl font-bold text-purple-600">
                                        {statisticsData.summary.totalReports}
                                    </div>
                                </div>
                                <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-1">TG phiên trung bình</div>
                                    <div className="text-xl md:text-2xl font-bold text-orange-600">
                                        {statisticsData.summary.avgResponseTime}
                                    </div>
                                </div>
                                <div className="bg-orange-100 p-2 md:p-3 rounded-lg">
                                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Hoạt động người dùng theo ngày</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statisticsData.userActivityByDay}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Người dùng" />
                                <Bar dataKey="sessions" fill="#10B981" radius={[4, 4, 0, 0]} name="Phiên truy cập" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Tỷ lệ phản ánh</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1 md:mb-2">
                                        <span className="text-xs md:text-sm text-gray-700">Phản ánh có danh tính</span>
                                        <span className="text-xs md:text-sm font-semibold text-gray-900">
                                            {statisticsData.feedbackStats.withIdentity}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                                        <div
                                            className="bg-blue-500 h-2 md:h-3 rounded-full"
                                            style={{ width: `${statisticsData.feedbackStats.withIdentity}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1 md:mb-2">
                                        <span className="text-xs md:text-sm text-gray-700">Phản ánh ẩn danh</span>
                                        <span className="text-xs md:text-sm font-semibold text-gray-900">
                                            {statisticsData.feedbackStats.anonymous}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                                        <div
                                            className="bg-gray-600 h-2 md:h-3 rounded-full"
                                            style={{ width: `${statisticsData.feedbackStats.anonymous}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Thiết bị truy cập</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1 md:mb-2">
                                        <span className="text-xs md:text-sm text-gray-700">Di động (Mobile)</span>
                                        <span className="text-xs md:text-sm font-semibold text-gray-900">
                                            {statisticsData.deviceStats.mobile}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                                        <div
                                            className="bg-blue-500 h-2 md:h-3 rounded-full"
                                            style={{ width: `${statisticsData.deviceStats.mobile}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1 md:mb-2">
                                        <span className="text-xs md:text-sm text-gray-700">Máy tính (Desktop)</span>
                                        <span className="text-xs md:text-sm font-semibold text-gray-900">
                                            {statisticsData.deviceStats.desktop}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                                        <div
                                            className="bg-green-500 h-2 md:h-3 rounded-full"
                                            style={{ width: `${statisticsData.deviceStats.desktop}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
