import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { feedbackList } from '../../mockData';
import BaseTable from '../../components/BaseTable';

export default function ReportList() {
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
        searchTerm: ''
    });

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleView = (item) => {
        console.log('View details:', item);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            render: (value) => (
                <span className="text-sm font-medium text-gray-900">{value}</span>
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '200px',
            render: (value) => (
                <div 
                    className="text-sm text-gray-900 max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value}
                >
                    {value}
                </div>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value, record) => (
                <span
                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                        backgroundColor: record.statusBg,
                        color: record.statusColor
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            title: 'Độ khẩn',
            dataIndex: 'urgency',
            key: 'urgency',
            render: (value, record) => (
                <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                        backgroundColor: record.urgencyBg,
                        color: record.urgencyColor
                    }}
                >
                    {record.urgencyIcon && <AlertTriangle className="w-3 h-3" />}
                    {value}
                </span>
            )
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'submittedDate',
            key: 'submittedDate',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Số ngày mở',
            dataIndex: 'daysOpen',
            key: 'daysOpen',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Thông tin liên hệ',
            dataIndex: 'contact',
            key: 'contact',
            width: '180px',
            render: (value) => {
                const name = value.name || 'Ẩn danh';
                const fullText = value.phone ? `${name}\n${value.phone}` : name;
                return (
                    <div className="text-sm max-w-[180px]" title={fullText}>
                        <div className="text-gray-900 truncate text-ellipsis overflow-hidden whitespace-nowrap">
                            {name}
                        </div>
                        {value.phone && (
                            <div className="text-gray-500 truncate text-ellipsis overflow-hidden whitespace-nowrap">
                                {value.phone}
                            </div>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý phản ánh</h1>
                <p className="text-gray-600 mt-1">Xem và xử lý phản ánh từ người dân</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Bộ lọc</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            <option value="new">Mới</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="resolved">Đã giải quyết</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh mục
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            <option value="environment">Môi trường</option>
                            <option value="infrastructure">Hạ tầng</option>
                            <option value="complaint">Kiến nghị</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Từ khóa
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tiêu đề, ID..."
                                value={filters.searchTerm}
                                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-4 py-3">
                <h3 className="font-semibold text-gray-900">
                    Danh sách phản ánh ({feedbackList.length})
                </h3>
            </div>

            <BaseTable
                data={feedbackList}
                columns={columns}
                onView={handleView}
                showActions={true}
                emptyMessage="Không có phản ánh nào"
            />
        </div>
    );
}
