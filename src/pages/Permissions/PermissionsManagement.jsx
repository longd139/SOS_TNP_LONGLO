import { data } from 'autoprefixer'
import React, { useState } from 'react'
import { permissionData } from '../../mockData'
import { Plus, Shield } from 'lucide-react';
import BaseTable from '../../components/base/BaseTable';
import { showToast } from '../../utils/toastNotification';
import PermissionFormModal from '../../components/permissions/PermissionFormModal';

const PermissionsManagement = () => {
    const data = permissionData;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const column = [
        {
            title: 'Tên Role',
            dataIndex: 'name',
            key: 'name',
            width: '200px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap flex items-center"
                    title={value}
                >
                    <Shield className="inline-block w-4 h-4 mr-1 text-blue-600" />
                    {value}
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
                    title={value}
                >
                    {value}
                </div>
            )
        },
        {
            title: 'Số quyền',
            dataIndex: 'permissionNumber',
            key: 'permissionNumber',
            width: '100px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[100px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value}
                >
                    {value}
                </div>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: '100px',
            render: (value) => (
                <div
                    className="text-sm text-gray-900 max-w-[100px] truncate text-ellipsis overflow-hidden whitespace-nowrap"
                    title={value}
                >
                    {value}
                </div>
            )
        }
    ]
    const handleEdit = (record) => {
        showToast.info('Chức năng chỉnh sửa đang được phát triển!')
    }

    const handleDelete = (record) => {
        showToast.info('Chức năng xóa đang được phát triển!')
    }
    const handleUpdateStatus = (record, status) => {
        showToast.info('Chức năng cập nhật trạng thái đang được phát triển!')
    }
    const handlePageChange = (page) => {
        showToast.info('Chức năng chuyển trang đang được phát triển!')
    }
    const loading = false;
    const showActive = false;
    const pagination = {
        current: 1,
        pageSize: 10,
        total: data.length
    }

    const handleCreate = () => {
        setIsCreateModalOpen(true);
        setSelectedRole(null);
    }

    const handleCreateSubmit = (formData) => {
        showToast.info('Chức năng tạo mới đang được phát triển!')
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
        <div className='min-h-screen'>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý phân quyền</h1>
                    <p className="text-gray-600 mt-1">Quản lý vai trò và phân quyền người dùng</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Tạo role mới
                </button>
            </div>
            <BaseTable
                data={data}
                columns={column}
                onEdit={handleEdit}
                onDelete={!showActive ? handleDelete : null}
                onUpdateStatus={handleUpdateStatus}
                showActions={true}
                emptyMessage={loading ? "Đang tải dữ liệu..." : "Không có phân quyền nào"}
                pagination={pagination}
                onPageChange={handlePageChange}
            />
            <PermissionFormModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                mode="create"
                isLoading={isSubmitting}
            />
        </div>
    )
}

export default PermissionsManagement
