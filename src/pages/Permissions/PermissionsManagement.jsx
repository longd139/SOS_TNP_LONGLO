import React, { useState, useCallback, useEffect } from 'react'
import { Loader2, Plus, Shield } from 'lucide-react';
import BaseTable from '../../components/base/BaseTable';
import { showToast } from '../../utils/toastNotification';
import PermissionFormModal from '../../components/permissions/PermissionFormModal';
import { useRoles } from '../../hooks/useRoles';
import { ConfirmModal } from '../../components/base/BaseModal';
import PermisisonFilter from '../../components/permissions/PermisisonFilter';
import { usePermission } from '../../hooks/usePermission';
import { PermissionHidden } from '../../components/PermissionGuard';
import PermissionDetailModal from '../../components/permissions/PermissionDetailModal';

const PermissionsManagement = () => {
    const {
        roles,
        loading,
        pagination,
        filters,
        showActive,
        createRole,
        updateRole,
        deleteRole,
        updateStatus,
        getRoleById,
        loadRoles,
        updateFilters,
        toggleShowActive
    } = useRoles();

    const { canCreate, canUpdate, canDelete, canUpdateStatus } = usePermission();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);
    const [selectedRoleForDelete, setSelectedRoleForDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPageSize, setCurrentPageSize] = useState(pagination.pageSize || 10);

    useEffect(() => {
        loadRoles(1, 10);
    }, [loadRoles]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const column = [
        {
            title: 'Tên vai trò',
            dataIndex: 'name',
            key: 'name',
            width: '200px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap 
                   flex items-center leading-none"
                    title={value}
                >
                    <span className="w-4 h-4 flex items-center justify-center mr-1 flex-shrink-0">
                        <Shield className="w-4 h-4 text-blue-600" />
                    </span>

                    <span className="flex-1 leading-none">{value}</span>
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '300px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[300px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value || '-'}
                >
                    {value || '-'}
                </div>
            )
        },
        {
            title: 'Số quyền',
            dataIndex: 'permissionCount',
            key: 'permissionCount',
            width: '100px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[100px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value}
                >
                    {value || 0}
                </div>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'thoi_gian_tao',
            key: 'thoi_gian_tao',
            width: '120px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[120px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={formatDate(value)}
                >
                    {formatDate(value)}
                </div>
            )
        }
    ]

    const handleEdit = useCallback(async (record) => {
        try {
            setIsSubmitting(true);
            const result = await getRoleById(record.id);
            if (result.success) {
                setSelectedRoleForEdit(result.data);
                setIsEditModalOpen(true);
            }
        } catch (error) {
            showToast.error(error.message || 'Không thể tải thông tin vai trò');
        } finally {
            setIsSubmitting(false);
        }
    }, [getRoleById]);

    const handleDelete = useCallback((record) => {
        setSelectedRoleForDelete(record);
        setIsDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedRoleForDelete) return;

        try {
            setIsSubmitting(true);
            await deleteRole(selectedRoleForDelete.id);
            showToast.success('Xóa vai trò thành công');
            setIsDeleteModalOpen(false);
            setSelectedRoleForDelete(null);
        } catch (error) {
            showToast.error(error.message || 'Xóa vai trò thất bại');
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedRoleForDelete, deleteRole]);

    const handleUpdateStatus = useCallback(async (record) => {
        try {
            const newStatus = !record.is_active;
            await updateStatus(record.id, newStatus);
            showToast.success('Cập nhật trạng thái thành công');
        } catch (error) {
            showToast.error(error.message || 'Cập nhật trạng thái thất bại');
        }
    }, [updateStatus]);

    const handlePageChange = useCallback((page) => {
        loadRoles(page, currentPageSize, {
            search: filters?.search || '',
            isActive: showActive ?? true
        });
    }, [loadRoles, currentPageSize, filters?.search, showActive]);

    const handleFilter = useCallback((filterValues) => {
        const { search, isActive, pageSize } = filterValues;

        updateFilters({ search: search || '' });
        toggleShowActive(isActive ?? true);
        setCurrentPageSize(pageSize || 10);

        loadRoles(1, pageSize || 10, { search: search || '', isActive: isActive ?? true });
    }, [loadRoles, updateFilters, toggleShowActive]);

    const handleReset = useCallback(() => {
        updateFilters({ search: '' });
        toggleShowActive(true);
        setCurrentPageSize(10);
        loadRoles(1, 10, { search: '', isActive: true });
    }, [loadRoles, updateFilters, toggleShowActive]);

    const handleCreate = () => {
        setIsCreateModalOpen(true);
        setSelectedRoleForEdit(null);
    }

    const handleView = async (permission) => {
        const result = await getRoleById(permission.id);
        if (result.success) {
            setSelectedRoleForEdit(result.data);
            setIsCreateModalOpen(true);
        } else {
            const errorMessage = result.error?.message || result.error || "Có lỗi xảy ra khi lấy thông tin thủ tục!";
            showToast.error(errorMessage);
        }
    };
    const handleCreateSubmit = useCallback(async (formData) => {
        try {
            setIsSubmitting(true);
            await createRole(formData);
            showToast.success('Tạo vai trò thành công');
            setIsCreateModalOpen(false);
        } catch (error) {
            showToast.error(error.message || 'Tạo vai trò thất bại');
        } finally {
            setIsSubmitting(false);
        }
    }, [createRole]);

    const handleEditSubmit = useCallback(async (formData) => {
        if (!selectedRoleForEdit) return;

        try {
            setIsSubmitting(true);
            await updateRole(selectedRoleForEdit.id, formData);
            showToast.success('Cập nhật vai trò thành công');
            setIsEditModalOpen(false);
            setSelectedRoleForEdit(null);
        } catch (error) {
            showToast.error(error.message || 'Cập nhật vai trò thất bại');
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedRoleForEdit, updateRole]);

    const tableData = roles.map(role => ({
        ...role,
        is_active: role.is_active
    }));

    const tablePagination = {
        current: pagination.currentPage,
        pageSize: currentPageSize,
        total: pagination.totalItems,
        totalPages: pagination.totalPages
    };

    return (
        <div className='min-h-screen'>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý phân quyền</h1>
                    <p className="text-gray-600 mt-1">Quản lý vai trò và phân quyền người dùng</p>
                </div>
                <PermissionHidden modulePrefix="ROLE" action="CREATE">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo vai trò mới
                    </button>
                </PermissionHidden>
            </div>

            <PermisisonFilter
                onFilter={handleFilter}
                onReset={handleReset}
                filters={{ search: filters?.search || '', isActive: showActive ?? true }}
                pagination={{ pageSize: currentPageSize }}
            />

            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
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
                data={tableData}
                columns={column}
                onEdit={handleEdit}
                onDelete={!showActive ? handleDelete : undefined}
                onUpdateStatus={handleUpdateStatus}
                onView={handleView}
                canEdit={() => canUpdate('ROLE')}
                canDelete={() => canDelete('ROLE')}
                canUpdateStatus={() => canUpdateStatus('ROLE')}
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có vai trò nào"}
                pagination={tablePagination}
                onPageChange={handlePageChange}
                loading={loading}
            />

            <PermissionFormModal
                isOpen={isCreateModalOpen && selectedRoleForEdit === null}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                mode="create"
                isLoading={isSubmitting}
            />

            <PermissionDetailModal
                isOpen={isCreateModalOpen && selectedRoleForEdit !== null}
                onClose={() => setIsCreateModalOpen(false)}
                permisison={selectedRoleForEdit}
            />


            <PermissionFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedRoleForEdit(null);
                }}
                onSubmit={handleEditSubmit}
                mode="edit"
                initialData={selectedRoleForEdit}
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedRoleForDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa vai trò "${selectedRoleForDelete?.name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    )
}

export default PermissionsManagement
