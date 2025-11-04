import { useState } from 'react';
import BaseTable from '../../components/base/BaseTable';
import UserModal from '../../components/users/UserModal';
import { ConfirmModal } from '../../components/base/BaseModal';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/role';
import { useUsers } from '../../hooks/useUsers';
import { showToast } from '../../utils/toastNotification';

export default function AdminManager() {
    const {
        users,
        loading,
        pagination,
        statistics,
        handlePageChange,
        createUser,
        updateUser,
        deleteUser: deleteUserAction
    } = useUsers();

    const [modalLoading, setModalLoading] = useState(false);
    const [userModal, setUserModal] = useState({
        isOpen: false,
        user: null
    });

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        user: null
    });

    const handleCreateUser = () => {
        setUserModal({
            isOpen: true,
            user: null
        });
    };

    const handleEditUser = (user) => {
        setUserModal({
            isOpen: true,
            user
        });
    };

    const handleDeleteUser = (user) => {
        setDeleteModal({
            isOpen: true,
            user
        });
    };

    const handleUserModalSubmit = async (userData) => {
        try {
            setModalLoading(true);

            if (userModal.user) {
                await updateUser({
                    ...userData,
                    id: userModal.user.id
                });
                showToast.success('Cập nhật tài khoản thành công!');
            } else {
                await createUser(userData);
                showToast.success('Tạo tài khoản thành công!');
            }

            setUserModal({ isOpen: false, user: null });

        } catch (error) {
            showToast.error(error.message || 'Có lỗi xảy ra!');
        } finally {
            setModalLoading(false);
        }
    };

    const handleUserModalClose = () => {
        setUserModal({ isOpen: false, user: null });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteUserAction(deleteModal.user.id);
            showToast.success('Xóa tài khoản thành công.');
            setDeleteModal({ isOpen: false, user: null });

        } catch (error) {
            showToast.error(error.message || 'Có lỗi xảy ra khi xóa tài khoản!');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, user: null });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '60px',
            render: (value, record, index) => `#${index + 1 + (pagination.current - 1) * pagination.pageSize}`
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            width: '150px',
            render: (value) => (
                <span
                    className="block max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm"
                    title={value}
                >
                    {value}
                </span>
            )
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '180px',
            render: (value) => (
                <span
                    className="block max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm"
                    title={value}
                >
                    {value}
                </span>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '200px',
            render: (value) => (
                <span
                    className="block max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm"
                    title={value}
                >
                    {value}
                </span>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-800'
                    }`}>
                    {ROLE_LABELS[role] || role}
                </span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {record.active !== false ? 'Hoạt động' : 'Đã khóa'}
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
                    className="block max-w-[120px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                    title={value ? 'Hoạt động' : 'Không hoạt động'}
                >
                    {value ? 'Hoạt động' : 'Không hoạt động'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý tài khoản quản trị</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Quản lý người dùng và phân quyền hệ thống
                    </p>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm tài khoản mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Danh sách tài khoản
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        ({pagination.total})
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Đang hoạt động
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {statistics.active}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Đã khóa
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {statistics.inactive}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Quản trị viên
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {statistics.admins}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BaseTable
                data={users}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                emptyMessage="Không có tài khoản nào"
            />

            <UserModal
                isOpen={userModal.isOpen}
                onClose={handleUserModalClose}
                onSubmit={handleUserModalSubmit}
                user={userModal.user}
                loading={modalLoading}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa tài khoản"
                message={`Bạn có chắc chắn muốn xóa tài khoản "${deleteModal.user?.username}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa tài khoản"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}