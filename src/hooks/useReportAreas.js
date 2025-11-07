import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
    fetchReportAreas,
    createReportArea,
    updateReportArea,
    deleteReportArea,
    updateStatusReportArea,
    fetchReportAreaById
} from '../features/reportAreas/reportAreasThunk';
import {
    selectReportAreas,
    selectCurrentReportArea,
    selectReportAreaLoading,
    selectReportAreaError,
    selectReportAreaPagination,
    selectReportAreaFilters,
    selectShowActive
} from '../features/reportAreas/reportAreasSelectors';
import {
    clearError,
    setCurrentReportArea,
    clearCurrentReportArea,
    setFilters,
    resetFilters,
    setShowActive
} from '../features/reportAreas/reportAreasSlice';

export const useReportAreas = ({ autoFetch = false, filters = {}, isActive } = {}) => {
    const dispatch = useDispatch();

    const reportAreas = useSelector(selectReportAreas);
    const currentReportArea = useSelector(selectCurrentReportArea);
    const loading = useSelector(selectReportAreaLoading);
    const error = useSelector(selectReportAreaError);
    const pagination = useSelector(selectReportAreaPagination);
    const currentFilters = useSelector(selectReportAreaFilters);
    const showActive = useSelector(selectShowActive);

    useEffect(() => {
        if (autoFetch) {
            loadReportAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: isActive !== undefined ? isActive : showActive,
                ...filters
            });
        }
    }, [autoFetch]);

    const loadReportAreas = useCallback((params = {}) => {
        const requestParams = {
            page: params.page || pagination.currentPage,
            size: params.size || pagination.pageSize,
            search: params.search || currentFilters.search || '',
            isActive: params.isActive !== undefined ? params.isActive : showActive
        };

        return dispatch(fetchReportAreas(requestParams)).unwrap();
    }, [dispatch, pagination, currentFilters, showActive]);

    const createArea = useCallback((formData) => {
        return dispatch(createReportArea(formData)).unwrap();
    }, [dispatch]);

    const updateArea = useCallback((reportAreaId, formData) => {
        return dispatch(updateReportArea({ reportAreaId, formData })).unwrap();
    }, [dispatch]);

    const deleteArea = useCallback((reportAreaId) => {
        return dispatch(deleteReportArea(reportAreaId)).unwrap();
    }, [dispatch]);

    const updateAreaStatus = useCallback((reportAreaId, isActive) => {
        return dispatch(updateStatusReportArea({ reportAreaId, isActive })).unwrap();
    }, [dispatch]);

    const loadReportAreaById = useCallback((reportAreaId) => {
        return dispatch(fetchReportAreaById(reportAreaId)).unwrap();
    }, [dispatch]);

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const clearFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const setSelectedReportArea = useCallback((reportArea) => {
        dispatch(setCurrentReportArea(reportArea));
    }, [dispatch]);

    const clearSelectedReportArea = useCallback(() => {
        dispatch(clearCurrentReportArea());
    }, [dispatch]);

    const updateShowActive = useCallback((value) => {
        dispatch(setShowActive(value));
    }, [dispatch]);

    const clearReportAreaError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        reportAreas,
        currentReportArea,
        loading,
        error,
        pagination,
        filters: currentFilters,
        showActive,

        loadReportAreas,
        createArea,
        updateArea,
        deleteArea,
        updateAreaStatus,
        loadReportAreaById,
        updateFilters,
        clearFilters,
        setSelectedReportArea,
        clearSelectedReportArea,
        updateShowActive,
        clearError: clearReportAreaError
    };
};
