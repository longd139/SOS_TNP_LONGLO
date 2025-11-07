import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchReportPagination,
    fetchHistoryStatus,
    fetchExtent,
    fetchStatusReport,
    fetchReportById,
    updateReportStatus
} from '../features/reports/reportThunk';
import {
    selectReports,
    selectCurrentReport,
    selectHistoryStatus,
    selectExtent,
    selectStatusReport,
    selectReportLoading,
    selectReportError,
    selectReportPagination,
    selectReportFilters
} from '../features/reports/reportSelectors';
import {
    clearError,
    setCurrentReport,
    clearCurrentReport,
    setFilters,
    resetFilters
} from '../features/reports/reportSlice';

export const useReports = ({ autoFetch = false, filters = {} } = {}) => {
    const dispatch = useDispatch();

    const reports = useSelector(selectReports);
    const currentReport = useSelector(selectCurrentReport);
    const historyStatus = useSelector(selectHistoryStatus);
    const extent = useSelector(selectExtent);
    const statusReport = useSelector(selectStatusReport);
    const loading = useSelector(selectReportLoading);
    const error = useSelector(selectReportError);
    const pagination = useSelector(selectReportPagination);
    const currentFilters = useSelector(selectReportFilters);

    const loadReports = useCallback((params = {}) => {
        const requestParams = {
            page: params.page || pagination.currentPage,
            size: params.size || pagination.pageSize,
            idLinhVucPhanAnh: params.idLinhVucPhanAnh || currentFilters.idLinhVucPhanAnh || '',
            trangThai: params.trangThai || currentFilters.trangThai || '',
            mucDo: params.mucDo || currentFilters.mucDo || '',
            maPhanAnh: params.maPhanAnh || currentFilters.maPhanAnh || ''
        };

        return dispatch(fetchReportPagination(requestParams)).unwrap();
    }, [dispatch, pagination.currentPage, pagination.pageSize, currentFilters.idLinhVucPhanAnh, currentFilters.trangThai, currentFilters.mucDo, currentFilters.maPhanAnh]);

    const loadReportById = useCallback((reportId) => {
        return dispatch(fetchReportById(reportId)).unwrap();
    }, [dispatch]);

    const loadHistoryStatus = useCallback((reportId) => {
        return dispatch(fetchHistoryStatus(reportId)).unwrap();
    }, [dispatch]);

    const loadExtent = useCallback(() => {
        return dispatch(fetchExtent()).unwrap();
    }, [dispatch]);

    const loadStatusReport = useCallback(() => {
        return dispatch(fetchStatusReport()).unwrap();
    }, [dispatch]);

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const clearFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const setSelectedReport = useCallback((report) => {
        dispatch(setCurrentReport(report));
    }, [dispatch]);

    const clearSelectedReport = useCallback(() => {
        dispatch(clearCurrentReport());
    }, [dispatch]);

    const clearReportError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const updateStatus = useCallback((reportId, statusData) => {
        return dispatch(updateReportStatus({ reportId, statusData })).unwrap();
    }, [dispatch]);

    return {
        reports,
        currentReport,
        historyStatus,
        extent,
        statusReport,
        loading,
        error,
        pagination,
        filters: currentFilters,

        loadReports,
        loadReportById,
        loadHistoryStatus,
        loadExtent,
        loadStatusReport,
        updateFilters,
        clearFilters,
        setSelectedReport,
        clearSelectedReport,
        clearError: clearReportError,
        updateStatus
    };
};
