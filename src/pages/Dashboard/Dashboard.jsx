import React, { useEffect, useState } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { AlertTriangle, CheckCircle, Clock, FileCheck, FileText, MessageSquare, Send, LogIn, Edit, FilePlus, Newspaper, History, BookOpen, Building2, Home, ClipboardList, CalendarCheck, Shield } from 'lucide-react';
import { useReports } from '../../hooks/useReports';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { showToast } from '../../utils/toastNotification';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export default function Dashboard() {
    const { statistic, loadStatisticReport, reports, loadReports } = useReports();
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        tong_hom_nay: 0,
        thong_ke_theo_trang_thai: {
            'Đã giải quyết': 0,
            'Đã gửi': 0,
            'Đang xử lý': 0,
            'Đã tiếp nhận': 0,
            'Đóng': 0
        },
        nhat_ky_hoat_dong: []
    });

    useEffect(() => {
        loadStatisticReport().catch(error => {
            setError(error);
            showToast.error(error || 'Lấy dữ liệu thống kê thất bại!');
        });

        loadReports({
            page: 1,
            size: 5,
            mucDo: 'Khẩn cấp'
        }).catch(error => {
            setError(error);
            showToast.error(error || 'Lấy danh sách phản ánh thất bại!');
        });

    }, [loadStatisticReport, loadReports]);

    useEffect(() => {
        if (statistic) {
            setDashboardData(statistic);
        }
    }, [statistic]);

    const getStatusColor = (status) => {
        const colors = {
            'Chờ xử lý': 'bg-orange-100 text-orange-800',
            'Đang xử lý': 'bg-blue-100 text-blue-800',
            'Đã giải quyết': 'bg-green-100 text-green-800',
            'Đã gửi': 'bg-gray-100 text-gray-800',
            'Đã tiếp nhận': 'bg-violet-100 text-violet-800',
            'Đóng': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // const formattedChartData = {
    //     trends: dashboardData?.xu_huong_phan_anh?.map(item => ({
    //         date: new Date(item?.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    //         tongPhanAnh: item?.tong_phan_anh,
    //         daGiaiQuyet: item?.da_giai_quyet
    //     })) || []
    // };

    const recentReports = (reports || []).map(report => {
        return {
            id: `#${report?.ma_phan_anh}`,
            title: report?.tieu_de,
            category: report?.linh_vuc_phan_anh?.ten || 'Chưa phân loại',
            reporter: report?.ten_nguoi_phan_anh || '',
            phone: report?.sdt_nguoi_phan_anh || '',
            timeAgo: dayjs(report?.thoi_gian_tao).fromNow(),
            status: report?.lich_su_trang_thai[0]?.ten || '',
            isUrgent: 'Khẩn'
        };
    });

    const renderName = (data) => {
        switch (data) {
            case 'phan_anh':
                return 'Phản ánh';
            case 'lich_su_trang_thai':
                return 'Lịch sử trạng thái';
            default:
                return data;
        }
    }

    const renderIcon = (text = "") => {
        const lower = text.toLowerCase();

        if (lower.includes("phan_anh") || lower.includes("phản ánh")) return MessageSquare;
        if (lower.includes("lich_su_trang_thai") || lower.includes("lịch sử trạng thái")) return History;
        if (lower.includes("người dùng")) return LogIn;
        if (lower.includes("chỉnh sửa")) return Edit;
        if (lower.includes("tạo mới")) return FilePlus;
        if (lower.includes("báo cáo")) return Newspaper;
        if (lower.includes("danh mục")) return BookOpen;
        if (lower.includes("mẫu đơn")) return FileText;
        if (lower.includes("uỷ ban")) return Building2;
        if (lower.includes("cơ sở dịch vụ")) return Home;
        if (lower.includes("đăng nhập")) return LogIn;
        if (lower.includes("thủ tục") || lower.includes("thủ tục hành chính")) return ClipboardList;
        if (lower.includes("tin tức") || lower.includes("tin tuc")) return Newspaper;
        if (lower.includes("lịch")) return CalendarCheck;
        if (lower.includes("phân quyền") || lower.includes("phan quyen") || lower.includes("phan_quyen") || lower.includes("vai trò") || lower.includes("vai tro")) return Shield;
        return FileText;
    };


    const iconColors = new Map([
        [MessageSquare, "#3b82f6"],    
        [History, "#10b981"],       
        [LogIn, "#ef4444"],       
        [Edit, "#f97316"],        
        [FilePlus, "#6366f1"],         
        [Newspaper, "#0ea5e9"],    
        [BookOpen, "#8b5cf6"],          
        [FileText, "#6b7280"],          
        [Building2, "#dc2626"],         
        [Home, "#22c55e"], 
        [ClipboardList, "#f59e0b"],     
        [CalendarCheck, "#14b8a6"],     
        [Shield, "#64748b"]             
    ]);

    const getColorByIcon = (icon) => {
        return iconColors.get(icon) || "#6b7280"; 
    };

    const historyReport = (dashboardData.nhat_ky_hoat_dong || []).map(history => {
        return {
            id: history.timestamp,
            name: history.hanh_dong?.split(',').map((item) => renderName(item.trim())).join(', '),
            user: history?.nguoi_dung?.ho_va_ten,
            timeAgo: dayjs(history.timestamp).fromNow(),
            icon: renderIcon(history.hanh_dong),
            iconColor: getColorByIcon(renderIcon(history.hanh_dong))
        }
    });

    return (
        <div className="space-y-3 md:space-y-4 min-h-full">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
                <p className="text-gray-600 mt-1">Thống kê hoạt động hệ thống</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <StatCard
                    title="Tổng phản ánh hôm nay"
                    value={dashboardData?.tong_hom_nay}
                    icon={<MessageSquare />}
                    color="blue"
                />
                <StatCard
                    title="Đã gửi"
                    value={dashboardData?.thong_ke_theo_trang_thai['Đã gửi']}
                    icon={<Send />}
                    color="gray"
                />
                <StatCard
                    title="Đã tiếp nhận"
                    value={dashboardData?.thong_ke_theo_trang_thai['Đã tiếp nhận']}
                    icon={<FileCheck />}
                    color="violet"
                />
                <StatCard
                    title="Đang xử lý"
                    value={dashboardData?.thong_ke_theo_trang_thai['Đang xử lý']}
                    icon={<Clock />}
                    color="orange"
                />
                <StatCard
                    title="Đã giải quyết"
                    value={dashboardData?.thong_ke_theo_trang_thai['Đã giải quyết']}
                    icon={<CheckCircle />}
                    color="green"
                />
                <StatCard
                    title="Đóng"
                    value={dashboardData?.thong_ke_theo_trang_thai['Đóng']}
                    icon={<FileText />}
                    color="gray"
                />
            </div>

            {/* <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4 pb-4">
                <Chart
                    type="line"
                    title="Xu hướng phản ánh"
                    data={formattedChartData?.trends}
                />
            </div> */}

            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
                    Phản ánh khẩn cấp
                </h3>

                {recentReports.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="text-red-500 font-bold">{error || "Không có phản ánh khẩn cấp"}</div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {recentReports.map((report) => (
                            <div key={report?.id} className="p-2 pb-0 md:pb-3">
                                <div className="border border-gray-200 px-2 rounded-lg flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                    <div className="flex-1 min-w-0 p-3">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                            <span className="text-xs text-gray-500">{report?.id}</span>
                                            {report?.isUrgent && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-md">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Khẩn
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="text-sm md:text-base font-medium text-gray-900 mb-1 leading-tight">
                                            {report?.title}
                                        </h4>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-gray-500">
                                            <span className="inline-flex items-center py-1 text-gray-500 rounded-full text-sm">
                                                {report?.category}
                                            </span>
                                            <span className="hidden sm:inline text-gray-400">•</span>
                                            {report?.reporter ? (
                                                <span className="truncate max-w-full sm:max-w-xs">
                                                    {report?.reporter}
                                                    {report?.phone && <span className="hidden md:inline"> - {report?.phone}</span>}
                                                </span>
                                            ) : (
                                                <span className="truncate max-w-full sm:max-w-xs">Ẩn danh</span>
                                            )}
                                            <span className="hidden sm:inline text-gray-400">•</span>
                                            <span className="whitespace-nowrap">{report?.timeAgo}</span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 self-center mr-3">
                                        <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full ${getStatusColor(report?.status)}`}>
                                            {report?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
                    Nhật ký chỉnh sửa
                </h3>

                {historyReport.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="text-gray-500">Không có nhật ký</div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {historyReport.map((log) => {

                            const Icon = log.icon || FileText;

                            return (
                                <div key={log.id} className="p-2 pb-0 md:pb-3">
                                    <div className="border border-gray-200 px-2 rounded-lg flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1 min-w-0 p-3 flex items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <div
                                                    style={{
                                                        backgroundColor: `${log.iconColor}14`,
                                                        border: `1px solid ${log.iconColor}22`,
                                                    }}
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold"
                                                >
                                                    <Icon className="w-5 h-5" style={{ color: log.iconColor }} />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0">
                                                    <h3 className="text-sm md:text-base font-medium text-gray-900 truncate mb-0">
                                                        {log.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs text-gray-500 truncate">{log.user ? log.user : 'Chưa cập nhật'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 self-center mr-3 text-sm text-gray-500 whitespace-nowrap">
                                            {log.timeAgo}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
