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
    const [appliedDateRange, setAppliedDateRange] = useState({
        from: '',
        to: ''
    });

    const handleApplyFilter = () => {
        setAppliedDateRange({ ...dateRange });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'reports':
                return <ReportsTab dateRange={appliedDateRange} />;
            case 'news':
                return <NewsTab dateRange={appliedDateRange} />;
            case 'procedures':
                return <ProceduresTab dateRange={appliedDateRange} />;
            default:
                return <ReportsTab dateRange={appliedDateRange} />;
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

                <ExportButtons dateRange={appliedDateRange} reportType={activeTab} />
            </div>

            <div >
                <DateRangeFilter
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    onApplyFilter={handleApplyFilter}
                />

                <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <div id="statistic-content">
                    {renderTabContent()}
                </div>
                
            </div>
        </div>
    );
}
