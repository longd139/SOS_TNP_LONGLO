import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function FieldReportChart({ dateRange }) {
  const { fieldReport, loading, loadFieldReport } = useStatisticalReport();

  useEffect(() => {
    const params = {};
    if (dateRange.from) params.from = dateRange.from;
    if (dateRange.to) params.to = dateRange.to;

    loadFieldReport(params).catch(err => {
      console.error('Failed to load field report:', err);
    });
  }, [dateRange.from, dateRange.to, loadFieldReport]);

  const chartData = fieldReport.slice(0, 8).map((item, index) => ({
    name: item.ten_linh_vuc,
    value: item.tong_phan_anh,
    percentage: item.ty_le,
    color: COLORS[index % COLORS.length]
  }));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo lĩnh vực</h3>
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo lĩnh vực</h3>
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">Không có dữ liệu</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo lĩnh vực</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage?.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value} phản ánh (${props.payload.percentage?.toFixed(1)}%)`, props.payload.name]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs md:text-sm">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-gray-700 truncate">{item.name}: {item.percentage?.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
