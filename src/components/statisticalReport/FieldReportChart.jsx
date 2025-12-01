import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

export default function FieldReportChart({ dateRange, total = 0, cateData = [] }) {
  const chartData = cateData.map((item, index) => ({
    name: item.category,
    value: item.count,
    percentage: item.percentage,
    color: item.color
  }));

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Biểu Đồ Tròn Phản Ánh
          </h3>
        </div>
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">Không có dữ liệu</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">
          Biểu Đồ Tròn Phản Ánh
        </h3>
      </div>

      <div className="text-sm mb-4">
        Tổng số phản ánh: {total.toLocaleString()}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value} phản ánh (${props.payload.percentage}%)`, props.payload.name]} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-gray-700 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
