import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { newsList } from '../../mockData';
import BaseTable from '../../components/BaseTable';
import BaseModal, { ModalFooter, ConfirmModal } from '../../components/BaseModal';

export default function NewsManager() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Tin tức',
        content: '',
        status: 'Bản nháp'
    });

    const handleView = (item) => {
        console.log('View news:', item);
    };

    const handleEdit = (item) => {
        setSelectedNews(item);
        setFormData({
            title: item.title,
            category: item.category,
            content: '',
            status: item.status
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedNews(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        console.log('Delete news:', selectedNews);
        setIsDeleteModalOpen(false);
        setSelectedNews(null);
    };

    const handleCreateSubmit = () => {
        console.log('Create news:', formData);
        setIsCreateModalOpen(false);
        setFormData({
            title: '',
            category: 'Tin tức',
            content: '',
            status: 'Bản nháp'
        });
    };

    const handleEditSubmit = () => {
        console.log('Update news:', selectedNews.id, formData);
        setIsEditModalOpen(false);
        setSelectedNews(null);
    };

    const columns = [
        {
            title: 'ID',
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
            render: (value) => (
                <div className="text-sm text-gray-900 max-w-md">{value}</div>
            )
        },
        {
            title: 'Loại',
            dataIndex: 'category',
            key: 'category',
            render: (value, record) => (
                <span
                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                        backgroundColor: record.categoryBg,
                        color: record.categoryColor
                    }}
                >
                    {value}
                </span>
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
            title: 'Ngày đăng',
            dataIndex: 'publishedDate',
            key: 'publishedDate',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
            render: (value) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức & thông báo</h1>
                    <p className="text-gray-600 mt-1">Đăng và quản lý tin tức cho người dân</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Tạo bài viết mới
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-4 py-3">
                <h3 className="font-semibold text-gray-900">
                    Danh sách bài viết ({newsList.length})
                </h3>
            </div>

            <BaseTable
                data={newsList}
                columns={columns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
                emptyMessage="Không có bài viết nào"
            />

            <BaseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Tạo bài viết mới"
                size="2xl"
                footer={
                    <ModalFooter
                        onCancel={() => setIsCreateModalOpen(false)}
                        onSubmit={handleCreateSubmit}
                        cancelText="Hủy"
                        submitText="Tạo bài viết"
                    />
                }
            >
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Tin tức">Tin tức</option>
                                <option value="Quan trọng">Quan trọng</option>
                                <option value="Sự kiện">Sự kiện</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Bản nháp">Bản nháp</option>
                                <option value="Đã xuất bản">Đã xuất bản</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập nội dung bài viết"
                        />
                    </div>
                </div>
            </BaseModal>

            <BaseModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Chỉnh sửa bài viết"
                size="2xl"
                footer={
                    <ModalFooter
                        onCancel={() => setIsEditModalOpen(false)}
                        onSubmit={handleEditSubmit}
                        cancelText="Hủy"
                        submitText="Cập nhật"
                    />
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Tin tức">Tin tức</option>
                                <option value="Quan trọng">Quan trọng</option>
                                <option value="Sự kiện">Sự kiện</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Bản nháp">Bản nháp</option>
                                <option value="Đã xuất bản">Đã xuất bản</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập nội dung bài viết"
                        />
                    </div>
                </div>
            </BaseModal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa bài viết "${selectedNews?.title}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}
