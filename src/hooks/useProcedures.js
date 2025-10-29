import { useState, useEffect, useCallback } from 'react';
import { FORMALITY_API } from '../apis/formality';
import { AREAS_API } from '../apis/areas';

const DEFAULT_PAGE_SIZE = 10;
const INITIAL_PAGINATION = {
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0
};

const debugLogger = {
    log: (...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(...args);
        }
    },
    error: (...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.error(...args);
        }
    }
};

export const useProcedures = () => {
    const [procedures, setProcedures] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(INITIAL_PAGINATION);
    const [filters, setFilters] = useState({
        searchKeyword: '',
        selectedDomain: ''
    });

    const loadProcedures = useCallback(async (page = 1, size = DEFAULT_PAGE_SIZE, search = '', id_linh_vuc = '') => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                search,
                is_removed: false
            };

            if (id_linh_vuc) {
                params.id_linh_vuc = id_linh_vuc;
            }

            const response = await FORMALITY_API.getFormalityApi(params);

            debugLogger.log('Procedures API response:', response.content);

            const procedures = response.content || [];
            setProcedures(procedures);
            setPagination({
                current: page,
                pageSize: size,
                total: response.totalElements || 0,
                totalPages: response.totalPages || 0
            });

            debugLogger.log('Fetched procedures:', procedures.length, 'items');
        } catch (error) {
            debugLogger.error('Error fetching procedures:', error);
            setProcedures([]);
            setPagination(prev => ({
                ...prev,
                total: 0,
                totalPages: 0
            }));
        } finally {
            setLoading(false);
        }
    }, []);

    const loadAreas = useCallback(async () => {
        try {
            const response = await AREAS_API.getAreas(false);
            setAreas(response || []);
            debugLogger.log('Fetched areas:', response?.length, 'items');
        } catch (error) {
            debugLogger.error('Error fetching areas:', error);
            setAreas([]);
        }
    }, []);

    const createProcedure = useCallback(async (formData) => {
        try {
            debugLogger.log('Creating procedure:', formData);
            await FORMALITY_API.createFormality(formData);
            await loadProcedures(pagination.current, pagination.pageSize, filters.searchKeyword, filters.selectedDomain);
            return { success: true };
        } catch (error) {
            debugLogger.error('Error creating procedure:', error);
            return { success: false, error };
        }
    }, [pagination.current, pagination.pageSize, filters.searchKeyword, filters.selectedDomain, loadProcedures]);

    const updateProcedure = useCallback(async (procedureId, formData) => {
        try {
            debugLogger.log('Updating procedure:', procedureId, formData);
            await FORMALITY_API.updateFormality(procedureId, formData);
            await loadProcedures(pagination.current, pagination.pageSize, filters.searchKeyword, filters.selectedDomain);
            return { success: true };
        } catch (error) {
            debugLogger.error('Error updating procedure:', error);
            alert('Có lỗi xảy ra khi cập nhật thủ tục!');
            return { success: false, error };
        }
    }, [pagination.current, pagination.pageSize, filters.searchKeyword, filters.selectedDomain, loadProcedures]);

    const deleteProcedure = useCallback(async (procedureId, procedureName) => {
        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa thủ tục "${procedureName}"?`);
        if (!confirmed) return { success: false, cancelled: true };

        try {
            await FORMALITY_API.deleteFormality(procedureId);
            await loadProcedures(pagination.current, pagination.pageSize, filters.searchKeyword, filters.selectedDomain);
            return { success: true };
        } catch (error) {
            debugLogger.error('Error deleting procedure:', error);
            alert('Có lỗi xảy ra khi xóa thủ tục!');
            return { success: false, error };
        }
    }, [pagination.current, pagination.pageSize, filters.searchKeyword, filters.selectedDomain, loadProcedures]);

    const getProcedureById = useCallback(async (procedureId) => {
        try {
            debugLogger.log('Getting procedure by ID:', procedureId);
            const response = await FORMALITY_API.getFormalityById(procedureId);
            return { success: true, data: response };
        } catch (error) {
            debugLogger.error('Error getting procedure:', error);
            alert('Có lỗi xảy ra khi lấy thông tin thủ tục!');
            return { success: false, error };
        }
    }, []);

    const searchProcedures = useCallback(() => {
        loadProcedures(1, pagination.pageSize, filters.searchKeyword, filters.selectedDomain);
    }, [pagination.pageSize, filters.searchKeyword, filters.selectedDomain, loadProcedures]);

    const changePage = useCallback((page) => {
        loadProcedures(page, pagination.pageSize, filters.searchKeyword, filters.selectedDomain);
    }, [pagination.pageSize, filters.searchKeyword, filters.selectedDomain, loadProcedures]);

    const changePageSize = useCallback((size) => {
        loadProcedures(1, size, filters.searchKeyword, filters.selectedDomain);
    }, [filters.searchKeyword, filters.selectedDomain, loadProcedures]);

    const resetFilters = useCallback(() => {
        setFilters({
            searchKeyword: '',
            selectedDomain: ''
        });
        loadProcedures(1, pagination.pageSize, '', '');
    }, [pagination.pageSize, loadProcedures]);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    useEffect(() => {
        loadProcedures();
        loadAreas();
    }, [loadProcedures, loadAreas]);

    return {
        procedures,
        areas,
        loading,
        pagination,
        filters,
        loadProcedures,
        createProcedure,
        updateProcedure,
        deleteProcedure,
        getProcedureById,
        searchProcedures,
        changePage,
        changePageSize,
        resetFilters,
        updateFilters
    };
};
