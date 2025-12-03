import React from 'react';

export default function DateRangeFilter({ dateRange, onDateRangeChange, onApplyFilter, errors = {} }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
            className={`w-full px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.from ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.from && (
            <p className="mt-1 text-sm text-red-600">{errors.from}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
            className={`w-full px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.to ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.to && (
            <p className="mt-1 text-sm text-red-600">{errors.to}</p>
          )}
        </div>
        <div className="flex-1 pt-0 sm:pt-7">
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
