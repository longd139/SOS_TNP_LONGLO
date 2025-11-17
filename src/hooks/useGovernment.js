import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
    createGovernment,
    updateGovernment,
    deleteGovernment,
    updateGovernmentStatus,
    fetchGovernmentById,
    fetchGovernmentPagination
} from '../features/government/governmentThunks';
import {
    selectGovernments,
    selectCurrentGovernment,
    selectGovernmentLoading,
    selectGovernmentError,
    selectGovernmentPagination,
    selectGovernmentFilters
} from '../features/government/governmentSelectors';
import {
    clearError,
    setFilters,
    clearFilters,
    clearCurrentGovernment
} from '../features/government/governmentSlice';

export const useGovernment = ({ autoFetch = false, filters = {}, isActive } = {}) => {
    const dispatch = useDispatch();

    const governments = useSelector(selectGovernments);
    const currentGovernment = useSelector(selectCurrentGovernment);
    const loading = useSelector(selectGovernmentLoading);
    const error = useSelector(selectGovernmentError);
    const pagination = useSelector(selectGovernmentPagination);
    const currentFilters = useSelector(selectGovernmentFilters);

    const loadGovernments = useCallback((params = {}) => {
        const requestParams = {
            page: params.page || pagination.currentPage,
            size: params.size || pagination.pageSize,
            search: params.search || currentFilters.search || '',
            isActive: params.isActive !== undefined ? params.isActive : currentFilters.isActive
        };

        return dispatch(fetchGovernmentPagination(requestParams)).unwrap();
    }, [dispatch, pagination, currentFilters]);

    useEffect(() => {
        if (autoFetch) {
            loadGovernments({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: isActive !== undefined ? isActive : currentFilters.isActive,
                ...filters
            });
        }
    }, [autoFetch]);

    const createNewGovernment = useCallback((formData) => {
        return dispatch(createGovernment(formData)).unwrap();
    }, [dispatch]);

    const updateExistingGovernment = useCallback((governmentId, formData) => {
        return dispatch(updateGovernment({ id: governmentId, data: formData })).unwrap();
    }, [dispatch]);

    const deleteExistingGovernment = useCallback((governmentId) => {
        return dispatch(deleteGovernment(governmentId)).unwrap();
    }, [dispatch]);

    const updateStatus = useCallback((governmentId, isActive) => {
        return dispatch(updateGovernmentStatus({ id: governmentId, isActive })).unwrap();
    }, [dispatch]);

    const loadGovernmentById = useCallback((governmentId) => {
        return dispatch(fetchGovernmentById(governmentId)).unwrap();
    }, [dispatch]);

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const resetFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    const clearCurrent = useCallback(() => {
        dispatch(clearCurrentGovernment());
    }, [dispatch]);

    const clearGovernmentError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        governments,
        currentGovernment,
        loading,
        error,
        pagination,
        filters: currentFilters,

        loadGovernments,
        createGovernment: createNewGovernment,
        updateGovernment: updateExistingGovernment,
        deleteGovernment: deleteExistingGovernment,
        updateGovernmentStatus: updateStatus,
        loadGovernmentById,
        updateFilters,
        clearFilters: resetFilters,
        clearCurrentGovernment: clearCurrent,
        clearError: clearGovernmentError
    };
};

