import React, { useState } from 'react';
import DateRangeFilter from '../../components/statisticalReport/DateRangeFilter';
import ExportButtons from '../../components/statisticalReport/ExportButtons';
import ReportTabs from '../../components/statisticalReport/ReportTabs';
import ReportsTab from '../../components/statisticalReport/ReportsTab';
import UserActivityTab from '../../components/statisticalReport/UserActivityTab';

export default function Statistic() {
    const [activeTab, setActiveTab] = useState('reports');
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    });
    const [reportType, setReportType] = useState('overview');

    return (
        <div className="min-h-screen">
            <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                        Báo cáo & Thống kê
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Phân tích dữ liệu và xuất báo cáo
                    </p>
                </div>

                <ExportButtons dateRange={dateRange} reportType={reportType} />
            </div>

            <div id="statistic-content">
                <DateRangeFilter
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    reportType={reportType}
                    onReportTypeChange={setReportType}
                />

                <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />


                {activeTab === 'reports' ? (
                    <ReportsTab dateRange={dateRange} />
                ) : (
                    <UserActivityTab />
                )}
            </div>
        </div>
    );
}
