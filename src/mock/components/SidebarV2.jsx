// ============================================================
// SIDEBAR V2 — Menu cho admin portal của prototype
// ============================================================
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Clock, MapPin, FolderOpen, Building2, Users, Settings, ChevronLeft, Map } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'complaints', label: 'Quản lý phản ánh', icon: MessageSquare, path: '/admin/complaints' },
  { id: 'extensions', label: 'Quản lý gia hạn', icon: Clock, path: '/admin/extensions' },
  { id: 'digital-map', label: 'Bản đồ số', icon: Map, path: '/admin/digital-map' },
  { id: 'neighborhood-dashboard', label: 'Dashboard khu phố', icon: MapPin, path: '/dashboard/neighborhood' },
  { id: 'large-screen', label: 'Màn hình lớn', icon: LayoutDashboard, path: '/dashboard/large-screen' },
  { type: 'divider' },
  { id: 'categories', label: 'Loại phản ánh', icon: FolderOpen, path: '/placeholder', disabled: true },
  { id: 'neighborhoods', label: 'Khu phố', icon: Building2, path: '/placeholder', disabled: true },
  { id: 'departments', label: 'Đơn vị xử lý', icon: Building2, path: '/placeholder', disabled: true },
  { id: 'users', label: 'Người dùng', icon: Users, path: '/placeholder', disabled: true },
  { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/placeholder', disabled: true },
];

export default function SidebarV2({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen overflow-y-auto transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`border-b border-gray-200 bg-white transition-all duration-300 ${collapsed ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-0">SOS TNP</h3>
              <p className="text-xs text-gray-500">Prototype v2</p>
            </div>
          )}
          <button onClick={onToggle} className="hidden md:block p-2 rounded-lg hover:bg-gray-100 transition-colors" title={collapsed ? 'Mở rộng' : 'Thu gọn'}>
            <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <nav className={`py-4 transition-all duration-300 ${collapsed ? 'px-2' : 'px-3'}`}>
        <ul className="space-y-1">
          {MENU_ITEMS.map((item) => {
            if (item.type === 'divider') return <li key="div" className="border-t border-gray-200 my-2" />;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;

            return (
              <li key={item.id}>
                {item.disabled ? (
                  <div className={`flex items-center text-sm rounded-lg transition-all duration-200 cursor-not-allowed opacity-50 bg-gray-50 text-gray-400 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`} title={`${item.label} (placeholder)`}>
                    <Icon className={`w-5 h-5 flex-shrink-0 text-gray-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="font-medium flex-1">{item.label}</span>}
                  </div>
                ) : (
                  <Link to={item.path} className={`flex items-center text-sm rounded-lg transition-all duration-200 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} title={collapsed ? item.label : ''}>
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'} ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="font-medium flex-1">{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`border-t border-gray-200 p-3 ${collapsed ? 'text-center' : ''}`}>
        <p className="text-xs text-gray-400">Mock v2.0 — {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
}
