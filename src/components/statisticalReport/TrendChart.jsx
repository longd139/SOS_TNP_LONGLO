import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statisticsData } from '../../mockData';

export default function TrendChart() {
  const chartData = statisticsData.feedbackTrend;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Xu hướng phản ánh theo tháng</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            name="Số phản ánh"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
