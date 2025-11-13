import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectUsers,
    selectCurrentUser,
    selectSelectedUserDetail,
    selectLoading,
    selectDetailLoading,
    selectError,
    selectPagination,
    selectUserStatistics
} from '../features/users/usersSelectors';
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    getUserById
} from '../features/users/usersThunks';
import {
    clearCurrentUser,
    clearError,
    setCurrentUser,
    clearSelectedUserDetail
} from '../features/users/usersSlice';

export const useUsers = () => {
    const dispatch = useDispatch();

    const users = useSelector(selectUsers);
    const currentUser = useSelector(selectCurrentUser);
    const selectedUserDetail = useSelector(selectSelectedUserDetail);
    const loading = useSelector(selectLoading);
    const detailLoading = useSelector(selectDetailLoading);
    const error = useSelector(selectError);
    const pagination = useSelector(selectPagination);
    const statistics = useSelector(selectUserStatistics);

    useEffect(() => {
        dispatch(fetchUsers({ page: 1, size: 10 }));
    }, [dispatch]);

    const loadUsers = useCallback(
        (page = 1, size = 10, filters = {}) => {
            return dispatch(fetchUsers({ page, size, ...filters }));
        },
        [dispatch]
    );

    const handleCreateUser = useCallback(
        async (userData) => {
            const result = await dispatch(createUser(userData));
            if (createUser.fulfilled.match(result)) {
                await dispatch(fetchUsers({
                    page: pagination.current,
                    pageSize: pagination.pageSize
                }));
                return { success: true };
            } else {
                throw new Error(result.payload || 'Không thể tạo tài khoản');
            }
        },
        [dispatch, pagination]
    );

    const handleUpdateUser = useCallback(
        async (userData) => {
            const result = await dispatch(updateUser(userData));
            if (updateUser.fulfilled.match(result)) {
                await dispatch(fetchUsers({
                    page: pagination.current,
                    pageSize: pagination.pageSize
                }));
                return { success: true };
            } else {
                throw new Error(result.payload || 'Không thể cập nhật tài khoản');
            }
        },
        [dispatch, pagination]
    );

    const handleDeleteUser = useCallback(
        async (userId) => {
            const result = await dispatch(deleteUser(userId));
            if (deleteUser.fulfilled.match(result)) {
                const remainingUsers = users.length - 1;
                const shouldGoToPreviousPage =
                    remainingUsers === 0 &&
                    pagination.current > 1;

                if (shouldGoToPreviousPage) {
                    await dispatch(fetchUsers({
                        page: pagination.current - 1,
                        pageSize: pagination.pageSize
                    }));
                }
                return { success: true };
            } else {
                throw new Error(result.payload || 'Không thể xóa tài khoản');
            }
        },
        [dispatch, users.length, pagination]
    );

    const handlePageChange = useCallback(
        (page, filters = {}) => {
            dispatch(fetchUsers({ page, size: pagination.pageSize, ...filters }));
        },
        [dispatch, pagination.pageSize]
    );

    const handleUpdateStatus = useCallback(
        async (userId, isActive) => {
            const result = await dispatch(updateUserStatus({ userId, isActive }));
            if (updateUserStatus.fulfilled.match(result)) {
                await dispatch(fetchUsers({
                    page: pagination.current,
                    pageSize: pagination.pageSize
                }));
                return { success: true };
            } else {
                throw new Error(result.payload || 'Không thể cập nhật trạng thái tài khoản');
            }
        },
        [dispatch, pagination]
    );

    const selectUser = useCallback(
        (user) => {
            dispatch(setCurrentUser(user));
        },
        [dispatch]
    );

    const clearSelected = useCallback(() => {
        dispatch(clearCurrentUser());
    }, [dispatch]);

    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleGetUserById = useCallback(
        async (userId) => {
            const result = await dispatch(getUserById(userId));
            if (getUserById.fulfilled.match(result)) {
                return { success: true, data: result.payload };
            } else {
                throw new Error(result.payload || 'Không thể tải thông tin người dùng');
            }
        },
        [dispatch]
    );

    const clearUserDetail = useCallback(() => {
        dispatch(clearSelectedUserDetail());
    }, [dispatch]);

    return {
        users,
        currentUser,
        selectedUserDetail,
        loading,
        detailLoading,
        error,
        pagination,
        statistics,

        loadUsers,
        createUser: handleCreateUser,
        updateUser: handleUpdateUser,
        updateStatus: handleUpdateStatus,
        deleteUser: handleDeleteUser,
        getUserById: handleGetUserById,
        handlePageChange,
        selectUser,
        clearSelected,
        clearUserDetail,
        clearError: clearErrorMessage
    };
};
