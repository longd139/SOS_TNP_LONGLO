import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectUsers,
    selectCurrentUser,
    selectLoading,
    selectError,
    selectPagination,
    selectUserStatistics
} from '../features/users/usersSelectors';
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus
} from '../features/users/usersThunks';
import {
    clearCurrentUser,
    clearError,
    setCurrentUser
} from '../features/users/usersSlice';

export const useUsers = () => {
    const dispatch = useDispatch();

    const users = useSelector(selectUsers);
    const currentUser = useSelector(selectCurrentUser);
    const loading = useSelector(selectLoading);
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

    return {
        users,
        currentUser,
        loading,
        error,
        pagination,
        statistics,

        loadUsers,
        createUser: handleCreateUser,
        updateUser: handleUpdateUser,
        updateStatus: handleUpdateStatus,
        deleteUser: handleDeleteUser,
        handlePageChange,
        selectUser,
        clearSelected,
        clearError: clearErrorMessage
    };
};
