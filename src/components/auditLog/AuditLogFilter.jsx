import React, { useState } from 'react';
import { validateAuditLogFilter } from '../../validator/auditLogValidator';

const AuditLogFilter = ({ onFilter, onReset, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {
    search: '',
    from: '',
    to: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleApplyFilter = async () => {
    const { isValid, errors: validationErrors } = await validateAuditLogFilter(filters);

    if (isValid) {
      setErrors({});
      onFilter(filters);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleResetFilter = () => {
    const resetFilters = { search: '', from: '', to: '' };
    setFilters(resetFilters);
    setErrors({});
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên người dùng
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Tìm theo tên..."
            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => handleChange('from', e.target.value)}
            className={`w-full px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.from ? 'border-red-500' : 'border-gray-300'
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
            value={filters.to}
            onChange={(e) => handleChange('to', e.target.value)}
            className={`w-full px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.to ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.to && (
            <p className="mt-1 text-sm text-red-600">{errors.to}</p>
          )}
        </div>
        <div className="flex gap-2 pt-0 sm:pt-7">
          <button
            onClick={handleApplyFilter}
            className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Áp dụng
          </button>
          <button
            onClick={handleResetFilter}
            className="px-6 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogFilter;
