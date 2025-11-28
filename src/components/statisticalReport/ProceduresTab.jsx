import React from 'react';
import { ClipboardList, FileText } from 'lucide-react';
import { proceduresStatsData } from '../../mockData';
import ProceduresPieChart from './ProceduresPieChart';
import ProceduresBarChart from './ProceduresBarChart';

const iconMap = {
  FileText: ClipboardList,
  FileCheck: FileText,
  FileX: FileText
};

const colorMap = {
  blue: {
    bg: 'bg-white',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600'
  },
  green: {
    bg: 'bg-white',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600'
  },
  orange: {
    bg: 'bg-white',
    text: 'text-orange-600',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600'
  }
};

export default function ProceduresTab() {
  return (
    <div className="space-y-3 md:space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proceduresStatsData.map((stat, index) => {
          const IconComponent = iconMap[stat.icon];
          const colors = colorMap[stat.color];

          return (
            <div key={index} className={`${colors.bg} rounded-lg p-4 shadow-sm border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-xl font-bold ${colors.text}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${colors.iconBg} ${colors.iconText} rounded-lg p-2.5 ml-4`}>
                  <IconComponent size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section - Same structure as ReportsTab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <ProceduresPieChart />
        <ProceduresBarChart />
      </div>
    </div>
  );
}