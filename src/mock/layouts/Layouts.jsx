// ============================================================
// LAYOUTS — AdminLayoutV2 và CitizenLayout
// ============================================================
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderV2 from '../components/HeaderV2';
import SidebarV2 from '../components/SidebarV2';

export function AdminLayoutV2() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth < 768) setCollapsed(true); };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {mobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 md:z-auto transition-transform duration-300 ease-in-out`}>
        <SidebarV2 collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <HeaderV2 onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} isMobileMenuOpen={mobileMenuOpen} />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="pt-2 pb-3 px-3 md:pt-3 md:pb-4 md:px-4"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}

export function CitizenLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8V5l8-3 8 3v5.2C20 17.5 12 22 12 22z"/></svg>
            </div>
            <span className="font-bold text-gray-900">SOS Tăng Nhơn Phú</span>
          </div>
          <HeaderV2 onMobileMenuToggle={() => {}} isMobileMenuOpen={false} />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6"><Outlet /></main>
    </div>
  );
}
