import React from 'react';

export default function ReportTabs({ activeTab, onTabChange }) {
  return (
    <div className="mb-3 md:mb-4">
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => onTabChange('reports')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'reports'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Báo cáo phản ánh
        </button>
        <button
          onClick={() => onTabChange('users')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'users'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Hoạt động người dùng
        </button>
      </div>
    </div>
  );
}
