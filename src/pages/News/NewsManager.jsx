import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import BaseTable from '../../components/base/BaseTable';
import { ConfirmModal } from '../../components/base/BaseModal';
import NewsFormModal from '../../components/news/NewsFormModal';
import NewsFilter from '../../components/news/NewsFilter';
import NewsPreviewModal from '../../components/news/NewsPreviewModal';
import { useNews } from '../../hooks/useNews';
import { formatDate } from '../../utils/formatDate';
import { STATUS_NEWS, STATUS_NEWS_LABELS } from '../../constants/status';
import { showToast } from '../../utils/toastNotification';

export default function NewsManager() {
    const { news, loading, error, pagination, loadNews, createNews, updateNews, deleteNews, clearError } = useNews();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({});

    const handleView = (item) => {
        setSelectedNews(item);
        setIsPreviewModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedNews(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedNews(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        const result = await deleteNews(selectedNews.id);
        if (result.success) {
            showToast.success('Xóa tin tức thành công!');
            loadNews(currentFilters);
        } else {
            showToast.error(result.error || 'Xóa tin tức thất bại!');
        }
        setIsDeleteModalOpen(false);
        setSelectedNews(null);
    };

    const handleCreateSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            const result = await createNews(formData);
            if (result.success) {
                showToast.success('Tạo tin tức thành công!');
                setIsCreateModalOpen(false);
                loadNews(currentFilters);
            } else {
                showToast.error(result.error || 'Tạo tin tức thất bại!');
            }
        } catch (error) {
            showToast.error('Có lỗi xảy ra khi tạo tin tức!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            const result = await updateNews(selectedNews.id, formData);
            if (result.success) {
                showToast.success('Cập nhật tin tức thành công!');
                setIsEditModalOpen(false);
                setSelectedNews(null);
                loadNews(currentFilters);
            } else {
                showToast.error(result.error || 'Cập nhật tin tức thất bại!');
            }
        } catch (error) {
            showToast.error('Có lỗi xảy ra khi cập nhật tin tức!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFilter = (filters) => {
        setCurrentFilters(filters);
        loadNews(filters);
    };

    const handleResetFilter = () => {
        const defaultFilters = { page: 1, size: 10 };
        setCurrentFilters(defaultFilters);
        loadNews(defaultFilters);
    };

    const getStatusDisplay = (trangThai) => {
        const statusMap = {
            [STATUS_NEWS.DRAFT]: { label: STATUS_NEWS_LABELS[STATUS_NEWS.DRAFT], bg: '#FEF3C7', color: '#92400E' },
            [STATUS_NEWS.PUBLISHED]: { label: STATUS_NEWS_LABELS[STATUS_NEWS.PUBLISHED], bg: '#D1FAE5', color: '#065F46' }
        };
        return statusMap[trangThai] || { label: trangThai, bg: '#E5E7EB', color: '#374151' };
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (value, record, index) => (
                <span className="text-sm font-medium text-gray-900">
                    #{(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                </span>
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'tieu_de',
            key: 'tieu_de',
            width: '300px',
            render: (value) => (
                <div 
                    className="text-sm text-gray-900 max-w-[300px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value}
                >
                    {value}
                </div>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'danh_muc_tin_tuc',
            key: 'danh_muc',
            render: (danhMuc) => (
                <span className="text-sm text-gray-600">
                    {danhMuc?.ten_danh_muc || 'Chưa phân loại'}
                </span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            render: (value) => {
                const status = getStatusDisplay(value);
                return (
                    <span
                        className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                            backgroundColor: status.bg,
                            color: status.color
                        }}
                    >
                        {status.label}
                    </span>
                );
            }
        },
        {
            title: 'Tác giả',
            dataIndex: 'tac_gia',
            key: 'tac_gia',
            render: (value) => (
                <span className="text-sm text-gray-600">{value || 'N/A'}</span>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'thoi_gian_tao',
            key: 'thoi_gian_tao',
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {value ? formatDate(value) : 'N/A'}
                </span>
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

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                    <button onClick={clearError} className="ml-4 underline">Đóng</button>
                </div>
            )}

            <NewsFilter onFilter={handleFilter} onReset={handleResetFilter} />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                        Danh sách bài viết ({pagination.totalItems || 0})
                    </h3>
                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang tải...</span>
                        </div>
                    )}
                </div>
            </div>

            <BaseTable
                data={news}
                columns={columns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={news.is_removed ? handleDelete : undefined }
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có bài viết nào"}
            />

            <NewsFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                initialData={null}
                isLoading={isSubmitting}
            />

            <NewsFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedNews(null);
                }}
                onSubmit={handleEditSubmit}
                initialData={selectedNews}
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa bài viết "${selectedNews?.tieu_de}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />

            <NewsPreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => {
                    setIsPreviewModalOpen(false);
                    setSelectedNews(null);
                }}
                newsData={selectedNews}
                isPreview={false}
            />
        </div>
    );
}
