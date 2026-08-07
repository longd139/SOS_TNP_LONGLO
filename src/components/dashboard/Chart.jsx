import React from 'react';
import CustomLineChart from './LineChart';
import CustomBarChart from './BarChart';

export default function Chart({ type = 'line', data, title, className = '', lines, yAxisDomain, noCard, ...props }) {
    if (type === 'line') {
        return <CustomLineChart data={data} title={title} lines={lines} yAxisDomain={yAxisDomain} noCard={noCard} {...props} />;
    }

    if (type === 'bar') {
        return <CustomBarChart data={data} title={title} {...props} />;
    }

    return null;
}
