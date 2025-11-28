import React, { useState, useEffect } from 'react';
import FieldReportChart from './FieldReportChart';
import StatusReportChart from './StatusReportChart';
import DomainFilter from './DomainFilter';
import Chart from '../dashboard/Chart';
import ReportDetails from './ReportDetails';
import StatisticsByCategory from './StatisticsByCategory';
import CategoryDetails from './CategoryDetails';
import { useReports } from '../../hooks/useReports';
import { mockTrendsData } from '../../mockData';

export default function ReportsTab({ dateRange }) {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const { statistic, loadStatisticReport } = useReports();
  const [dashboardData, setDashboardData] = useState({
    xu_huong_phan_anh: mockTrendsData // Use mock data as default
  });

  useEffect(() => {
    loadStatisticReport().catch(error => {
      console.error('Error loading statistic report:', error);
    });
  }, [loadStatisticReport]);

  useEffect(() => {
    if (statistic && statistic.xu_huong_phan_anh) {
      setDashboardData(statistic);
    } else {
      // Use mock data if API data is not available
      setDashboardData({ xu_huong_phan_anh: mockTrendsData });
    }
  }, [statistic]);

  const formattedChartData = {
    trends: dashboardData?.xu_huong_phan_anh?.map(item => {
      const date = new Date(item?.date);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      return {
        date: formattedDate,
        tongPhanAnh: item?.tong_phan_anh,
        daGiaiQuyet: item?.da_giai_quyet
      };
    }) || []
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <DomainFilter
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
      />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4">
        <Chart
          type="line"
          title="Xu hướng phản ánh"
          data={formattedChartData?.trends}
        />
      </div>

      <ReportDetails />

      <StatisticsByCategory />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <FieldReportChart dateRange={dateRange} />
        <CategoryDetails />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4">
        <StatusReportChart dateRange={dateRange} />
      </div>
    </div>
  );
}
