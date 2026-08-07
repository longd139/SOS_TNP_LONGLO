import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';

export default function AppDownloadCharts({ timeRange = '30d' }) {
    // Mock Trend Data based on time range
    const trendData = [
        { date: 'Thg 01', android: 1200, ios: 850, apk: 320, total: 2370 },
        { date: 'Thg 02', android: 1450, ios: 980, apk: 410, total: 2840 },
        { date: 'Thg 03', android: 1900, ios: 1250, apk: 550, total: 3700 },
        { date: 'Thg 04', android: 2400, ios: 1600, apk: 680, total: 4680 },
        { date: 'Thg 05', android: 2950, ios: 1950, apk: 790, total: 5690 },
        { date: 'Thg 06', android: 3500, ios: 2300, apk: 840, total: 6640 },
        { date: 'Thg 07', android: 4200, ios: 2850, apk: 920, total: 7970 }
    ];

    // Platform share data
    const platformData = [
        { name: 'Google Play (Android)', value: 16600, color: '#10B981', percentage: '56.3%' },
        { name: 'App Store (iOS)', value: 9780, color: '#3B82F6', percentage: '33.2%' },
        { name: 'Tải trực tiếp APK / Web', value: 3120, color: '#8B5CF6', percentage: '10.5%' }
    ];

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
                                <p className="text-xs text-gray-500">Phân tích theo hệ điều hành & nguồn tải chính thức</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium">
                            <span className="flex items-center gap-1 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Android</span>
                            <span className="flex items-center gap-1 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> iOS</span>
                            <span className="flex items-center gap-1 text-purple-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> File APK</span>
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
                                    <linearGradient id="colorApk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', color: '#fff', border: 'none' }}
                                    formatter={(val, name) => [
                                        `${val.toLocaleString()} lượt tải`, 
                                        name === 'android' ? 'Google Play (Android)' : name === 'ios' ? 'App Store (iOS)' : 'Direct APK'
                                    ]}
                                />
                                <Area type="monotone" dataKey="android" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAndroid)" />
                                <Area type="monotone" dataKey="ios" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIos)" />
                                <Area type="monotone" dataKey="apk" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Platform Donut Chart (1 Col on LG) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <PieIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">Tỷ trọng Nền tảng phát hành</h3>
                                <p className="text-xs text-gray-500">Thống kê theo kênh tiếp cận</p>
                            </div>
                        </div>

                        <div className="h-52 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={platformData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {platformData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(val, name, entry) => [`${val.toLocaleString()} lượt (${entry.payload.percentage})`, entry.payload.name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Platform Legend Items */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        {platformData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900">{item.value.toLocaleString()} <span className="text-gray-400 font-normal">({item.percentage})</span></span>
                            </div>
                        ))}
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
