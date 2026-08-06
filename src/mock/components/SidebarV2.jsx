// ============================================================
// SIDEBAR V2 — Menu hiển thị theo role (không ẩn, chỉ disable)
// ============================================================
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Clock, FolderOpen, Building2, Users, Settings, ChevronLeft, FileText, Map, ChevronDown, ChevronRight, Smartphone, Star } from 'lucide-react';
import { useMock } from '../MockContext';

const ALL_MENUS = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, path: '/dashboard', roles: ['APPROVER','LEADER','ADMIN'] },
  { id: 'complaints', label: 'Quản lý phản ánh', icon: MessageSquare, path: '/admin/complaints', roles: ['RECEPTION_OFFICER','PROCESSING_OFFICER','APPROVER','LEADER','ADMIN'] },
  { id: 'extensions', label: 'Quản lý gia hạn', icon: Clock, path: '/admin/extensions', roles: ['PROCESSING_OFFICER','APPROVER','LEADER','ADMIN'] },
  { 
    id: 'documents', 
    label: 'Quản lý Tài liệu', 
    icon: FileText, 
    roles: ['PROCESSING_OFFICER','APPROVER','LEADER','ADMIN'],
    submenu: [
      { id: 'doc-history', label: 'Văn hóa lịch sử', path: '/admin/documents/history' },
      { id: 'doc-legal', label: 'Quy phạm pháp luật', path: '/admin/documents/legal' }
    ]
  },
  { id: 'large-screen', label: 'Màn hình lớn', icon: LayoutDashboard, path: '/dashboard/large-screen', roles: ['APPROVER','LEADER','ADMIN'] },
  { id: 'digital-map', label: 'Bản đồ số', icon: Map, path: '/admin/digital-map', roles: ['APPROVER','LEADER','ADMIN'] },
  { id: 'app-statistics', label: 'Thống kê lượt tải App', icon: Smartphone, path: '/admin/app-statistics', roles: ['APPROVER','LEADER','ADMIN'] },
  { id: 'satisfaction', label: 'Đánh giá hài lòng', icon: Star, path: '/admin/satisfaction', roles: ['APPROVER','LEADER','ADMIN'] },
  { id: 'submit', label: 'Gửi phản ánh', icon: FileText, path: '/submit', roles: ['CITIZEN','RECEPTION_OFFICER','ADMIN'] },
  { id: 'my-complaints', label: 'Phản ánh của tôi', icon: MessageSquare, path: '/my-complaints', roles: ['CITIZEN'] },
  { type: 'divider' },
  { id: 'categories', label: 'Loại phản ánh', icon: FolderOpen, path: '/placeholder', disabled: true },
  { id: 'neighborhoods', label: 'Khu phố', icon: Building2, path: '/placeholder', disabled: true },
  { id: 'departments', label: 'Đơn vị xử lý', icon: Building2, path: '/placeholder', disabled: true },
  { id: 'users', label: 'Người dùng', icon: Users, path: '/placeholder', disabled: true },
  { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/placeholder', disabled: true },
];

export default function SidebarV2({ collapsed, onToggle }) {
  const location = useLocation();
  const { currentUser } = useMock();
  const role = currentUser?.role || 'CITIZEN';
  const [openMenus, setOpenMenus] = useState({ documents: true });

  const toggleSubmenu = (id) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
          {ALL_MENUS.map((item) => {
            if (item.type === 'divider') return <li key="div" className="border-t border-gray-200 my-2" />;
            const Icon = item.icon;
            const hasAccess = !item.roles || item.roles.includes(role);
            const isLocked = !item.disabled && !hasAccess;

            if (item.submenu) {
              const isSubOpen = openMenus[item.id];
              const isActiveSub = item.submenu.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));
              
              return (
                <li key={item.id} className="mb-1">
                  {item.disabled || isLocked ? (
                    <div className={`flex items-center text-sm rounded-lg transition-all duration-200 cursor-not-allowed opacity-50 bg-gray-50 text-gray-400 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`}
                      title={isLocked ? `${item.label} (yêu cầu quyền truy cập)` : `${item.label} (đang phát triển)`}>
                      <Icon className={`w-5 h-5 flex-shrink-0 text-gray-400 ${collapsed ? '' : 'mr-3'}`} />
                      {!collapsed && <><span className="font-medium flex-1">{item.label}</span><span className="text-[10px]">🔒</span></>}
                    </div>
                  ) : (
                    <>
                      <div onClick={() => toggleSubmenu(item.id)} className={`flex items-center text-sm rounded-lg transition-all duration-200 cursor-pointer ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} ${isActiveSub ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} title={collapsed ? item.label : ''}>
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActiveSub ? 'text-blue-600' : 'text-gray-500'} ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && (
                          <>
                            <span className="font-medium flex-1">{item.label}</span>
                            {isSubOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </>
                        )}
                      </div>
                      {!collapsed && isSubOpen && (
                        <ul className="mt-1 ml-9 space-y-1">
                          {item.submenu.map(sub => {
                            if (sub.submenu) {
                              const isLevel3Open = openMenus[sub.id];
                              const isLevel3Active = sub.submenu.some(sub3 => location.pathname === sub3.path.split('?')[0]);
                              return (
                                <li key={sub.id} className="mb-1">
                                  <div onClick={() => toggleSubmenu(sub.id)} className={`flex items-center text-sm rounded-lg cursor-pointer px-3 py-2 transition-all duration-200 ${isLevel3Active ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <span className="flex-1">{sub.label}</span>
                                    {isLevel3Open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                  </div>
                                  {isLevel3Open && (
                                    <ul className="mt-1 ml-2 space-y-1 border-l border-gray-200 pl-2">
                                      {sub.submenu.map(sub3 => {
                                        const isSub3Active = location.pathname + location.search === sub3.path;
                                        return (
                                          <li key={sub3.id}>
                                            <Link to={sub3.path} className={`block text-xs rounded-lg px-3 py-2 transition-all duration-200 ${isSub3Active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}>
                                              {sub3.label}
                                            </Link>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  )}
                                </li>
                              )
                            }
                            const isSubActive = location.pathname === sub.path;
                            return (
                              <li key={sub.id}>
                                <Link to={sub.path} className={`block text-sm rounded-lg px-3 py-2 transition-all duration-200 ${isSubActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}>
                                  {sub.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              );
            }

            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <li key={item.id}>
                {item.disabled || isLocked ? (
                  <div className={`flex items-center text-sm rounded-lg transition-all duration-200 cursor-not-allowed opacity-50 bg-gray-50 text-gray-400 ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`}
                    title={isLocked ? `${item.label} (yêu cầu quyền truy cập)` : `${item.label} (đang phát triển)`}>
                    <Icon className={`w-5 h-5 flex-shrink-0 text-gray-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <><span className="font-medium flex-1">{item.label}</span><span className="text-[10px]">🔒</span></>}
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
        <p className="text-xs text-gray-400">{role === 'CITIZEN' ? 'Người dân' : role === 'RECEPTION_OFFICER' ? 'Cán bộ tiếp nhận' : role === 'PROCESSING_OFFICER' ? 'Cán bộ xử lý' : role === 'APPROVER' || role === 'LEADER' ? 'Lãnh đạo' : 'Admin'} — v2.0</p>
      </div>
    </aside>
  );
}
