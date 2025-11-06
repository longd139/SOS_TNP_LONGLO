import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProcedures,
    fetchAreas,
    createProcedure as createProcedureThunk,
    updateProcedure as updateProcedureThunk,
    deleteProcedure as deleteProcedureThunk,
    fetchProcedureById,
    updateProcedureStatus
} from '../features/procedures/proceduresThunks';
import {
    setFilters,
    resetFilters as resetFiltersAction,
    setShowActive,
    clearCurrentProcedure,
    clearError
} from '../features/procedures/proceduresSlice';
import {
    selectProcedures,
    selectAreas,
    selectCurrentProcedure,
    selectLoading,
    selectAreasLoading,
    selectError,
    selectPagination,
    selectFilters,
    selectShowActive,
    selectProceduresWithAreas
} from '../features/procedures/proceduresSelectors';

export const useProcedure = () => {
    const dispatch = useDispatch();

    const procedures = useSelector(selectProcedures);
    const areas = useSelector(selectAreas);
    const currentProcedure = useSelector(selectCurrentProcedure);
    const loading = useSelector(selectLoading);
    const areasLoading = useSelector(selectAreasLoading);
    const error = useSelector(selectError);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);
    const showActive = useSelector(selectShowActive);
    const proceduresWithAreas = useSelector(selectProceduresWithAreas);

    const loadProcedures = useCallback((
        page = 1,
        size = 10,
        search = '',
        id_linh_vuc = '',
        isActive = true
    ) => {
        dispatch(fetchProcedures({
            page,
            size,
            search,
            id_linh_vuc,
            isActive
        }));
    }, [dispatch]);

    const loadAreas = useCallback(() => {
        dispatch(fetchAreas());
    }, [dispatch]);

    const createProcedure = useCallback(async (formData) => {
        try {
            const result = await dispatch(createProcedureThunk(formData)).unwrap();

            dispatch(fetchProcedures({
                page: pagination.current,
                size: pagination.pageSize,
                search: filters.searchKeyword,
                id_linh_vuc: filters.selectedDomain,
                isActive: showActive
            }));

            return { success: true };
        } catch (error) {
            return { success: false, error: { message: error } };
        }
    }, [dispatch, pagination, filters, showActive]);

    const updateProcedure = useCallback(async (procedureId, formData) => {
        try {
            const result = await dispatch(updateProcedureThunk({ procedureId, formData })).unwrap();

            dispatch(fetchProcedures({
                page: pagination.current,
                size: pagination.pageSize,
                search: filters.searchKeyword,
                id_linh_vuc: filters.selectedDomain,
                isActive: showActive
            }));

            return { success: true };
        } catch (error) {
            return { success: false, error: { message: error } };
        }
    }, [dispatch, pagination, filters, showActive]);

    const deleteProcedure = useCallback(async (procedureId, procedureName) => {
        try {
            const result = await dispatch(deleteProcedureThunk({ procedureId, procedureName })).unwrap();

            dispatch(fetchProcedures({
                page: pagination.current,
                size: pagination.pageSize,
                search: filters.searchKeyword,
                id_linh_vuc: filters.selectedDomain,
                isActive: showActive
            }));

            return { success: true };
        } catch (error) {
            if (error === 'User cancelled') {
                return { success: false, cancelled: true };
            }
            return { success: false, error: { message: error } };
        }
    }, [dispatch, pagination, filters, showActive]);

    const getProcedureById = useCallback(async (procedureId) => {
        try {
            const result = await dispatch(fetchProcedureById(procedureId)).unwrap();
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error };
        }
    }, [dispatch]);

    const searchProcedures = useCallback(() => {
        dispatch(fetchProcedures({
            page: 1,
            size: pagination.pageSize,
            search: filters.searchKeyword,
            id_linh_vuc: filters.selectedDomain,
            isActive: showActive
        }));
    }, [dispatch, pagination.pageSize, filters, showActive]);

    const changePage = useCallback((page) => {
        dispatch(fetchProcedures({
            page,
            size: pagination.pageSize,
            search: filters.searchKeyword,
            id_linh_vuc: filters.selectedDomain,
            isActive: showActive
        }));
    }, [dispatch, pagination.pageSize, filters, showActive]);

    const changePageSize = useCallback((size) => {
        dispatch(fetchProcedures({
            page: 1,
            size,
            search: filters.searchKeyword,
            id_linh_vuc: filters.selectedDomain,
            isActive: showActive
        }));
    }, [dispatch, filters, showActive]);

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const resetFilters = useCallback(() => {
        dispatch(resetFiltersAction());
        dispatch(fetchProcedures({
            page: 1,
            size: pagination.pageSize,
            search: '',
            id_linh_vuc: '',
            isActive: showActive
        }));
    }, [dispatch, pagination.pageSize, showActive]);

    const toggleShowActive = useCallback((value) => {
        dispatch(setShowActive(value));
    }, [dispatch]);

    const clearCurrent = useCallback(() => {
        dispatch(clearCurrentProcedure());
    }, [dispatch]);

    const clearErrorMessage = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleUpdateStatus = useCallback(
        async (procedureId, isActive) => {
            const result = await dispatch(updateProcedureStatus({ procedureId, isActive }));
            if (updateProcedureStatus.fulfilled.match(result)) {
                await dispatch(fetchProcedures({ 
                    page: pagination.current,
                    size: pagination.pageSize,
                    search: filters.searchKeyword,
                    id_linh_vuc: filters.selectedDomain,
                    isActive: showActive
                }));
                return { success: true };
            } else {
                throw new Error(result.payload || 'Không thể cập nhật trạng thái thủ tục');
            }
        },
        [dispatch, pagination]
    );

    useEffect(() => {
        loadProcedures(1, pagination.pageSize, filters.searchKeyword, filters.selectedDomain, showActive);
        loadAreas();
    }, [showActive]); 

    return {
        procedures,
        areas,
        currentProcedure,
        loading,
        areasLoading,
        error,
        pagination,
        filters,
        showActive,
        proceduresWithAreas,

        loadProcedures,
        loadAreas,
        createProcedure,
        updateProcedure,
        deleteProcedure,
        getProcedureById,
        searchProcedures,
        changePage,
        changePageSize,
        updateFilters,
        resetFilters,
        toggleShowActive,
        clearCurrent,
        clearErrorMessage,
        handleUpdateStatus
    };
};
