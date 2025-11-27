import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import BaseTable from '../../components/base/BaseTable';
import { ConfirmModal } from '../../components/base/BaseModal';
import NewsFormModal from '../../components/news/NewsFormModal';
import NewsFilter from '../../components/news/NewsFilter';
import NewsPreviewModal from '../../components/news/NewsPreviewModal';
import { useNews } from '../../hooks/useNews';
import { formatDate } from '../../utils/formatDate';
import { showToast } from '../../utils/toastNotification';
import { getNewsById } from '../../services/newsService';

export default function NewsManager() {
    const {
        news,
        loading,
        error,
        pagination,
        filters,
        showActive,
        fetchNewsList,
        loadNews,
        createNews,
        updateNews,
        updateStatus,
        deleteNews,
        setFilters,
        setShowActive,
        clearError
    } = useNews();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    useEffect(() => {
        setShowActive(true);
        setFilters({ idDanhMuc: null, search: '' });
        setPageSize(10);

        loadNews({
            page: 1,
            size: 10,
            isActive: true,
            idDanhMuc: null,
            search: ''
        });
    }, []);

    const handleView = async (item) => {
        setIsLoadingPreview(true);
        try {
            const fullNewsData = await getNewsById(item.id);
            setSelectedNews(fullNewsData);
            setIsPreviewModalOpen(true);
        } catch (error) {
            showToast.error('Không thể tải chi tiết bài viết!');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleEdit = async (item) => {
        setIsLoadingPreview(true);
        try {
            const fullNewsData = await getNewsById(item.id);
            setSelectedNews(fullNewsData);
            setIsEditModalOpen(true);
        } catch (error) {
            showToast.error('Không thể tải chi tiết bài viết!');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleDelete = (item) => {
        setSelectedNews(item);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateStatus = async (newsItem) => {
        const newStatus = !newsItem.is_active;
        const result = await updateStatus(newsItem);
        if (result.success) {
            showToast.success(`Tin tức đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`);
            loadNews({
                page: pagination.currentPage,
                size: pageSize,
                isActive: showActive,
                idDanhMuc: filters.idDanhMuc,
                search: filters.search
            });
        } else {
            showToast.error(result.error || 'Cập nhật trạng thái thất bại!');
        }
    };

    const handleConfirmDelete = async () => {
        const result = await deleteNews(selectedNews.id);
        if (result.success) {
            showToast.success('Xóa tin tức thành công!');
            loadNews({
                page: pagination.currentPage,
                size: pageSize,
                isActive: showActive,
                idDanhMuc: filters.idDanhMuc,
                search: filters.search
            });
        } else {
            showToast.error(result.error || 'Xóa tin tức thất bại!');
        }
        setIsDeleteModalOpen(false);
        setSelectedNews(null);
    };

    const handleCreateSubmit = async (formData, callback = null, isUpdate = false, newsId = null) => {
        if (isUpdate) {
            try {
                const targetId = newsId || selectedNews?.id;
                if (targetId) {
                    const result = await updateNews(targetId, formData);
                    if (result.success) {
                        loadNews({
                            page: pagination.currentPage,
                            size: pageSize,
                            isActive: showActive,
                            idDanhMuc: filters.idDanhMuc,
                            search: filters.search
                        });
                    }
                }
            } catch (error) {
                showToast.error(error || error.message || 'Cập nhật tin tức thất bại!');
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createNews(formData);
            if (result.success) {
                const createdNewsId = result.data?.id;
                showToast.success('Tạo tin tức thành công!');

                if (callback && createdNewsId) {
                    await callback(createdNewsId);
                }

                setIsCreateModalOpen(false);
                loadNews({
                    page: pagination.currentPage,
                    size: pageSize,
                    isActive: showActive,
                    idDanhMuc: filters.idDanhMuc,
                    search: filters.search
                });
            } else {
                showToast.error(result.error || 'Tạo tin tức thất bại!');
            }
        } catch (error) {
            showToast.error('Có lỗi xảy ra khi tạo tin tức!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (formData, callback = null, isUpdate = false, newsId = null) => {
        if (isUpdate) {
            try {
                const targetId = newsId || selectedNews?.id;
                if (targetId) {
                    const result = await updateNews(targetId, formData);
                    if (result.success) {
                        loadNews({
                            page: pagination.currentPage,
                            size: pageSize,
                            isActive: showActive,
                            idDanhMuc: filters.idDanhMuc,
                            search: filters.search
                        });
                    }
                }
            } catch (error) {
                showToast.error(error || error.message || 'Cập nhật tin tức thất bại!');
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateNews(selectedNews.id, formData);
            if (result.success) {
                showToast.success('Cập nhật tin tức thành công!');

                if (callback && selectedNews.id) {
                    await callback(selectedNews.id);
                }

                setIsEditModalOpen(false);
                setSelectedNews(null);
                loadNews({
                    page: pagination.currentPage,
                    size: pageSize,
                    isActive: showActive,
                    idDanhMuc: filters.idDanhMuc,
                    search: filters.search
                });
            } else {
                showToast.error(result.error || 'Cập nhật tin tức thất bại!');
            }
        } catch (error) {
            showToast.error('Có lỗi xảy ra khi cập nhật tin tức!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (page) => {
        fetchNewsList(page, pageSize);
    };

    const handleFilter = (newFilters) => {

        const updatedFilters = {};
        if (newFilters.idDanhMuc !== undefined) {
            updatedFilters.idDanhMuc = newFilters.idDanhMuc || null;
        }
        if (newFilters.search !== undefined) {
            const trimmedSearch = typeof newFilters.search === 'string' ? newFilters.search.trim() : '';
            updatedFilters.search = trimmedSearch;
        }
        if (Object.keys(updatedFilters).length > 0) {
            setFilters(updatedFilters);
        }

        if (newFilters.isActive !== undefined) {
            setShowActive(newFilters.isActive);
        }

        const selectedPageSize = newFilters.pageSize !== undefined ? Number(newFilters.pageSize) : pageSize;
        if (newFilters.pageSize !== undefined) {
            setPageSize(selectedPageSize);
        }

        const trimmedSearch = newFilters.search !== undefined 
            ? (typeof newFilters.search === 'string' ? newFilters.search.trim() : '')
            : filters.search;

        loadNews({
            page: 1,
            size: selectedPageSize,
            isActive: newFilters.isActive !== undefined ? newFilters.isActive : showActive,
            idDanhMuc: newFilters.idDanhMuc !== undefined ? (newFilters.idDanhMuc || null) : filters.idDanhMuc,
            search: trimmedSearch
        });
    };

    const handleResetFilter = () => {
        setFilters({ idDanhMuc: null, search: '' });
        setShowActive(true);
        setPageSize(10);

        loadNews({
            page: 1,
            size: 10,
            isActive: true,
            idDanhMuc: null,
            search: ''
        });
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (value, record, index) => (
                <span className="text-sm font-medium text-gray-900">
                    #{((pagination?.currentPage || 1) - 1) * (pagination?.pageSize || pageSize) + index + 1}
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
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'is_active',
            key: 'is_active',
            width: '120px',
            render: (value) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {value ? 'Hoạt động' : 'Không hoạt động'}
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

            <NewsFilter
                currentFilters={{
                    search: filters.search || '',
                    idDanhMuc: filters.idDanhMuc || '',
                    isActive: showActive,
                    pageSize: pageSize
                }}
                onFilter={handleFilter}
                onReset={handleResetFilter}
            />            <div className="mb-3 flex flex-col mb-4 sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 mb-0">
                        Danh sách bài viết ({pagination.totalItems || 0})
                    </h3>
                    {!showActive && (
                        <span className="px-2 md:px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Không hoạt động
                        </span>
                    )}
                    {showActive && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Đang hoạt động
                        </span>
                    )}
                </div>
                {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tải...</span>
                    </div>
                )}
            </div>

            <BaseTable
                data={news}
                columns={columns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={!showActive ? handleDelete : null}
                onUpdateStatus={handleUpdateStatus}
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có bài viết nào"}
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            {isCreateModalOpen && (
                <NewsFormModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateSubmit}
                    initialData={null}
                    isLoading={isSubmitting}
                />
            )}

            {isEditModalOpen && (
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
            )}

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
