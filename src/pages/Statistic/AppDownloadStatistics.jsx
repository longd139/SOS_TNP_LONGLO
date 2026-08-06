import React, { useState } from 'react';
import { 
    Download, Smartphone, Users, Star, RefreshCw, 
    Filter, FileSpreadsheet, Server, ShieldCheck, CheckCircle2, 
    ArrowUpRight, Layers, Activity
} from 'lucide-react';
import AppDownloadCharts from '../../components/statisticalReport/AppDownloadCharts';
import AppDataSourceModal from '../../components/statisticalReport/AppDataSourceModal';

export default function AppDownloadStatistics() {
    const [timeRange, setTimeRange] = useState('30d');
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    // Summary KPIs
    const kpiMetrics = [
        {
            title: 'Tổng số lượt tải App SOS',
            value: '29,500',
            unit: 'lượt',
            change: '+14.2%',
            isPositive: true,
            icon: Download,
            color: 'blue',
            subtitle: 'Tích lũy từ tất cả kho ứng dụng'
        },
        {
            title: 'Người dùng hoạt động hàng tháng (MAU)',
            value: '21,400',
            unit: 'người dùng',
            change: '+8.6%',
            isPositive: true,
            icon: Users,
            color: 'emerald',
            subtitle: 'Chiếm 72.5% tổng lượt tải'
        },
        {
            title: 'Người dùng hoạt động hàng ngày (DAU)',
            value: '4,850',
            unit: 'người dùng/ngày',
            change: '+6.1%',
            isPositive: true,
            icon: Activity,
            color: 'indigo',
            subtitle: 'Tương tác bình quân trong ngày'
        },
        {
            title: 'Đánh giá ứng dụng trung bình',
            value: '4.8',
            unit: '★ / 5.0',
            change: '2,480+ đánh giá',
            isPositive: true,
            icon: Star,
            color: 'amber',
            subtitle: 'Google Play & App Store'
        }
    ];

    // Detailed table breakdown by platform
    const platformBreakdown = [
        {
            id: 'google-play',
            platform: 'Google Play Store',
            os: 'Android 8.0+',
            newDownloads: '16,600',
            activeUsers: '12,450',
            uninstalls: '420',
            avgRating: '4.8 ★',
            status: 'Đã kết nối API',
            lastSync: '10 phút trước'
        },
        {
            id: 'app-store',
            platform: 'Apple App Store',
            os: 'iOS 13.0+',
            newDownloads: '9,780',
            activeUsers: '7,320',
            uninstalls: '195',
            avgRating: '4.9 ★',
            status: 'Đã kết nối API',
            lastSync: '15 phút trước'
        },
        {
            id: 'apk-direct',
            platform: 'Cổng tải APK / Web Direct',
            os: 'File APK cài trực tiếp',
            newDownloads: '3,120',
            activeUsers: '1,630',
            uninstalls: '85',
            avgRating: 'N/A',
            status: 'Tự động đồng bộ Server',
            lastSync: 'Vừa xong'
        }
    ];

    const showNotification = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleExportReport = (type) => {
        setExportLoading(true);
        setTimeout(() => {
            setExportLoading(false);
            showNotification(`Đã xuất báo cáo Thống kê lượt tải App SOS dạng ${type.toUpperCase()} thành công!`);
        }, 1000);
    };

    return (
        <div className="min-h-screen pb-10">
            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm">{toastMessage}</span>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Nhóm: Thống kê ứng dụng
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Dành cho Lãnh đạo & Admin
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Smartphone className="w-7 h-7 text-blue-600" />
                        Thống kê lượt tải App & Mức độ tiếp cận SOS
                    </h1>
                    <p className="text-sm text-gray-600 mt-0.5">
                        Theo dõi số lượt tải, tỷ trọng các nền tảng phát hành và các chỉ số sử dụng ứng dụng SOS Phường Tăng Nhơn Phú
                    </p>
                </div>

                {/* Top Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={() => setIsDataSourceModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-sm"
                    >
                        <Server className="w-4 h-4 text-blue-600" />
                        Xác nhận Nguồn dữ liệu kho App
                    </button>
                    
                    <button
                        onClick={() => handleExportReport('excel')}
                        disabled={exportLoading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-sm"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        Xuất Excel
                    </button>

                    <button
                        onClick={() => handleExportReport('pdf')}
                        disabled={exportLoading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Xuất Báo cáo PDF
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                            <Filter className="w-4 h-4 text-blue-600" /> Bộ lọc dữ liệu:
                        </div>

                        {/* Time range selector */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setTimeRange('7d')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    timeRange === '7d' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                7 ngày
                            </button>
                            <button
                                onClick={() => setTimeRange('30d')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    timeRange === '30d' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                30 ngày
                            </button>
                            <button
                                onClick={() => setTimeRange('90d')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    timeRange === '90d' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                90 ngày
                            </button>
                            <button
                                onClick={() => setTimeRange('all')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                    timeRange === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Toàn thời gian
                            </button>
                        </div>

                        {/* Platform Filter Dropdown */}
                        <select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            className="text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 font-medium"
                        >
                            <option value="all">Tất cả Nền tảng (Google Play, App Store, APK)</option>
                            <option value="android">Google Play Store (Android)</option>
                            <option value="ios">Apple App Store (iOS)</option>
                            <option value="apk">File APK / Tải trực tiếp Web</option>
                        </select>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                        <span>Cập nhật mới nhất: <strong>Hôm nay, {new Date().toLocaleDateString('vi-VN')}</strong></span>
                    </div>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {kpiMetrics.map((kpi, idx) => {
                    const IconComponent = kpi.icon;
                    return (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{kpi.title}</span>
                                <div className={`p-2 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl font-extrabold text-gray-900">{kpi.value}</span>
                                <span className="text-xs text-gray-500 font-medium">{kpi.unit}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-100">
                                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    {kpi.change}
                                </span>
                                <span className="text-gray-400 text-[11px]">{kpi.subtitle}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Visualizer */}
            <div className="mb-6">
                <AppDownloadCharts timeRange={timeRange} />
            </div>

            {/* Detailed Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-600" />
                            Chi tiết lượt tải & Trạng thái tích hợp theo Nền tảng kho ứng dụng
                        </h3>
                        <p className="text-xs text-gray-500">Dữ liệu đối soát thực tế từ các nguồn API đã kết nối</p>
                    </div>
                    <button 
                        onClick={() => setIsDataSourceModalOpen(true)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                        Quản lý nguồn API <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="py-3.5 px-5">Kho Ứng Dụng / Nền Tảng</th>
                                <th className="py-3.5 px-4">Yêu cầu HĐH</th>
                                <th className="py-3.5 px-4 text-right">Lượt tải mới</th>
                                <th className="py-3.5 px-4 text-right">Active Users (MAU)</th>
                                <th className="py-3.5 px-4 text-right">Lượt gỡ cài đặt</th>
                                <th className="py-3.5 px-4 text-center">Đánh giá trung bình</th>
                                <th className="py-3.5 px-4">Nguồn Dữ Liệu</th>
                                <th className="py-3.5 px-5 text-center">Tình Trạng API</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {platformBreakdown.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-4 px-5 font-bold text-gray-900 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                            row.id === 'google-play' ? 'bg-green-100 text-green-700' :
                                            row.id === 'app-store' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                            {row.id === 'google-play' ? 'GP' : row.id === 'app-store' ? 'iOS' : 'APK'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{row.platform}</div>
                                            <div className="text-[11px] text-gray-400 font-normal">Cập nhật {row.lastSync}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{row.os}</td>
                                    <td className="py-4 px-4 font-bold text-gray-900 text-right">{row.newDownloads}</td>
                                    <td className="py-4 px-4 font-bold text-emerald-600 text-right">{row.activeUsers}</td>
                                    <td className="py-4 px-4 text-red-500 text-right font-medium">{row.uninstalls}</td>
                                    <td className="py-4 px-4 text-center font-bold text-amber-600">{row.avgRating}</td>
                                    <td className="py-4 px-4 font-medium text-gray-700">{row.status}</td>
                                    <td className="py-4 px-5 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            Đang hoạt động
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Configuration */}
            <AppDataSourceModal 
                isOpen={isDataSourceModalOpen}
                onClose={() => setIsDataSourceModalOpen(false)}
            />
        </div>
    );
}
