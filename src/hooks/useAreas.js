import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    updateAreaStatus,
    fetchAreaById,
    fetchAreasPagination
} from '../features/areas/areasThunks';
import {
    selectAreas,
    selectCurrentArea,
    selectAreasLoading,
    selectAreasError,
    selectAreasPagination,
    selectAreasFilters
} from '../features/areas/areasSelectors';
import {
    clearError,
    setFilters,
    clearFilters,
    clearCurrentArea
} from '../features/areas/areasSlice';

export const useAreas = ({ autoFetch = false, filters = {}, isActive } = {}) => {
    const dispatch = useDispatch();

    const areas = useSelector(selectAreas);
    const currentArea = useSelector(selectCurrentArea);
    const loading = useSelector(selectAreasLoading);
    const error = useSelector(selectAreasError);
    const pagination = useSelector(selectAreasPagination);
    const currentFilters = useSelector(selectAreasFilters);

    useEffect(() => {
        if (autoFetch) {
            loadAreas({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: isActive !== undefined ? isActive : currentFilters.isActive,
                ...filters
            });
        }
    }, [autoFetch]);

    const loadAreas = useCallback((params = {}) => {
        const requestParams = {
            page: params.page || pagination.currentPage,
            size: params.size || pagination.pageSize,
            search: params.search || currentFilters.search || '',
            isActive: params.isActive !== undefined ? params.isActive : currentFilters.isActive
        };

        return dispatch(fetchAreasPagination(requestParams)).unwrap();
    }, [dispatch, pagination, currentFilters]);

    const createNewArea = useCallback((formData) => {
        return dispatch(createArea(formData)).unwrap();
    }, [dispatch]);

    const updateExistingArea = useCallback((areaId, formData) => {
        return dispatch(updateArea({ id: areaId, data: formData })).unwrap();
    }, [dispatch]);

    const deleteExistingArea = useCallback((areaId) => {
        return dispatch(deleteArea(areaId)).unwrap();
    }, [dispatch]);

    const updateStatus = useCallback((areaId, isActive) => {
        return dispatch(updateAreaStatus({ id: areaId, isActive })).unwrap();
    }, [dispatch]);

    const loadAreaById = useCallback((areaId) => {
        return dispatch(fetchAreaById(areaId)).unwrap();
    }, [dispatch]);

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const resetFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    const clearCurrent = useCallback(() => {
        dispatch(clearCurrentArea());
    }, [dispatch]);

    const clearAreaError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        areas,
        currentArea,
        loading,
        error,
        pagination,
        filters: currentFilters,

        loadAreas,
        createArea: createNewArea,
        updateArea: updateExistingArea,
        deleteArea: deleteExistingArea,
        updateAreaStatus: updateStatus,
        loadAreaById,
        updateFilters,
        clearFilters: resetFilters,
        clearCurrentArea: clearCurrent,
        clearError: clearAreaError
    };
};
