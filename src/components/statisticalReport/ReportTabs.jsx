import React from 'react';
import { MessageSquare, Newspaper, FileText } from 'lucide-react';

export default function ReportTabs({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'reports',
      label: 'Phản ánh',
      icon: MessageSquare
    },
    {
      id: 'news',
      label: 'Tin tức',
      icon: FileText
    },
    {
      id: 'procedures',
      label: 'Thủ tục hành chính',
      icon: FileText
    }
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm whitespace-nowrap transition-all duration-200 flex-1 justify-center ${isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
