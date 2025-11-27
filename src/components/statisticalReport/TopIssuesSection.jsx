import React, { useEffect } from 'react';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';
import { showToast } from '../../utils/toastNotification';

export default function TopIssuesSection({ dateRange }) {
  const { summaryReport, loading, loadSummaryReport } = useStatisticalReport();

  useEffect(() => {
    const params = {};
    if (dateRange.from) params.from = dateRange.from;
    if (dateRange.to) params.to = dateRange.to;

    loadSummaryReport(params).catch(err => {
        showToast.error(err)
      console.error('Failed to load summary report:', err);
    });
  }, [dateRange.from, dateRange.to, loadSummaryReport]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Top 5 vấn đề thường gặp</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  const topIssues = summaryReport?.top_5_linh_vuc || [];

  if (!topIssues.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Top 5 vấn đề thường gặp</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Không có dữ liệu</div>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...topIssues.map(i => i.so_luong));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Top 5 vấn đề thường gặp</h3>
      <div className="space-y-3 md:space-y-4">
        {topIssues.map((issue, index) => {
          const percentage = (issue.so_luong / maxCount) * 100;
          return (
            <div key={index} className="flex items-center gap-3 md:gap-4">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs md:text-sm font-semibold text-blue-600">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-xs md:text-sm text-gray-700 truncate">{issue.ten_linh_vuc}</span>
                  <span className="text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">{issue.so_luong} lượt</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
