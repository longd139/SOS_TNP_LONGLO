import React from 'react';
import { Users, Activity, FileText, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statisticsData } from '../../mockData';

export default function UserActivityTab() {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-600 text-xs md:text-sm mb-1">Tổng lượt truy cập</div>
              <div className="text-xl md:text-2xl font-bold text-blue-600">
                {statisticsData.summary.totalUsers.toLocaleString()}
              </div>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-600 text-xs md:text-sm mb-1">Người dùng hoạt động</div>
              <div className="text-xl md:text-2xl font-bold text-green-600">
                {statisticsData.summary.activeUsers.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-600 text-xs md:text-sm mb-1">Tính năng phổ biến</div>
              <div className="text-xl md:text-2xl font-bold text-purple-600">
                {statisticsData.summary.totalReports}
              </div>
            </div>
            <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-600 text-xs md:text-sm mb-1">TG phiên trung bình</div>
              <div className="text-xl md:text-2xl font-bold text-orange-600">
                {statisticsData.summary.avgResponseTime}
              </div>
            </div>
            <div className="bg-orange-100 p-2 md:p-3 rounded-lg">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Hoạt động người dùng theo ngày</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statisticsData.userActivityByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Người dùng" />
            <Bar dataKey="sessions" fill="#10B981" radius={[4, 4, 0, 0]} name="Phiên truy cập" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Tỷ lệ phản ánh</h3>
          <div className="space-y-3 md:space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <span className="text-xs md:text-sm text-gray-700">Phản ánh có danh tính</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {statisticsData.feedbackStats.withIdentity}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div
                  className="bg-blue-500 h-2 md:h-3 rounded-full"
                  style={{ width: `${statisticsData.feedbackStats.withIdentity}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <span className="text-xs md:text-sm text-gray-700">Phản ánh ẩn danh</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {statisticsData.feedbackStats.anonymous}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div
                  className="bg-gray-600 h-2 md:h-3 rounded-full"
                  style={{ width: `${statisticsData.feedbackStats.anonymous}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Thiết bị truy cập</h3>
          <div className="space-y-3 md:space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <span className="text-xs md:text-sm text-gray-700">Di động (Mobile)</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {statisticsData.deviceStats.mobile}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div
                  className="bg-blue-500 h-2 md:h-3 rounded-full"
                  style={{ width: `${statisticsData.deviceStats.mobile}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <span className="text-xs md:text-sm text-gray-700">Máy tính (Desktop)</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">
                  {statisticsData.deviceStats.desktop}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div
                  className="bg-green-500 h-2 md:h-3 rounded-full"
                  style={{ width: `${statisticsData.deviceStats.desktop}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
