import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
// import { useStatisticalReport } from '../../hooks/useStatisticalReport';
import { statusReportData } from '../../mockData';

export default function StatusReportChart({ dateRange }) {
  // Comment API usage, use mockData instead
  // const { statusReport, loading, loadStatusReport } = useStatisticalReport();

  // useEffect(() => {
  //   const params = {};
  //   if (dateRange.from) params.from = dateRange.from;
  //   if (dateRange.to) params.to = dateRange.to;

  //   loadStatusReport(params).catch(err => {
  //     console.error('Failed to load status report:', err);
  //   });
  // }, [dateRange.from, dateRange.to, loadStatusReport]);

  const chartData = statusReportData;

  // Remove loading and empty state checks for mockData
  // if (loading) {
  //   return (
  //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
  //       <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo trạng thái</h3>
  //       <div className="flex items-center justify-center h-[250px]">
  //         <div className="text-gray-500">Đang tải dữ liệu...</div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!chartData.length) {
  //   return (
  //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
  //       <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo trạng thái</h3>
  //       <div className="flex items-center justify-center h-[250px]">
  //         <div className="text-gray-500">Không có dữ liệu</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Phân Bố Theo Trạng Thái</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">Tổng quan số lượng phản ánh theo từng trạng thái</p>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={{ stroke: '#000000', strokeWidth: 1 }}
            tickLine={{ stroke: '#000000' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={{ stroke: '#000000', strokeWidth: 1 }}
            tickLine={{ stroke: '#000000' }}
            domain={[0, 1000]}
          />
          <Tooltip
            formatter={(value) => [value, 'Số lượng']}
            labelStyle={{ color: '#374151', fontWeight: '500' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
            maxBarSize={120}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
