import React, { useState, useRef, useEffect } from 'react';
import { 
    Download, Smartphone, Users, Star, RefreshCw, 
    Filter, FileSpreadsheet, Server, ShieldCheck, CheckCircle2, 
    ArrowUpRight, Layers, Activity, ChevronDown, FileText
} from 'lucide-react';
import AppDownloadCharts from '../../components/statisticalReport/AppDownloadCharts';
import AppDataSourceModal from '../../components/statisticalReport/AppDataSourceModal';

export default function AppDownloadStatistics() {
    const [timeRange, setTimeRange] = useState('30d');
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const exportDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
                setIsExportDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Summary KPIs
    const kpiMetrics = [
        {
            title: 'Tổng số lượt tải App SOS',
            value: '26,380',
            unit: 'lượt',
            change: '+14.2%',
            isPositive: true,
            icon: Download,
            iconStyle: 'bg-blue-50 text-blue-600 border-blue-100',
            badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            subtitle: 'Google Play & App Store'
        },
        {
            title: 'Người dùng hàng tháng',
            value: '21,400',
            unit: 'người dùng',
            change: '+8.6%',
            isPositive: true,
            icon: Users,
            iconStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            subtitle: '72.5% tổng lượt tải'
        },
        {
            title: 'Người dùng hàng ngày',
            value: '4,850',
            unit: 'người/ngày',
            change: '+6.1%',
            isPositive: true,
            icon: Activity,
            iconStyle: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            subtitle: 'Tương tác bình quân'
        },
        {
            title: 'Đánh giá ứng dụng trung bình',
            value: '4.8',
            unit: '★ / 5.0',
            change: '2,480+ lượt',
            isPositive: true,
            icon: Star,
            iconStyle: 'bg-amber-50 text-amber-600 border-amber-100',
            badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
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

                    {/* Export File Dropdown */}
                    <div className="relative inline-block text-left" ref={exportDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                            disabled={exportLoading}
                            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            <span>{exportLoading ? 'Đang xuất...' : 'Xuất file'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isExportDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100 animate-fade-in">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsExportDropdownOpen(false);
                                            handleExportReport('excel');
                                        }}
                                        className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold text-gray-900">Xuất file Excel (.xlsx)</div>
                                            <div className="text-[11px] text-gray-500">Chi tiết lượt tải</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsExportDropdownOpen(false);
                                            handleExportReport('pdf');
                                        }}
                                        className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold text-gray-900">Xuất file PDF (.pdf)</div>
                                            <div className="text-[11px] text-gray-500">Báo cáo tổng hợp</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                            <option value="all">Tất cả Nền tảng (Google Play, App Store)</option>
                            <option value="android">Google Play Store (Android)</option>
                            <option value="ios">Apple App Store (iOS)</option>
                        </select>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                        <span>Cập nhật mới nhất: <strong>Hôm nay, {new Date().toLocaleDateString('vi-VN')}</strong></span>
                    </div>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpiMetrics.map((kpi, idx) => {
                    const IconComponent = kpi.icon;
                    return (
                        <div 
                            key={idx} 
                            className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                        >
                            {/* Header: Title & Icon */}
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-snug line-clamp-2 min-h-[30px]">
                                        {kpi.title}
                                    </span>
                                    <div className={`p-2 rounded-lg border flex-shrink-0 ${kpi.iconStyle}`}>
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Number & Unit */}
                                <div className="flex items-baseline gap-1.5 mb-2">
                                    <span className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
                                        {kpi.value}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">
                                        {kpi.unit}
                                    </span>
                                </div>
                            </div>

                            {/* Footer: Pill Badge & Subtitle cleanly separated */}
                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${kpi.badgeStyle}`}>
                                    {kpi.isPositive && <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />}
                                    {kpi.change}
                                </span>
                                <span className="text-slate-400 text-[10px] font-medium truncate max-w-[120px]" title={kpi.subtitle}>
                                    {kpi.subtitle}
                                </span>
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
                                <th className="py-3.5 px-4 text-right">Người dùng hoạt động</th>
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
                                            row.id === 'google-play' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {row.id === 'google-play' ? 'GP' : 'iOS'}
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
