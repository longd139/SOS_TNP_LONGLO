import React from 'react';
import FieldReportChart from './FieldReportChart';
import StatusReportChart from './StatusReportChart';
import TrendChart from './TrendChart';
import TopIssuesSection from './TopIssuesSection';

export default function ReportsTab({ dateRange }) {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <FieldReportChart dateRange={dateRange} />
        <StatusReportChart dateRange={dateRange} />
      </div>

      <TrendChart />

      <TopIssuesSection dateRange={dateRange} />
    </div>
  );
}
