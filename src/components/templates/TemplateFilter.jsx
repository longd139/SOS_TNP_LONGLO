import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { selectShowRemoved } from "../../features/templates/templatesSelectors";

export default function TemplateFilter({
  filters = {},
  pagination = {},
  onFilterChange,
  onSearch,
  onReset,
  onToggleRemoved,
  onPageSizeChange,
  onSearchWithFilters,
}) {
  const showRemoved = useSelector(selectShowRemoved);

  const initialFilters = useMemo(() => ({
    searchKeyword: filters.searchKeyword || "",
    showRemoved: showRemoved,
    pageSize: pagination.pageSize || 10,
  }), [filters.searchKeyword, showRemoved, pagination.pageSize]);

  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    if (localFilters.searchKeyword !== filters.searchKeyword) {
      onFilterChange?.("searchKeyword", localFilters.searchKeyword);
    }

    if (localFilters.showRemoved !== showRemoved) {
      onToggleRemoved?.(localFilters.showRemoved);
    }

    if (onSearchWithFilters) {
      onSearchWithFilters({
        searchKeyword: localFilters.searchKeyword,
        showRemoved: localFilters.showRemoved,
        pageSize: Number(localFilters.pageSize),
      });
    } else {
      if (localFilters.pageSize !== pagination.pageSize) {
        onPageSizeChange?.(Number(localFilters.pageSize));
      }
      onSearch?.();
    }
  };

  const handleResetFilters = () => {
    setLocalFilters(initialFilters);
    onReset?.();
  };

  // Kiểm tra active filters - loại trừ showRemoved và pageSize
  const hasActiveFilters = () => {
    return Object.entries(localFilters).some(([key, value]) => {
      if (key === 'showRemoved' || key === 'pageSize') return false;
      
      if (initialFilters[key] === undefined) return !!value;
      return value !== initialFilters[key] && value !== '' && value !== false;
    });
  };

  const filterFields = [
    {
      name: "showRemoved",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: false, label: "Đang hoạt động" },
        { value: true, label: "Không hoạt động" },
      ],
    },
    {
      name: "pageSize",
      label: "Số bản ghi",
      type: "select",
      options: [
        { value: 5, label: "5 bản ghi" },
        { value: 10, label: "10 bản ghi" },
        { value: 20, label: "20 bản ghi" },
        { value: 50, label: "50 bản ghi" },
      ],
    },
  ];

  const renderField = (field) => {
    const { name, label, type, options } = field;

    if (type === 'select') {
      return (
        <div key={name}>
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
          )}
          <select
            value={localFilters[name]?.toString() || ''}
            onChange={(e) => {
              let value = e.target.value;
              if (value === 'true') value = true;
              else if (value === 'false') value = false;
              else if (value !== '' && !isNaN(value)) value = Number(value);
              handleFilterChange(name, value);
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={localFilters.searchKeyword || ''}
              onChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
              placeholder="Nhập từ khóa tìm kiếm biểu mẫu..."
              className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {localFilters.searchKeyword && (
              <button
                onClick={() => {
                  const newFilters = { ...localFilters, searchKeyword: '' };
                  setLocalFilters(newFilters);
                  handleApplyFilters();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${showFilters || hasActiveFilters()
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Filter className="w-4 h-4" />
            Bộ lọc
          </button>

          <button
            onClick={handleApplyFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </button>

          {hasActiveFilters() && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {filterFields.map(renderField)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
