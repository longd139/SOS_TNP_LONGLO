import React from 'react';
import { ChevronDown } from 'lucide-react';
import ExportButtons from './ExportButtons';

export default function DomainFilter({ selectedDomain, onDomainChange }) {
    const domains = [
        { value: 'all', label: 'Tất cả lĩnh vực' },
        { value: 'infrastructure', label: 'Cơ sở hạ tầng' },
        { value: 'environment', label: 'Môi trường' },
        { value: 'education', label: 'Giáo dục' },
        { value: 'healthcare', label: 'Y tế' },
        { value: 'transport', label: 'Giao thông' },
        { value: 'security', label: 'An ninh trật tự' },
        { value: 'social', label: 'Xã hội' },
        { value: 'economy', label: 'Kinh tế' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <select
                        value={selectedDomain}
                        onChange={(e) => onDomainChange(e.target.value)}
                        className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-base text-gray-700 appearance-none cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-48"
                    >
                        {domains.map((domain) => (
                            <option key={domain.value} value={domain.value}>
                                {domain.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                <ExportButtons dateRange={{selectedDomain}} reportType="overview" />
            </div>
        </div>
    );
}