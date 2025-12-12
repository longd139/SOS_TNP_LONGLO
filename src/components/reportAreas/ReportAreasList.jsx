import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import BaseTable from '../base/BaseTable';
import { ConfirmModal } from '../base/BaseModal';
import ReportAreaFormModal from './ReportAreaFormModal';
import ReportAreasFilter from './ReportAreasFilter';
import { useReportAreas } from '../../hooks/useReportAreas';
import { showToast } from '../../utils/toastNotification';
import { formatDate } from '../../utils/formatDate';
import { usePermission } from '../../hooks/usePermission';
import { PermissionHidden } from '../PermissionGuard';

export default function ReportAreasList() {
    const {
        reportAreas,
        loading,
        pagination,
        showActive,
        filters,
        loadReportAreas,
        createArea,
        updateArea,
        deleteArea,
        updateAreaStatus,
        updateFilters,
        clearFilters,
        updateShowActive,
        loadReportAreaById
    } = useReportAreas();

    const { canUpdate, canDelete, canUpdateStatus } = usePermission();

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        updateShowActive(true);
        clearFilters();

        loadReportAreas({
            page: 1,
            size: 10,
            isActive: true,
            search: ''
        });
    }, []);

    const handleFilter = (newFilters) => {
        const searchValue = (newFilters.search || '').trim();

        updateFilters({ search: searchValue });
        updateShowActive(newFilters.isActive);

        loadReportAreas({
            page: 1,
            size: newFilters.pageSize || pagination.pageSize,
            isActive: newFilters.isActive,
            search: searchValue
        });
    };

    const handleReset = () => {
        clearFilters();
        updateShowActive(true);
        loadReportAreas({
            page: 1,
            size: 10,
            isActive: true,
            search: ''
        });
    };

    const handlePageChange = (page) => {
        loadReportAreas({
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

    const handleView = async (item) => {
        try {
            const fullData = await loadReportAreaById(item.id);
            setSelectedArea(fullData);
        } catch (error) {
            setSelectedArea(item);
        } finally {
            setIsViewModalOpen(true);
        }
    }

    const handleEdit = async (item) => {
        try {
            const fullData = await loadReportAreaById(item.id);
            setSelectedArea(fullData);
            setIsEditModalOpen(true);
        } catch (error) {
            setSelectedArea(item);
            setIsEditModalOpen(true);
        }
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
            loadReportAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error || 'Tạo lĩnh vực thất bại!');
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
            loadReportAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error || 'Cập nhật lĩnh vực thất bại!');
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
            loadReportAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error || 'Xóa lĩnh vực thất bại!');
        }
    };

    const handleUpdateStatus = async (area) => {
        try {
            const newStatus = !area.is_active;
            await updateAreaStatus(area.id, newStatus);
            showToast.success(`Lĩnh vực đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`);
            loadReportAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            showToast.error(error || 'Cập nhật trạng thái thất bại!');
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
            dataIndex: 'ten',
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
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý lĩnh vực phản ánh</h1>
                    <p className="text-gray-600 mt-1">Quản lý các lĩnh vực phản ánh của người dân</p>
                </div>
                <PermissionHidden modulePrefix="LVPA" action="CREATE">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm lĩnh vực mới
                    </button>
                </PermissionHidden>
            </div>

            <ReportAreasFilter
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
                data={reportAreas}
                columns={columns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={!showActive ? handleDelete : null}
                onUpdateStatus={handleUpdateStatus}
                // canEdit={() => canUpdate('LVPA')}
                // canDelete={() => canDelete('LVPA')}
                // canUpdateStatus={() => canUpdateStatus('LVPA')}
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có lĩnh vực nào"}
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            <ReportAreaFormModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedArea(null);
                }}
                onSubmit={() => { }}
                initialData={selectedArea}
                mode="view"
            />

            <ReportAreaFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                mode="create"
                isLoading={isSubmitting}
            />

            <ReportAreaFormModal
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
                message={`Bạn có chắc chắn muốn xóa lĩnh vực "${selectedArea?.ten}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}
