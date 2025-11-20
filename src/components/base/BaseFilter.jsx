import React, { useState, useEffect } from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export default function BaseFilter({
    fields = [],
    onFilter,
    onReset,
    initialFilters = {},
    showAdvancedFilters = false,
    searchPlaceholder = 'Tìm kiếm...',
    showSearchButton = true,
    autoApply = false
}) {
    const [filters, setFilters] = useState(initialFilters);
    const [showFilters, setShowFilters] = useState(showAdvancedFilters);

    useEffect(() => {
        setFilters(initialFilters);
    }, [JSON.stringify(initialFilters)]);

    const searchField = fields.find(f => f.isSearch || f.type === 'search');
    const advancedFields = fields.filter(f => !f.isSearch && f.type !== 'search');

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        if (autoApply) {
            onFilter?.(newFilters);
        }
    };

    const handleApplyFilters = () => {
        onFilter?.(filters);
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        onReset?.();
    };

    const hasActiveFilters = () => {
        return Object.entries(filters).some(([key, value]) => {
            if (initialFilters[key] === undefined) return !!value;
            return value !== initialFilters[key] && value !== '' && value !== false;
        });
    };

    const activeFilterCount = () => {
        return Object.entries(filters).filter(([key, value]) => {
            if (initialFilters[key] === undefined) return !!value;
            return value !== initialFilters[key] && value !== '' && value !== false;
        }).length;
    };

    const renderField = (field) => {
        const { name, label, type, options, placeholder, className } = field;

        switch (type) {
            case 'select':
                return (
                    <div key={name} className={className || ''}>
                        {label && (
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {label}
                            </label>
                        )}
                        <select
                            value={filters[name]?.toString() || ''}
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

            case 'text':
            case 'search':
                return (
                    <div key={name} className={className || ''}>
                        {label && (
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {label}
                            </label>
                        )}
                        <input
                            type="text"
                            value={filters[name] || ''}
                            onChange={(e) => handleFilterChange(name, e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={name} className={className || ''}>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters[name] || false}
                                onChange={(e) => handleFilterChange(name, e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                        </label>
                    </div>
                );

            case 'number':
                return (
                    <div key={name} className={className || ''}>
                        {label && (
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {label}
                            </label>
                        )}
                        <input
                            type="number"
                            value={filters[name] || ''}
                            onChange={(e) => handleFilterChange(name, Number(e.target.value))}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
            <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                    {searchField && (
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={filters[searchField.name] || ''}
                                onChange={(e) => handleFilterChange(searchField.name, e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                                placeholder={searchField.placeholder || searchPlaceholder}
                                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {filters[searchField.name] && (
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters, [searchField.name]: '' };
                                        setFilters(newFilters);
                                        onFilter?.(newFilters);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {advancedFields.length > 0 && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${showFilters || hasActiveFilters()
                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Bộ lọc
                            {/* {hasActiveFilters() && (
                                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                    {activeFilterCount()}
                                </span>
                            )} */}
                        </button>
                    )}

                    {showSearchButton && (
                        <button
                            onClick={handleApplyFilters}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Tìm kiếm
                        </button>
                    )}

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

                {showFilters && advancedFields.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className={`grid gap-4 ${advancedFields.length === 1 ? 'grid-cols-1' :
                                advancedFields.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                                    'grid-cols-1 md:grid-cols-3'
                            }`}>
                            {advancedFields.map(renderField)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
