import React from 'react';
import CustomLineChart from './LineChart';
import CustomBarChart from './BarChart';

export default function Chart({ type = 'line', data, title, className = '' }) {
    if (type === 'line') {
        return <CustomLineChart data={data} title={title} />;
    }

    if (type === 'bar') {
        return <CustomBarChart data={data} title={title} />;
    }

    return null;
}
