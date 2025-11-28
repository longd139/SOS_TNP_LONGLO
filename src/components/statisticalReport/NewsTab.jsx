import React, { useState, useEffect } from 'react';
import Chart from '../dashboard/Chart';
import { newsTrendsData, newsDetailsData } from '../../mockData';
import NewsDetailsTable from './NewsDetailsTable';

export default function NewsTab() {
    const [dashboardData, setDashboardData] = useState({
        xu_huong_tin_tuc: newsTrendsData
    });

    useEffect(() => {
        // Use mock data - in real app this would be API data
        setDashboardData({ xu_huong_tin_tuc: newsTrendsData });
    }, []);

    const formattedChartData = dashboardData?.xu_huong_tin_tuc?.map(item => ({
        date: item.date,
        banNhap: item.banNhap,
        luotXem: item.luotXem,
        daXuatBan: item.daXuatBan
    })) || [];

    return (
        <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4">
                <Chart
                    type="line"
                    title="Xu hướng tin tức"
                    data={formattedChartData}
                    lines={[
                        { key: 'banNhap', color: '#FF8C00', name: 'Bản nháp' },
                        { key: 'luotXem', color: '#3B82F6', name: 'Lượt xem' },
                        { key: 'daXuatBan', color: '#10B981', name: 'Đã xuất bản' }
                    ]}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Thống kê tin tức chi tiết
                </h3>
                <NewsDetailsTable data={newsDetailsData} />
            </div>
        </div>
    );
}