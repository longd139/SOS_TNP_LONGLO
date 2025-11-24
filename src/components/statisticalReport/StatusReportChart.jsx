import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';

export default function StatusReportChart({ dateRange }) {
  const { statusReport, loading, loadStatusReport } = useStatisticalReport();

  useEffect(() => {
    const params = {};
    if (dateRange.from) params.from = dateRange.from;
    if (dateRange.to) params.to = dateRange.to;

    loadStatusReport(params).catch(err => {
      console.error('Failed to load status report:', err);
    });
  }, [dateRange.from, dateRange.to, loadStatusReport]);

  const chartData = statusReport
    .filter(item => item.trang_thai !== 'Tổng cộng')
    .map(item => ({
      status: item.trang_thai,
      count: item.so_luong,
      percentage: item.ty_le
    }))
    .reverse();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo trạng thái</h3>
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo trạng thái</h3>
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">Không có dữ liệu</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Phản ánh theo trạng thái</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="status" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value, name, props) => [`${value} phản ánh (${props.payload.percentage?.toFixed(1)}%)`, 'Số lượng']} />
          <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
