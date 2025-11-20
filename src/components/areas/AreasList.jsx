import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import BaseTable from '../base/BaseTable';
import { ConfirmModal } from '../base/BaseModal';
import AreaFormModal from './AreaFormModal';
import AreaFilter from './AreaFilter';
import { useAreas } from '../../hooks/useAreas';
import { showToast } from '../../utils/toastNotification';
import { formatDate } from '../../utils/formatDate';

export default function AreasList() {
    const {
        areas,
        loading,
        pagination,
        filters,
        loadAreas,
        createArea,
        updateArea,
        deleteArea,
        updateAreaStatus,
        updateFilters,
        clearFilters
    } = useAreas();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showActive, setShowActive] = useState(true);

    useEffect(() => {
        loadAreas({
            page: 1,
            size: 10,
            isActive: true,
            search: ''
        });
    }, []);

    const handleFilter = (newFilters) => {
        updateFilters({ search: newFilters.search || '' });
        setShowActive(newFilters.isActive);

        loadAreas({
            page: 1,
            size: newFilters.pageSize || pagination.pageSize,
            isActive: newFilters.isActive,
            search: newFilters.search || ''
        });
    };

    const handleReset = () => {
        clearFilters();
        setShowActive(true);
        loadAreas({
            page: 1,
            size: 10,
            isActive: true,
            search: ''
        });
    };

    const handlePageChange = (page) => {
        loadAreas({
            page,
            size: pagination.pageSize,
            isActive: showActive,
            search: filters.search
        });
    };

    const handleCreate = () => {
        setSelectedArea(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedArea(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedArea(item);
        setIsDeleteModalOpen(true);
    };

    const handleCreateSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await createArea(formData);
            showToast.success('Tạo lĩnh vực thành công!');
            setIsCreateModalOpen(false);
            loadAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error.message || 'Tạo lĩnh vực thất bại!');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await updateArea(selectedArea.id, formData);
            showToast.success('Cập nhật lĩnh vực thành công!');
            setIsEditModalOpen(false);
            setSelectedArea(null);
            loadAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error.message || 'Cập nhật lĩnh vực thất bại!');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteArea(selectedArea.id);
            showToast.success('Xóa lĩnh vực thành công!');
            setIsDeleteModalOpen(false);
            setSelectedArea(null);
            loadAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error.message || 'Xóa lĩnh vực thất bại!');
        }
    };

    const handleUpdateStatus = async (area) => {
        try {
            const newStatus = !area.is_active;
            await updateAreaStatus(area.id, newStatus);
            showToast.success(`Lĩnh vực đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`);
            loadAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error.message || 'Cập nhật trạng thái thất bại!');
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
            title: 'Tên lĩnh vực',
            dataIndex: 'ten_linh_vuc',
            key: 'ten_linh_vuc',
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
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý lĩnh vực thủ tục</h1>
                    <p className="text-gray-600 mt-1">Quản lý các lĩnh vực của thủ tục hành chính</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Thêm lĩnh vực mới
                </button>
            </div>

            <AreaFilter
                onFilter={handleFilter}
                onReset={handleReset}
                filters={{ search: filters.search, isActive: showActive }}
                pagination={pagination}
            />

            <div className="flex flex-col mb-4 sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 mb-0">
                        Danh sách lĩnh vực ({pagination.totalItems || 0})
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
                data={areas}
                columns={columns}
                onEdit={handleEdit}
                onDelete={!showActive ? handleDelete : null}
                onUpdateStatus={handleUpdateStatus}
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có lĩnh vực thủ tục nào"}
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            <AreaFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                mode="create"
                isLoading={isSubmitting}
            />

            <AreaFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedArea(null);
                }}
                onSubmit={handleEditSubmit}
                initialData={selectedArea}
                mode="edit"
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa lĩnh vực "${selectedArea?.ten_linh_vuc}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}
