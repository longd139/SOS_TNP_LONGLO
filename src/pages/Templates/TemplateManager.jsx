import React, { useState } from 'react';
import { FileText, Download, Pencil, Trash2, Plus } from 'lucide-react';
import { templatesList } from '../../mockData';
import BaseTable from '../../components/BaseTable';
import { ConfirmModal } from '../../components/BaseModal';

export default function TemplateManager() {
    const [templates, setTemplates] = useState(templatesList);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        template: null
    });

    const handleView = (template) => {
        console.log('View template:', template);
        // Open file in new window or download
    };

    const handleEdit = (template) => {
        console.log('Edit template:', template);
        // Navigate to edit page or open edit modal
    };

    const handleDelete = (template) => {
        setDeleteModal({
            isOpen: true,
            template
        });
    };

    const handleConfirmDelete = () => {
        console.log('Delete template:', deleteModal.template);
        setTemplates(templates.filter(t => t.id !== deleteModal.template.id));
        setDeleteModal({ isOpen: false, template: null });
    };

    const handleDownload = (template) => {
        console.log('Download template:', template);
        // Trigger file download
    };

    const handleCreateTemplate = () => {
        console.log('Create new template');
        // Navigate to create page or open create modal
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '60px',
            render: (value) => (
                <span className="text-sm font-medium text-gray-900">{value}</span>
            )
        },
        {
            title: 'Tên biểu mẫu',
            dataIndex: 'name',
            key: 'name',
            width: '300px',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-900">{value}</span>
                </div>
            )
        },
        {
            title: 'Thủ tục liên quan',
            dataIndex: 'relatedProcedure',
            key: 'relatedProcedure',
            width: '250px',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Kích thước',
            dataIndex: 'fileSize',
            key: 'fileSize',
            width: '100px',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Cập nhật',
            dataIndex: 'uploadedDate',
            key: 'uploadedDate',
            width: '120px',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Lượt tải',
            dataIndex: 'downloads',
            key: 'downloads',
            width: '100px',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        }
    ];

    const renderActions = (template) => (
        <div className="flex justify-center items-center gap-2">
            <button
                onClick={() => handleDownload(template)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Tải xuống"
            >
                <Download className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleEdit(template)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                title="Chỉnh sửa"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(template)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Xóa"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý biểu mẫu</h1>
                    <p className="text-gray-600 mt-1">Quản lý các biểu mẫu tải xuống cho người dân</p>
                </div>
                <button
                    onClick={handleCreateTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Thêm biểu mẫu mới
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-6 py-4">
                <h3 className="font-semibold text-gray-900">
                    Danh sách biểu mẫu ({templates.length})
                </h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        style={column.width ? { width: column.width } : {}}
                                    >
                                        {column.title}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {templates.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                                        Không có biểu mẫu nào
                                    </td>
                                </tr>
                            ) : (
                                templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {column.render
                                                    ? column.render(template[column.dataIndex], template)
                                                    : template[column.dataIndex]
                                                }
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {renderActions(template)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, template: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa biểu mẫu "${deleteModal.template?.name}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}