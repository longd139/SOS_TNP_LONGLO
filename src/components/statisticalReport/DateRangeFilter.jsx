import React, { useEffect } from 'react';

export default function DateRangeFilter({ dateRange, onDateRangeChange, onApplyFilter }) {
  // Set default dates on component mount
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const fromDate = firstDayOfMonth.toISOString().split('T')[0];
      const toDate = today.toISOString().split('T')[0];

      onDateRangeChange({
        from: dateRange.from || fromDate,
        to: dateRange.to || toDate
      });
    }
  }, [dateRange, onDateRangeChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex-1 pt-0 sm:pt-6">
          <button
            onClick={onApplyFilter}
            className="w-full px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
