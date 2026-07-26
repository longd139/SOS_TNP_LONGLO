// ============================================================
// HEADER V2 — Có role switcher để demo nhanh các vai trò
// ============================================================
import React, { useState } from 'react';
import { Menu, Bell, Search, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { useMock } from '../MockContext';

const ROLES = [
  { role: 'CITIZEN', label: '👤 Người dân' },
  { role: 'RECEPTION_OFFICER', label: '📋 Cán bộ tiếp nhận' },
  { role: 'PROCESSING_OFFICER', label: '🔧 Cán bộ xử lý' },
  { role: 'APPROVER', label: '✅ Lãnh đạo' },
  { role: 'ADMIN', label: '⚙️ Quản trị viên' },
];

export default function HeaderV2({ onMobileMenuToggle, isMobileMenuOpen }) {
  const { currentUser, roleLabel, switchRole, getFilteredComplaints, setFilters, filters } = useMock();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
                      onClick={() => { switchRole(r.role); setShowRoleSwitcher(false); }}
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

          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

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
