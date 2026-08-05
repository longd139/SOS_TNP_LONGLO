// ============================================================
// HEADER V2 — Có role switcher để demo nhanh các vai trò
// ============================================================
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Bell, Search, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMock } from '../MockContext';

const ROLES = [
  { role: 'CITIZEN', label: '👤 Người dân' },
  { role: 'RECEPTION_OFFICER', label: '📋 Cán bộ tiếp nhận' },
  { role: 'PROCESSING_OFFICER', label: '🔧 Cán bộ xử lý' },
  { role: 'APPROVER', label: '✅ Lãnh đạo', home: '/dashboard' },
  { role: 'ADMIN', label: '⚙️ Quản trị viên', home: '/dashboard' },
];

export default function HeaderV2({ onMobileMenuToggle, isMobileMenuOpen }) {
  const navigate = useNavigate();
  const { currentUser, roleLabel, switchRole, getFilteredComplaints, setFilters, filters } = useMock();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications_v2');
    const defaultNotifications = [
      {
        id: 'mock_1',
        title: 'Yêu cầu duyệt tài liệu mới',
        message: 'Cán bộ Nguyễn Văn B đã tải lên tài liệu "Lịch sử Đình Tăng Nhơn Phú" đang chờ duyệt.',
        time: '10:30',
        read: false,
        role: 'LEADER'
      },
      {
        id: 'mock_2',
        title: 'Tài liệu đã được duyệt',
        message: 'Tài liệu "Nghị định 104/2022/NĐ-CP" đã được Lãnh đạo phê duyệt.',
        time: '09:15',
        read: true,
        role: 'PROCESSING_OFFICER'
      }
    ];
    return saved ? JSON.parse(saved) : defaultNotifications;
  });
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleNotifChange = () => {
      const saved = localStorage.getItem('notifications_v2');
      if (saved) setNotifications(JSON.parse(saved));
    };
    window.addEventListener('notifications_changed', handleNotifChange);
    return () => window.removeEventListener('notifications_changed', handleNotifChange);
  }, []);

  const isUserLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentUser?.role);
  const isUserOfficer = ['PROCESSING_OFFICER', 'RECEPTION_OFFICER'].includes(currentUser?.role);
  
  const displayNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (isUserLeader) return n.role === 'LEADER';
      if (isUserOfficer) return n.role === 'PROCESSING_OFFICER';
      return n.role === 'CITIZEN';
    });
  }, [notifications, isUserLeader, isUserOfficer]);

  const unreadCount = useMemo(() => {
    return displayNotifications.filter(n => !n.read).length;
  }, [displayNotifications]);

  const markAllAsRead = () => {
    const updated = notifications.map(n => {
      const match = (isUserLeader && n.role === 'LEADER') || (isUserOfficer && n.role === 'PROCESSING_OFFICER');
      return match ? { ...n, read: true } : n;
    });
    localStorage.setItem('notifications_v2', JSON.stringify(updated));
    setNotifications(updated);
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('notifications_v2', JSON.stringify(updated));
    setNotifications(updated);
  };

  const clearAllNotifications = () => {
    const updated = notifications.filter(n => {
      const match = (isUserLeader && n.role === 'LEADER') || (isUserOfficer && n.role === 'PROCESSING_OFFICER');
      return !match;
    });
    localStorage.setItem('notifications_v2', JSON.stringify(updated));
    setNotifications(updated);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMobileMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900">SOS TNP — Prototype</h1>
              <p className="text-xs text-gray-500">UBND Phường Tăng Nhơn Phú</p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh phản ánh..."
              value={filters.search || ''}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <span className="text-base">{ROLES.find(r => r.role === (currentUser?.role))?.label.split(' ')[0] || '👤'}</span>
              <span className="hidden sm:inline font-medium">{roleLabel}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showRoleSwitcher && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleSwitcher(false)} />
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                  <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b">Chuyển vai trò demo</div>
                  {ROLES.map(r => (
                    <button
                      key={r.role}
                      onClick={() => { switchRole(r.role); navigate(r.home); setShowRoleSwitcher(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${currentUser?.role === r.role ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                    >
                      <span>{r.label}</span>
                      {currentUser?.role === r.role && <span className="ml-auto text-blue-600">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-1 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-gray-800 text-sm">Thông báo của bạn</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                    {displayNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-400 text-xs">
                        Không có thông báo nào dành cho bạn.
                      </div>
                    ) : (
                      displayNotifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => { markAsRead(n.id); setShowNotifications(false); }}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-2.5 ${!n.read ? 'bg-blue-50/20' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-blue-600' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 mb-0.5 truncate">{n.title}</p>
                            <p className="text-[11px] text-gray-500 leading-normal mb-1">{n.message}</p>
                            <span className="text-[10px] text-gray-400 font-mono">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {displayNotifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50">
                      <button 
                        onClick={() => { clearAllNotifications(); setShowNotifications(false); }}
                        className="text-xs text-red-500 hover:text-red-600 font-semibold"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:inline text-sm text-gray-700">{currentUser?.fullName || 'Người dùng'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
