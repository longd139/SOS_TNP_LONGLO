import { BarChart3, Calendar, FileText, FolderOpen, LayoutDashboard, MessageSquare, Newspaper, Phone, UserCog } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    {
        id: 'overview',
        label: 'Tổng quan',
        icon: <LayoutDashboard />,
        path: '/dashboard',
        hasSubmenu: false
    },
    {
        id: 'reports',
        label: 'Quản lý phản ánh',
        icon: <MessageSquare />,
        path: '/reports',
        hasSubmenu: false
    },
    {
        id: 'news',
        label: 'Tin tức & Thông báo',
        icon: <Newspaper />,
        path: '/news',
        hasSubmenu: false
    },
    {
        id: 'procedures',
        label: 'Thủ tục hành chính',
        icon: <FileText />,
        path: '/procedures',
        hasSubmenu: false
    },
    {
        id: 'templates',
        label: 'Biểu mẫu',
        icon: <FolderOpen />,
        path: '/templates',
        hasSubmenu: false
    },
    {
        id: 'contact',
        label: 'Thông tin liên hệ',
        icon: <Phone />,
        path: '/contact',
        hasSubmenu: false
    },
    {
        id: 'schedule',
        label: 'Lịch tiếp dân',
        icon: <Calendar />,
        path: '/schedule',
        hasSubmenu: false
    },
    {
        id: 'statistics',
        label: 'Báo cáo & Thống kê',
        icon: <BarChart3 />,
        path: '/statistics',
        hasSubmenu: false
    },
    {
        id: 'accounts',
        label: 'Quản lý tài khoản',
        icon: <UserCog />,
        path: '/accounts',
        hasSubmenu: false
    }
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-full bg-white border-r border-gray-200 h-full overflow-y-auto sidebar-scroll">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Phường Tăng Nhơn Phú
                </h3>
                <p className="text-sm text-gray-500">Cổng quản trị</p>
            </div>

            <nav className="px-4 py-6">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.id}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                    {item.hasSubmenu && (
                                        <span className="ml-auto text-gray-400">▶</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <p className="text-xs text-gray-400 text-center">v1.0.0</p>
            </div>
        </aside>
    );
}
