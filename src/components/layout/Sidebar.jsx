import { BarChart3, Calendar, FileText, FolderOpen, LayoutDashboard, MessageSquare, Newspaper, Phone, UserCog, Menu, ChevronLeft, X, ClipboardList, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ROUTE_PATH from '../../constants/routes';
import { isPathDisabled } from '../../utils/routeRedirectUtils';

const menuItems = [
    {
        id: 'overview',
        label: 'Tổng quan',
        icon: LayoutDashboard,
        path: ROUTE_PATH.DASHBOARD,
        hasSubmenu: false
    },
    {
        id: 'reports',
        label: 'Quản lý phản ánh',
        icon: MessageSquare,
        path: ROUTE_PATH.REPORT,
        hasSubmenu: false
    },
    {
        id: 'report-areas',
        label: 'Quản lý lĩnh vực phản ánh',
        icon: ClipboardList,
        path: ROUTE_PATH.REPORT_AREAS,
        hasSubmenu: false
    },
    {
        id: 'news',
        label: 'Tin tức & Thông báo',
        icon: Newspaper,
        path: ROUTE_PATH.NEWS,
        hasSubmenu: false
    },
    {
        id: 'areas',
        label: 'Quản lý lĩnh vực thủ tục',
        icon: FileText,
        path: ROUTE_PATH.AREAS,
        hasSubmenu: false
    },
    {
        id: 'procedures',
        label: 'Thủ tục hành chính',
        icon: FileText,
        path: ROUTE_PATH.PROCEDURES,
        hasSubmenu: false
    },
    {
        id: 'templates',
        label: 'Biểu mẫu',
        icon: FolderOpen,
        path: ROUTE_PATH.TEMPLATES,
        hasSubmenu: false
    },
    {
        id: 'government',
        label: 'Quản lý cơ sở dịch vụ công',
        icon: FolderOpen,
        path: ROUTE_PATH.GOVERNMENT,
        hasSubmenu: false
    },
    {
        id: 'contact',
        label: 'Ủy ban Phường',
        icon: Phone,
        path: ROUTE_PATH.CONTACT,
        hasSubmenu: false
    },
    {
        id: 'schedule',
        label: 'Lịch tiếp dân',
        icon: Calendar,
        path: ROUTE_PATH.SCHEDULES,
        hasSubmenu: false
    },
    {
        id: 'statistics',
        label: 'Báo cáo & Thống kê',
        icon: BarChart3,
        path: ROUTE_PATH.STATISTICS,
        hasSubmenu: false
    },
    {
        id: 'accounts',
        label: 'Quản lý tài khoản',
        icon: UserCog,
        path: ROUTE_PATH.ACCOUNTS,
        hasSubmenu: false
    },
    {
        id: 'permissions',
        label: 'Quản lý quyền truy cập',
        icon: Shield,
        path: ROUTE_PATH.PERMISSIONS,
        hasSubmenu: false
    }
];

export default function Sidebar({ collapsed, onToggle, onMobileClose }) {
    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth < 768 && onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <aside 
            className={`
                bg-white border-r border-gray-200 h-screen overflow-y-auto sidebar-scroll
                transition-all duration-300 ease-in-out flex-shrink-0
                ${collapsed ? 'w-20' : 'w-64'}
            `}
        >
            <div className={`border-b border-gray-200 bg-white transition-all duration-300 ${collapsed ? 'p-3' : 'p-4'}`}>
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Phường Tăng Nhơn Phú
                            </h3>
                        </div>
                    )}

                    <button
                        onClick={onToggle}
                        className={`
                            hidden md:block
                            p-2 rounded-lg hover:bg-gray-100 transition-colors
                            ${collapsed ? 'mx-auto' : 'ml-auto'}
                        `}
                        title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                    >
                        {collapsed ? (
                            <Menu className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    <button
                        onClick={onMobileClose}
                        className={`
                            md:hidden
                            p-2 rounded-lg hover:bg-gray-100 transition-colors
                            ${collapsed ? 'mx-auto' : 'ml-auto'}
                        `}
                        title="Đóng menu"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <nav className={`py-4 transition-all duration-300 ${collapsed ? 'px-2' : 'px-3'}`}>
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        const isDisabled = isPathDisabled(item.path);
                        
                        return (
                            <li key={item.id}>
                                {isDisabled ? (
                                    <div
                                        className={`
                                            flex items-center text-sm rounded-lg transition-all duration-200 cursor-not-allowed
                                            ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                                            opacity-50 bg-gray-50 text-gray-400
                                            hover:opacity-60
                                        `}
                                        title={`${item.label} (Chức năng chưa khả dụng)`}
                                    >
                                        <Icon 
                                            className={`
                                                w-5 h-5 flex-shrink-0 text-gray-400
                                                ${collapsed ? '' : 'mr-3'}
                                            `}
                                        />
                                        
                                        {!collapsed && (
                                            <>
                                                <span className="font-medium flex-1">{item.label}</span>
                                                {item.hasSubmenu && (
                                                    <span className="ml-auto text-gray-300">▶</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`
                                            flex items-center text-sm rounded-lg transition-all duration-200
                                            ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }
                                        `}
                                        title={collapsed ? item.label : ''}
                                    >
                                        <Icon 
                                            className={`
                                                w-5 h-5 flex-shrink-0
                                                ${isActive ? 'text-blue-600' : 'text-gray-500'}
                                                ${collapsed ? '' : 'mr-3'}
                                            `}
                                        />
                                        
                                        {!collapsed && (
                                            <>
                                                <span className="font-medium flex-1">{item.label}</span>
                                                {item.hasSubmenu && (
                                                    <span className="ml-auto text-gray-400">▶</span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={`border-t border-gray-200 bg-white transition-all duration-300 ${collapsed ? 'p-2' : 'p-3'}`}>
                <p className={`text-xs text-gray-400 text-center ${collapsed ? 'transform rotate-90' : ''}`}>
                    {collapsed ? 'v1' : 'v1.0.0'}
                </p>
            </div>
        </aside>
    );
}

Sidebar.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onMobileClose: PropTypes.func
};
