import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const CustomLineChart = ({ data, title, lines, yAxisDomain }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{`Ngày: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value?.toLocaleString?.() || entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const defaultLines = [
        { key: 'tongPhanAnh', color: '#3B82F6', name: 'Tổng phản ánh' },
        { key: 'daGiaiQuyet', color: '#22C55E', name: 'Đã giải quyết' }
    ];

    const chartLines = lines || defaultLines;
    const domain = yAxisDomain || [0, 'auto'];

    return (
        <div className="bg-white shadow-sm rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">{title}</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                            vertical={true}
                            horizontal={true}
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                            tickLine={{ stroke: '#000000' }}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dy={10}
                        />
                        <YAxis
                            domain={domain}
                            axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                            tickLine={{ stroke: '#000000' }}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                        />
                        {chartLines.map((line, index) => (
                            <Line
                                key={index}
                                type="monotone"
                                dataKey={line.key}
                                name={line.name}
                                stroke={line.color}
                                strokeWidth={3}
                                dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: line.color, strokeWidth: 2, fill: '#ffffff' }}
                                connectNulls={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CustomLineChart;