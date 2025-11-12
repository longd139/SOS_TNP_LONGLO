import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const CustomBarChart = ({ data, title }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">{`${label}`}</p>
                    <p className="text-sm text-blue-600">
                        Lượt truy cập: {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const RoundedBar = (props) => {
        const { fill, x, y, width, height } = props;
        const radius = 6;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    rx={radius}
                    ry={radius}
                />
            </g>
        );
    };

    return (
        <div className="bg-white shadow-sm rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">{title}</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                        }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                            vertical={false}
                            horizontal={true}
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dy={10}
                        />
                        <YAxis
                            domain={[0, 2000]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dx={-10}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="visits"
                            fill="#3B82F6"
                            shape={<RoundedBar />}
                            maxBarSize={60}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#3B82F6" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CustomBarChart;