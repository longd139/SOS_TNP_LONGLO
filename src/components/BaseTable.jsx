import React from 'react';

const BaseTable = ({
    data = [],
    columns = [],
    loading = false,
    onEdit,
    onDelete,
    onView,
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
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
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
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                                                        title="Xem chi tiết"
                                                    >
                                                        {viewIcon ? viewIcon : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                                                        title="Xóa"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
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
                            onClick={() => onPageChange && onPageChange(pagination.current - 1)}
                            disabled={pagination.current <= 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => onPageChange && onPageChange(pagination.current + 1)}
                            disabled={pagination.current >= pagination.totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Hiển thị{' '}
                                <span className="font-medium">{((pagination.current - 1) * pagination.pageSize) + 1}</span>
                                {' '}đến{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                                </span>
                                {' '}trong{' '}
                                <span className="font-medium">{pagination.total}</span>
                                {' '}kết quả
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => onPageChange && onPageChange(pagination.current - 1)}
                                    disabled={pagination.current <= 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.current <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.current >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    } else {
                                        pageNum = pagination.current - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onPageChange && onPageChange(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === pagination.current
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => onPageChange && onPageChange(pagination.current + 1)}
                                    disabled={pagination.current >= pagination.totalPages}
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