import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  selectAuditLogs,
  selectSelectedAuditLog,
  selectLoading,
  selectDetailLoading,
  selectError,
  selectPagination,
  selectFilters,
  selectPaginationInfo,
  selectActiveFiltersCount
} from '../features/auditLog/auditLogSelectors';
import {
  fetchAuditLogs,
  fetchAuditLogDetail
} from '../features/auditLog/auditLogThunks';
import {
  clearError,
  clearSelectedAuditLog,
  updateFilters,
  resetFilters,
  resetAuditLogState
} from '../features/auditLog/auditLogSlice';

const useAuditLog = () => {
  const dispatch = useDispatch();

  const auditLogs = useSelector(selectAuditLogs);
  const selectedAuditLog = useSelector(selectSelectedAuditLog);
  const loading = useSelector(selectLoading);
  const detailLoading = useSelector(selectDetailLoading);
  const error = useSelector(selectError);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const paginationInfo = useSelector(selectPaginationInfo);
  const activeFiltersCount = useSelector(selectActiveFiltersCount);

  const fetchLogs = useCallback((params) => {
    return dispatch(fetchAuditLogs(params));
  }, [dispatch]);

  const fetchDetail = useCallback((id) => {
    return dispatch(fetchAuditLogDetail(id));
  }, [dispatch]);

  const handleFilterChange = useCallback((newFilters) => {
    dispatch(updateFilters({ ...newFilters, page: 1 }));
    dispatch(fetchAuditLogs({ ...filters, ...newFilters, page: 1 }));
  }, [dispatch, filters]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(fetchAuditLogs({
      page: 1,
      size: 10,
      from: '',
      to: '',
      search: ''
    }));
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    const newFilters = { ...filters, page };
    dispatch(updateFilters(newFilters));
    dispatch(fetchAuditLogs(newFilters));
  }, [dispatch, filters]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSelected = useCallback(() => {
    dispatch(clearSelectedAuditLog());
  }, [dispatch]);

  const handleResetState = useCallback(() => {
    dispatch(resetAuditLogState());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAuditLogs(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    auditLogs,
    selectedAuditLog,
    loading,
    detailLoading,
    error,
    pagination,
    filters,
    paginationInfo,
    activeFiltersCount,

    fetchLogs,
    fetchDetail,
    handleFilterChange,
    handleResetFilters,
    handlePageChange,
    handleClearError,
    handleClearSelected,
    handleResetState
  };
};

export default useAuditLog;
