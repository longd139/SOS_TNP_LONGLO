import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function StatisticsByCategory({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Thống kê theo lĩnh vực (Top 5)
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu để hiển thị
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">
          Thống kê theo lĩnh vực (Top 5)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-base font-bold text-gray-700">
                Lĩnh vực
              </th>
              <th className="text-center py-3 px-2 text-base font-bold text-gray-700">
                Tổng phản ánh
              </th>
              <th className="text-center py-3 px-2 text-base font-bold text-gray-700">
                Đã xử lý
              </th>
              <th className="text-center py-3 px-2 text-base font-bold text-gray-700">
                Chưa xử lý
              </th>
              <th className="text-center py-3 px-2 text-base font-bold text-gray-700">
                Thời gian xử lý TB (ngày)
              </th>
              <th className="text-center py-3 px-2 text-base font-bold text-gray-700">
                Tỷ lệ
              </th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, index) => (
              <tr
                key={item.category}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
              >
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {item.category}
                </td>
                <td className="py-3 px-2 text-sm text-center font-medium text-gray-900">
                  {item.totalReports.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-sm text-center font-medium text-green-600">
                  {item.resolved.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-sm text-center font-medium text-red-600">
                  {item.unresolved.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-sm text-center text-gray-700">
                  {item.averageProcessingTime}
                </td>
                <td className="py-3 px-2 text-sm text-center font-medium text-gray-900">
                  {item.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}