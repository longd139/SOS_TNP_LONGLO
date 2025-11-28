import React, { useState } from 'react';
import DateRangeFilter from '../../components/statisticalReport/DateRangeFilter';
import ExportButtons from '../../components/statisticalReport/ExportButtons';
import ReportTabs from '../../components/statisticalReport/ReportTabs';
import ReportsTab from '../../components/statisticalReport/ReportsTab';
import NewsTab from '../../components/statisticalReport/NewsTab';
import ProceduresTab from '../../components/statisticalReport/ProceduresTab';

export default function Statistic() {
    const [activeTab, setActiveTab] = useState('reports');
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    });

    const handleApplyFilter = () => {
        // Handle filter application logic here
        console.log('Applying filter with date range:', dateRange);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'reports':
                return <ReportsTab dateRange={dateRange} />;
            case 'news':
                return <NewsTab />;
            case 'procedures':
                return <ProceduresTab />;
            default:
                return <ReportsTab dateRange={dateRange} />;
        }
    };

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

                <ExportButtons dateRange={dateRange} reportType={activeTab} />
            </div>

            <div id="statistic-content">
                <DateRangeFilter
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    onApplyFilter={handleApplyFilter}
                />

                <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {renderTabContent()}
            </div>
        </div>
    );
}
