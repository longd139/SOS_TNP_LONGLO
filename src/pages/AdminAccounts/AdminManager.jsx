import { useState } from 'react';
import BaseTable from '../../components/base/BaseTable';
import UserModal from '../../components/users/UserModal';
import UserFilter from '../../components/admin/UserFilter';
import UserViewModal from '../../components/users/UserViewModal';
import { ConfirmModal } from '../../components/base/BaseModal';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/role';
import { useUsers } from '../../hooks/useUsers';
import { usePermission } from '../../hooks/usePermission';
import { PermissionHidden } from '../../components/PermissionGuard';
import { showToast } from '../../utils/toastNotification';

export default function AdminManager() {
    const {
        users,
        loading,
        pagination,
        statistics,
        selectedUserDetail,
        detailLoading,
        handlePageChange,
        loadUsers,
        createUser,
        updateUser,
        updateStatus,
        deleteUser: deleteUserAction,
        getUserById,
        clearUserDetail
    } = useUsers();

    const { canCreate, canUpdate, canDelete, canView, canUpdateStatus } = usePermission();

    const [modalLoading, setModalLoading] = useState(false);
    const [filters, setFilters] = useState({
        searchKeyword: '',
        isActive: '',
        vaiTro: ''
    });
    const [userModal, setUserModal] = useState({
        isOpen: false,
        user: null
    });

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        user: null
    });

    const [viewModal, setViewModal] = useState({
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

    const handleViewUser = async (user) => {
        try {
            setViewModal({
                isOpen: true,
                user: null
            });

            await getUserById(user.id);

            setViewModal({
                isOpen: true,
                user: user
            });
        } catch (error) {
            showToast.error(error.message || 'Không thể tải thông tin người dùng');
            setViewModal({
                isOpen: false,
                user: null
            });
        }
    };

    const handleViewModalClose = () => {
        setViewModal({
            isOpen: false,
            user: null
        });
        clearUserDetail();
    };

    const canDeleteUser = (user) => {
        return !user.active;
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

            if (error) {
                showToast.error(error);
            }

            if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
                error.errors.forEach((err) => {
                    if (err?.message) {
                        showToast.error(err.message);
                    }
                });
            } else if (typeof error === 'string') {
                showToast.error(error);
            } else if (!error?.message && !error?.errors) {
                showToast.error('Có lỗi xảy ra khi cập nhật trạng thái');
            }
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
            showToast.error(error.message || 'Có lỗi xảy ra khi xóa tài khoản!' || error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, user: null });
    };

    const handleUpdateStatus = async (user) => {
        try {
            await updateStatus(user.id, !user.active);
            showToast.success(`Tài khoản đã được ${!user.active ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`);
        } catch (error) {
            showToast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái tài khoản!' || error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        loadUsers(1, pagination.pageSize, {
            isActive: filters.isActive !== '' ? filters.isActive : undefined,
            vaiTro: filters.vaiTro !== '' ? filters.vaiTro : undefined,
            search: filters.searchKeyword !== '' ? filters.searchKeyword : undefined
        });
    };

    const handleSearchWithFilters = (newFilters) => {
        const { searchKeyword, isActive, vaiTro, pageSize } = newFilters;

        setFilters({
            searchKeyword: searchKeyword || '',
            isActive: isActive !== undefined ? isActive : '',
            vaiTro: vaiTro || ''
        });

        loadUsers(1, pageSize || pagination.pageSize, {
            isActive: isActive !== undefined ? isActive : undefined,
            vaiTro: vaiTro || undefined,
            search: searchKeyword || undefined
        });
    };

    const handleResetFilters = () => {
        setFilters({
            searchKeyword: '',
            isActive: '',
            vaiTro: ''
        });
        loadUsers(1, pagination.pageSize);
    };

    const handlePageSizeChange = (newPageSize) => {
        loadUsers(1, newPageSize, {
            isActive: filters.isActive !== '' ? filters.isActive : undefined,
            vaiTro: filters.vaiTro !== '' ? filters.vaiTro : undefined,
            search: filters.searchKeyword !== '' ? filters.searchKeyword : undefined
        });
    };

    const handlePageChangeWithFilters = (page) => {
        handlePageChange(page, {
            isActive: filters.isActive !== '' ? filters.isActive : undefined,
            vaiTro: filters.vaiTro !== '' ? filters.vaiTro : undefined,
        });
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
            width: '300px',
            render: (value) => (
                <span
                    className="block max-w-[300px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm"
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
            width: '150px',
            render: (role) => (
                <span className='inline-flex items-center px-2.5 py-0.5 text-gray-800'>
                    {role}
                </span>
            )
        },
        {
            title: 'SỐ ĐIỆN THOẠI',
            dataIndex: 'phone',
            key: 'phone',
            width: '150px',
            render: (value) => (
                <span
                    className="block max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                    title={value}
                >
                    {value}
                </span>
            )
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'active',
            key: 'active',
            width: '150px',
            render: (value) => (
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                >
                    {value ? 'Hoạt động' : 'Đã khóa'}
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
                <PermissionHidden modulePrefix="ND" action="CREATE">
                    <button
                        onClick={handleCreateUser}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Thêm tài khoản mới
                    </button>
                </PermissionHidden>
            </div>

            <UserFilter
                filters={filters}
                pagination={pagination}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onReset={handleResetFilters}
                onPageSizeChange={handlePageSizeChange}
                onSearchWithFilters={handleSearchWithFilters}
            />

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
                onPageChange={handlePageChangeWithFilters}
                onView={canView('ND') ? handleViewUser : undefined}
                onEdit={canUpdate('ND') ? handleEditUser : undefined}
                onDelete={canDelete('ND') ? handleDeleteUser : undefined}
                canDelete={canDeleteUser}
                onUpdateStatus={canUpdateStatus('ND') ? handleUpdateStatus : undefined}
                emptyMessage="Không có tài khoản nào"
            />

            <UserModal
                isOpen={userModal.isOpen}
                onClose={handleUserModalClose}
                onSubmit={handleUserModalSubmit}
                user={userModal.user}
                loading={modalLoading}
            />

            <UserViewModal
                isOpen={viewModal.isOpen}
                onClose={handleViewModalClose}
                userData={selectedUserDetail}
                loading={detailLoading}
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