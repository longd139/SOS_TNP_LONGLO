import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function CategoryDetails({ data = [], total = 0 }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Chi Tiết Theo Lĩnh Vực
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
          Chi Tiết Theo Lĩnh Vực
        </h3>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Tổng: {total.toLocaleString()} phản ánh
      </div>

      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {item.category}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: item.color,
                    width: `${Math.min(item.percentage, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}