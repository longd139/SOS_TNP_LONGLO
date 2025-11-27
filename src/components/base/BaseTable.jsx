import React from 'react';
import { Eye, Pencil, Trash2, ToggleLeft } from 'lucide-react';

const BaseTable = ({
    data = [],
    columns = [],
    loading = false,
    onEdit,
    onDelete,
    onView,
    onUpdateStatus,
    canDelete,
    canEdit,
    canView,
    canUpdateStatus,
    viewIcon = null,
    pagination = null,
    onPageChange,
    showActions = true,
    actionColumnWidth = "100px",
    emptyMessage = "Không có dữ liệu",
    className = ""
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-8 text-center">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="mt-2 text-gray-500">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${column.width ? `w-${column.width}` : ''
                                        }`}
                                    style={column.width ? { width: column.width, maxWidth: column.width } : {}}
                                >
                                    {column.title}
                                </th>
                            ))}
                            {showActions && (
                                <th
                                    className="px-6 text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                    style={{ width: actionColumnWidth, maxWidth: actionColumnWidth }}
                                >
                                    Thao tác
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (showActions ? 1 : 0)}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIndex) => (
                                <tr key={item.id || rowIndex} className="hover:bg-gray-50">
                                    {columns.map((column, colIndex) => {
                                        const tdClassList = [
                                            'px-6',
                                            'py-4',
                                            'whitespace-nowrap',
                                            'text-sm',
                                            'text-gray-900'
                                        ];
                                        if (column.className) tdClassList.push(column.className);

                                        return (
                                            <td
                                                key={column.key || colIndex}
                                                className={tdClassList.join(' ')}
                                                style={column.width ? { width: column.width, maxWidth: column.width } : {}}
                                            >
                                                {column.render ? column.render(item[column.dataIndex], item, rowIndex) : item[column.dataIndex]}
                                            </td>
                                        );
                                    })}
                                    {showActions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {onView && (!canView || canView(item)) && (
                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                                                        title="Xem chi tiết"
                                                    >
                                                        {viewIcon ? viewIcon : <Eye className="w-6 h-6" />}
                                                    </button>
                                                )}
                                                {onEdit && (!canEdit || canEdit(item)) && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Pencil className="w-6 h-6" />
                                                    </button>
                                                )}
                                                {onUpdateStatus && (!canUpdateStatus || canUpdateStatus(item)) && (
                                                    <button
                                                        onClick={() => onUpdateStatus(item)}
                                                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-100"
                                                        title="Cập nhật trạng thái"
                                                    >
                                                        <ToggleLeft className="w-6 h-6" />
                                                    </button>
                                                )}
                                                {onDelete && (!canDelete || canDelete(item)) && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-6 h-6" />
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => {
                                const handleChange = pagination.onChange || onPageChange;
                                handleChange && handleChange((pagination.current || pagination.currentPage) - 1);
                            }}
                            disabled={(pagination.current || pagination.currentPage) <= 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => {
                                const handleChange = pagination.onChange || onPageChange;
                                handleChange && handleChange((pagination.current || pagination.currentPage) + 1);
                            }}
                            disabled={(pagination.current || pagination.currentPage) >= pagination.totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                {(() => {
                                    const currentPage = pagination.current || pagination.currentPage || 1;
                                    const pageSize = pagination.pageSize || 10;
                                    const totalItems = pagination.total || pagination.totalItems || 0;

                                    if (totalItems === 0) {
                                        return <>Không có kết quả nào</>;
                                    }

                                    const startItem = ((currentPage - 1) * pageSize) + 1;
                                    const endItem = Math.min(currentPage * pageSize, totalItems);

                                    return (
                                        <>
                                            Hiển thị{' '}
                                            <span className="font-medium">{startItem}</span>
                                            {' '}đến{' '}
                                            <span className="font-medium">{endItem}</span>
                                            {' '}trong{' '}
                                            <span className="font-medium">{totalItems}</span>
                                            {' '}kết quả
                                        </>
                                    );
                                })()}
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => {
                                        const handleChange = pagination.onChange || onPageChange;
                                        handleChange && handleChange((pagination.current || pagination.currentPage) - 1);
                                    }}
                                    disabled={(pagination.current || pagination.currentPage) <= 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const currentPage = pagination.current || pagination.currentPage;
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    const handleChange = pagination.onChange || onPageChange;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handleChange && handleChange(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => {
                                        const handleChange = pagination.onChange || onPageChange;
                                        handleChange && handleChange((pagination.current || pagination.currentPage) + 1);
                                    }}
                                    disabled={(pagination.current || pagination.currentPage) >= pagination.totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseTable;