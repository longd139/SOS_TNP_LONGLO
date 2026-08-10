import React, { useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';

const CustomDonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-900/90 text-white px-2.5 py-1.5 rounded-lg shadow-md border border-slate-700/40 text-[11px] leading-tight">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: data.color }} />
                    <span>{data.name}:</span>
                    <span className="text-emerald-400 font-bold ml-0.5">{data.value.toLocaleString('vi-VN')} lượt ({data.percentage})</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function AppDownloadCharts({ timeRange = '30d' }) {
    const [activeIndex, setActiveIndex] = useState(null);

    // Mock Trend Data based on time range
    const trendData = [
        { date: 'Thg 01', android: 1200, ios: 850, total: 2050 },
        { date: 'Thg 02', android: 1450, ios: 980, total: 2430 },
        { date: 'Thg 03', android: 1900, ios: 1250, total: 3150 },
        { date: 'Thg 04', android: 2400, ios: 1600, total: 4000 },
        { date: 'Thg 05', android: 2950, ios: 1950, total: 4900 },
        { date: 'Thg 06', android: 3500, ios: 2300, total: 5800 },
        { date: 'Thg 07', android: 4200, ios: 2850, total: 7050 }
    ];

    // Platform share data
    const platformData = [
        { name: 'Google Play (Android)', shortName: 'Google Play', value: 16600, color: '#10B981', percentage: '62.9%' },
        { name: 'App Store (iOS)', shortName: 'App Store', value: 9780, color: '#3B82F6', percentage: '37.1%' }
    ];

    const totalDownloads = platformData.reduce((acc, item) => acc + item.value, 0);

    // Usage metrics (Feature usage frequency on SOS app)
    const featureUsageData = [
        { feature: 'Gửi phản ánh SOS', count: 18450, color: '#EF4444' },
        { feature: 'Tra cứu Thủ tục', count: 14200, color: '#3B82F6' },
        { feature: 'Xem Bản đồ sự cố', count: 11900, color: '#10B981' },
        { feature: 'Xem Tin tức & Cảnh báo', count: 9800, color: '#F59E0B' },
        { feature: 'Lịch tiếp dân', count: 4300, color: '#6B7280' }
    ];

    return (
        <div className="space-y-6">
            {/* Top Charts Row: Download Trend & Platform Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Download Trend Chart (2 Cols on LG) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">Tăng trưởng lượt tải App SOS theo thời gian</h3>
                                <p className="text-xs text-gray-500">Phân tích theo hệ điều hành phát hành chính thức</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium">
                            <span className="flex items-center gap-1 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Android</span>
                            <span className="flex items-center gap-1 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> iOS</span>
                        </div>
                    </div>

                    <div className="h-72 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAndroid" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorIos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '11px', padding: '6px 10px' }}
                                    formatter={(val, name) => [
                                        `${val.toLocaleString()} lượt`, 
                                        name === 'android' ? 'Google Play' : 'App Store'
                                    ]}
                                />
                                <Area type="monotone" dataKey="android" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAndroid)" />
                                <Area type="monotone" dataKey="ios" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIos)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Platform Donut Chart (1 Col on LG) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <PieIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">Tỷ trọng Nền tảng phát hành</h3>
                                    <p className="text-xs text-gray-500">Thống kê theo kênh tiếp cận</p>
                                </div>
                            </div>
                            {activeIndex !== null && (
                                <button 
                                    onClick={() => setActiveIndex(null)}
                                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                                >
                                    Xem tất cả
                                </button>
                            )}
                        </div>

                        {/* Interactive Donut Chart with Center Display */}
                        <div className="h-52 w-full relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={platformData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={52}
                                        outerRadius={76}
                                        paddingAngle={4}
                                        dataKey="value"
                                        onClick={(_, index) => setActiveIndex(activeIndex === index ? null : index)}
                                    >
                                        {platformData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color} 
                                                className="cursor-pointer transition-all duration-200 hover:opacity-85 outline-none"
                                                stroke={activeIndex === index ? '#ffffff' : 'none'}
                                                strokeWidth={activeIndex === index ? 3 : 0}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomDonutTooltip />} wrapperStyle={{ zIndex: 9999, pointerEvents: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                                <span className="text-lg font-bold text-gray-900 tracking-tight">
                                    {activeIndex !== null ? platformData[activeIndex].value.toLocaleString('vi-VN') : totalDownloads.toLocaleString('vi-VN')}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                                    {activeIndex !== null ? platformData[activeIndex].shortName : 'Tổng lượt tải'}
                                </span>
                                {activeIndex !== null && (
                                    <span className="text-[10px] font-bold text-emerald-600">
                                        {platformData[activeIndex].percentage}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Platform Legend Items */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                        {platformData.map((item, idx) => {
                            const isSelected = activeIndex === idx;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => setActiveIndex(isSelected ? null : idx)}
                                    className={`flex items-center justify-between text-xs p-2 rounded-xl cursor-pointer transition-all ${
                                        isSelected ? 'bg-blue-50/80 border border-blue-200/80 shadow-xs' : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                                        <span className={`font-medium ${isSelected ? 'text-blue-900 font-bold' : 'text-gray-700'}`}>{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{item.value.toLocaleString('vi-VN')} <span className="text-gray-400 font-normal">({item.percentage})</span></span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Bottom Chart: Feature Usage Frequency */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <BarChart2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Chỉ số sử dụng cơ bản theo tính năng chính trên App SOS</h3>
                            <p className="text-xs text-gray-500">Tương tác người dùng sau khi cài đặt ứng dụng</p>
                        </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                        Dữ liệu từ Analytics Server
                    </span>
                </div>

                <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featureUsageData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <YAxis dataKey="feature" type="category" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                            <Tooltip formatter={(value) => [`${value.toLocaleString()} lượt tương tác`, 'Tần suất sử dụng']} />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                                {featureUsageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
