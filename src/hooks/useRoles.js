import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectRoles,
    selectAllRoles,
    selectCurrentRole,
    selectRolesLoading,
    selectAllRolesLoading,
    selectRolesError,
    selectRolesPagination,
    selectRolesFilters,
    selectShowActive
} from '../features/roles/roleSelector';
import {
    fetchRoles,
    fetchRolesByPagination,
    fetchRoleById,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus
} from '../features/roles/roleThunk';
import {
    clearError,
    setCurrentRole,
    clearCurrentRole,
    setFilters,
    resetFilters,
    setShowActive
} from '../features/roles/roleSlice';

export const useRoles = () => {
    const dispatch = useDispatch();

    const roles = useSelector(selectRoles);
    const allRoles = useSelector(selectAllRoles);
    const currentRole = useSelector(selectCurrentRole);
    const loading = useSelector(selectRolesLoading);
    const allRolesLoading = useSelector(selectAllRolesLoading);
    const error = useSelector(selectRolesError);
    const pagination = useSelector(selectRolesPagination);
    const filters = useSelector(selectRolesFilters);
    const showActive = useSelector(selectShowActive);

    useEffect(() => {
        dispatch(fetchRolesByPagination({ page: 1, size: 10 }));
    }, [dispatch]);

    const loadAllRoles = useCallback(
        (search = '') => {
            return dispatch(fetchRoles(search));
        },
        [dispatch]
    );

    const loadRoles = useCallback(
        (page = 1, size = 10, filterOptions = {}) => {
            return dispatch(fetchRolesByPagination({ page, size, ...filterOptions }));
        },
        [dispatch]
    );

    const handleCreateRole = useCallback(
        async (roleData) => {
            const result = await dispatch(createRole(roleData));
            if (createRole.fulfilled.match(result)) {
                await dispatch(fetchRolesByPagination({
                    page: pagination.currentPage,
                    size: pagination.pageSize
                }));
                return { success: true, data: result.payload };
            } else {
                throw new Error(result.payload || 'Không thể tạo vai trò');
            }
        },
        [dispatch, pagination]
    );

    const handleUpdateRole = useCallback(
        async (roleId, roleData) => {
            const result = await dispatch(updateRole({ roleId, roleData }));
            if (updateRole.fulfilled.match(result)) {
                await dispatch(fetchRolesByPagination({
                    page: pagination.currentPage,
                    size: pagination.pageSize
                }));
                return { success: true, data: result.payload };
            } else {
                throw new Error(result.payload || 'Không thể cập nhật vai trò');
            }
        },
        [dispatch, pagination]
    );

    const handleDeleteRole = useCallback(
        async (roleId) => {
            const result = await dispatch(deleteRole(roleId));
            if (deleteRole.fulfilled.match(result)) {
                const remainingRoles = roles.length - 1;
                const shouldGoToPreviousPage =
                    remainingRoles === 0 &&
                    pagination.currentPage > 1;

                if (shouldGoToPreviousPage) {
                    await dispatch(fetchRolesByPagination({
                        page: pagination.currentPage - 1,
                        size: pagination.pageSize
                    }));
                } else {
                    await dispatch(fetchRolesByPagination({
                        page: pagination.currentPage,
                        size: pagination.pageSize
                    }));
                }
                return { success: true };
            } else {
                throw new Error(result.payload || 'Không thể xóa vai trò');
            }
        },
        [dispatch, roles.length, pagination]
    );

    const handleUpdateStatus = useCallback(
        async (roleId, isActive) => {
            const result = await dispatch(updateRoleStatus({ roleId, isActive }));
            if (updateRoleStatus.fulfilled.match(result)) {
                await dispatch(fetchRolesByPagination({
                    page: pagination.currentPage,
                    size: pagination.pageSize
                }));
                return { success: true, data: result.payload };
            } else {
                throw new Error(result.payload || 'Không thể cập nhật trạng thái vai trò');
            }
        },
        [dispatch, pagination]
    );

    const handlePageChange = useCallback(
        (page, filterOptions = {}) => {
            dispatch(fetchRolesByPagination({ 
                page, 
                size: pagination.pageSize, 
                ...filterOptions 
            }));
        },
        [dispatch, pagination.pageSize]
    );

    const getRoleById = useCallback(
        async (roleId) => {
            const result = await dispatch(fetchRoleById(roleId));
            if (fetchRoleById.fulfilled.match(result)) {
                return { success: true, data: result.payload };
            } else {
                throw new Error(result.payload || 'Không thể tải thông tin vai trò');
            }
        },
        [dispatch]
    );

    const selectRole = useCallback(
        (role) => {
            dispatch(setCurrentRole(role));
        },
        [dispatch]
    );

    const clearSelected = useCallback(() => {
        dispatch(clearCurrentRole());
    }, [dispatch]);

    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const updateFilters = useCallback(
        (newFilters) => {
            dispatch(setFilters(newFilters));
        },
        [dispatch]
    );

    const clearFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const toggleShowActive = useCallback(
        (value) => {
            dispatch(setShowActive(value));
        },
        [dispatch]
    );

    return {
        roles,
        allRoles,
        currentRole,
        loading,
        allRolesLoading,
        error,
        pagination,
        filters,
        showActive,

        loadRoles,
        loadAllRoles,
        createRole: handleCreateRole,
        updateRole: handleUpdateRole,
        deleteRole: handleDeleteRole,
        updateStatus: handleUpdateStatus,
        getRoleById,
        handlePageChange,
        selectRole,
        clearSelected,
        clearError: clearErrorMessage,
        updateFilters,
        clearFilters,
        toggleShowActive
    };
};

