import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchReportPagination,
    fetchHistoryStatus,
    fetchExtent,
    fetchStatusReport,
    fetchStatisticReport,
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
    ,selectReportStatistic
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
    const statistic = useSelector(selectReportStatistic);

    const loadReports = useCallback((params = {}) => {
        return dispatch(fetchReportPagination(params)).unwrap();
    }, [dispatch]);

    const loadReportById = useCallback((reportId) => {
        return dispatch(fetchReportById(reportId)).unwrap();
    }, [dispatch]);

    const loadHistoryStatus = useCallback((reportId) => {
        return dispatch(fetchHistoryStatus(reportId)).unwrap();
    }, [dispatch]);

    const loadExtent = useCallback(() => {
        return dispatch(fetchExtent()).unwrap();
    }, [dispatch]);

    const loadStatisticReport = useCallback(() => {
        return dispatch(fetchStatisticReport()).unwrap();
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
        updateStatus,
        statistic,
        loadStatisticReport
    };
};
