import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectPermissions,
    selectPermissionCategories,
    selectPermissionLoading,
    selectPermissionError,
    selectPermissionFilters,
    selectAllPermissionList
} from '../features/permissions/permissionSelector';
import {
    fetchPermissions,
    fetchPermissionCategories
} from '../features/permissions/permissionThunk';
import {
    clearPermissionError,
    setPermissionFilters,
    resetPermissionFilters
} from '../features/permissions/permissionSlice';

export const usePermissions = () => {
    const dispatch = useDispatch();

    const permissions = useSelector(selectPermissions);
    const permissionList = useSelector(selectAllPermissionList);
    const categories = useSelector(selectPermissionCategories);
    const loading = useSelector(selectPermissionLoading);
    const error = useSelector(selectPermissionError);
    const filters = useSelector(selectPermissionFilters);

    useEffect(() => {
        dispatch(fetchPermissions({ search: '', danhMuc: '' }));
        dispatch(fetchPermissionCategories());
    }, [dispatch]);

    const loadPermissions = useCallback(
        (search = '', danhMuc = '') => {
            return dispatch(fetchPermissions({ search, danhMuc }));
        },
        [dispatch]
    );

    const loadCategories = useCallback(
        () => {
            return dispatch(fetchPermissionCategories());
        },
        [dispatch]
    );

    const updateFilters = useCallback(
        (newFilters) => {
            dispatch(setPermissionFilters(newFilters));
        },
        [dispatch]
    );

    const clearFilters = useCallback(() => {
        dispatch(resetPermissionFilters());
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(clearPermissionError());
    }, [dispatch]);

    const getPermissionsByCategory = useCallback(() => {
        return permissions;
    }, [permissions]);

    const getAllPermissionCodes = useCallback(() => {
        return permissionList.map(p => p.code);
    }, [permissionList]);

    const getCategoryNames = useCallback(() => {
        return Object.keys(permissions || {});
    }, [permissions]);

    return {
        permissions,
        permissionList,
        categories,
        loading,
        error,
        filters,

        loadPermissions,
        loadCategories,
        updateFilters,
        clearFilters,
        clearError,
        getPermissionsByCategory,
        getAllPermissionCodes,
        getCategoryNames
    };
};

