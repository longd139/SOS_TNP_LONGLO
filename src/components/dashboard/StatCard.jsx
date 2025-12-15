import React from 'react';

const StatCard = ({
    title,
    value,
    icon,
    color = 'blue',
    trend = null,
    className = ''
}) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-600',
            text: 'text-blue-600'
        },
        orange: {
            bg: 'bg-orange-50',
            icon: 'text-orange-600',
            text: 'text-orange-600'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-600',
            text: 'text-green-600'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            text: 'text-red-600'
        },
        gray: {
            bg: 'bg-gray-50',
            icon: 'text-gray-600',
            text: 'text-gray-600'
        },
        violet: {
            bg: 'bg-violet-50',
            icon: 'text-[#4F39F6]',
            text: 'text-[#4F39F6]'
        }
    };

    const currentColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl ${currentColor.text}`}>{value}</p>
                    {trend && (
                        <p className="text-sm text-gray-500 mt-1">{trend}</p>
                    )}
                </div>

                <div className={`w-10 h-10 ${currentColor.bg} rounded-lg flex items-center justify-center`}>
                    <div className={`${currentColor.icon}`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;