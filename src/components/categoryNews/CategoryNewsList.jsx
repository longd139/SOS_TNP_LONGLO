import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import BaseTable from '../base/BaseTable';
import { ConfirmModal } from '../base/BaseModal';
import CategoryNewsModal from './CategoryNewsModal';
import CategoryNewsFilter from './CategoryNewsFilter';
import { useCategories } from '../../hooks/useCategories';
import { showToast } from '../../utils/toastNotification';
import { formatDate } from '../../utils/formatDate';
import { PermissionHidden } from '../PermissionGuard';

export default function CategoryNewsList() {
    const {
        categories,
        loading,
        pagination,
        showActive,
        filters,
        loadCategoriesWithPagination,
        createNewCategory,
        updateExistingCategory,
        deleteExistingCategory,
        updateCategoryStatus,
        updateFilters,
        clearFilters,
        updateShowActive,
        loadCategoryById
    } = useCategories();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        updateShowActive(true);
        clearFilters();

        loadCategoriesWithPagination({
            page: 1,
            pageSize: 10,
            isActive: true,
            search: ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = (newFilters) => {
        const searchValue = (newFilters.search || '').trim();

        updateFilters({ search: searchValue });
        updateShowActive(newFilters.isActive);

        loadCategoriesWithPagination({
            page: 1,
            pageSize: newFilters.pageSize || pagination.pageSize,
            isActive: newFilters.isActive,
            search: searchValue
        });
    };

    const handleReset = () => {
        clearFilters();
        updateShowActive(true);
        loadCategoriesWithPagination({
            page: 1,
            pageSize: 10,
            isActive: true,
            search: ''
        });
    };

    const handlePageChange = (page) => {
        loadCategoriesWithPagination({
            page,
            pageSize: pagination.pageSize,
            isActive: showActive,
            search: filters.search
        });
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = async (item) => {
        try {
            const fullData = await loadCategoryById(item.id);
            setSelectedCategory(fullData);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Failed to load category details:', error);
            setSelectedCategory(item);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = (item) => {
        setSelectedCategory(item);
        setIsDeleteModalOpen(true);
    };

    const handleCreateSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await createNewCategory(formData);
            showToast.success('Tạo danh mục thành công!');
            setIsCreateModalOpen(false);
            loadCategoriesWithPagination({
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error || 'Tạo danh mục thất bại!');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await updateExistingCategory(selectedCategory.id, formData);
            showToast.success('Cập nhật danh mục thành công!');
            setIsEditModalOpen(false);
            setSelectedCategory(null);
            loadCategoriesWithPagination({
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error || 'Cập nhật danh mục thất bại!');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteExistingCategory(selectedCategory.id);
            showToast.success('Xóa danh mục thành công!');
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
            loadCategoriesWithPagination({
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error || 'Xóa danh mục thất bại!');
        }
    };

    const handleUpdateStatus = async (category) => {
        try {
            const newStatus = !category.is_active;
            await updateCategoryStatus(category.id, newStatus);
            showToast.success(`Danh mục đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`);
            loadCategoriesWithPagination({
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            const errorMessage = error?.message || error || 'Cập nhật trạng thái thất bại!';
            showToast.error(errorMessage);
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: '80px',
            render: (value, record, index) => (
                <span className="text-sm font-medium text-gray-900">
                    #{((pagination?.currentPage || 1) - 1) * (pagination?.pageSize || 10) + index + 1}
                </span>
            )
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'ten_danh_muc',
            key: 'ten',
            width: '250px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 font-medium max-w-[250px] truncate"
                    title={value}
                >
                    {value}
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
            width: '400px',
            render: (value) => (
                <div
                    className="text-sm text-gray-600 min-w-0 truncate"
                    title={value || 'Không có mô tả'}
                >
                    {value || 'Không có mô tả'}
                </div>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'thoi_gian_tao',
            key: 'thoi_gian_tao',
            width: '150px',
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {value ? formatDate(value) : 'N/A'}
                </span>
            )
        },
        {
            title: 'Trạng thái',
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
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục tin tức</h1>
                    <p className="text-gray-600 mt-1">Quản lý các danh mục tin tức trong hệ thống</p>
                </div>
                <PermissionHidden modulePrefix="DMTT" action="CREATE">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm danh mục mới
                    </button>
                </PermissionHidden>
            </div>

            <CategoryNewsFilter
                onFilter={handleFilter}
                onReset={handleReset}
                filters={{ search: filters.search, isActive: showActive }}
                pagination={pagination}
            />

            <div className="flex flex-col mb-4 sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 mb-0">
                        Danh sách danh mục ({pagination.totalItems || 0})
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
                data={categories}
                columns={columns}
                onEdit={handleEdit}
                onDelete={!showActive ? handleDelete : null}
                onUpdateStatus={handleUpdateStatus}
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có danh mục nào"}
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            <CategoryNewsModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                mode="create"
                isLoading={isSubmitting}
            />

            <CategoryNewsModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSubmit={handleEditSubmit}
                initialData={selectedCategory}
                mode="edit"
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategory?.ten}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}