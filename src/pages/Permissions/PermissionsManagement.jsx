import React, { useState, useCallback, useEffect } from 'react'
import { Loader2, Plus, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BaseTable from '../../components/base/BaseTable';
import { showToast } from '../../utils/toastNotification';
import { useRoles } from '../../hooks/useRoles';
import { ConfirmModal } from '../../components/base/BaseModal';
import PermisisonFilter from '../../components/permissions/PermisisonFilter';
import { usePermission } from '../../hooks/usePermission';
import { PermissionHidden } from '../../components/PermissionGuard';
import ROUTE_PATH from '../../constants/routes';
import PermissionDetailModal from '../../components/permissions/PermissionDetailModal';

const PermissionsManagement = () => {
    const navigate = useNavigate();
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
        loadRoles,
        updateFilters,
        toggleShowActive,
        getRoleById
    } = useRoles();

    const { canUpdate, canDelete, canUpdateStatus } = usePermission();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRoleForDelete, setSelectedRoleForDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPageSize, setCurrentPageSize] = useState(pagination.pageSize || 10);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRoleForDetail, setSelectedRoleForDetail] = useState(null);

    useEffect(() => {
        updateFilters({ search: '' });
        toggleShowActive(true);
        setCurrentPageSize(10);
        
        loadRoles(1, 10, { search: '', isActive: true });
    }, []);

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
            title: "STT",
            key: "stt",
            width: "60px",
            render: (value, record, index) => (
                <span className="text-sm font-medium text-gray-900">
                    #
                    {((pagination?.currentPage || 1) - 1) * (pagination?.pageSize || 10) +
                        index +
                        1}
                </span>
            ),
        },
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

    const handleEdit = useCallback((record) => {
        navigate(ROUTE_PATH.ROLE_EDIT.replace(':roleId', record.id));
    }, [navigate]);

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
        navigate(ROUTE_PATH.ROLE_CREATE);
    }

    const handleView = useCallback(async (role) => {
        try {
            const result = await getRoleById(role.id);
            if (result.success) {
                setSelectedRoleForDetail(result.data);
                setIsDetailModalOpen(true);
            } else {
                showToast.error('Không thể tải dữ liệu vai trò');
            }
        } catch (error) {
            showToast.error(error.message || 'Có lỗi xảy ra');
        }
    }, [getRoleById]);

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
                        Danh sách quyền ({pagination.totalItems || 0})
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
                // canEdit={() => canUpdate('ROLE')}
                // canDelete={() => canDelete('ROLE')}
                // canUpdateStatus={() => canUpdateStatus('ROLE')}
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có vai trò nào"}
                pagination={tablePagination}
                onPageChange={handlePageChange}
                loading={loading}
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

            <PermissionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedRoleForDetail(null);
                }}
                permisison={selectedRoleForDetail}
            />
        </div>
    )
}

export default PermissionsManagement
