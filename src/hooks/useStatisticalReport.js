import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchSummaryReport,
  exportSummaryReportExcel,
  fetchFieldReport,
  exportFieldReportExcel,
  fetchStatusReport,
  exportStatusReportExcel
} from '../features/statisticalReport/statisticalReportThunk';
import {
  selectSummaryReport,
  selectFieldReport,
  selectStatusReport,
  selectStatisticalReportLoading,
  selectStatisticalReportError,
  selectStatisticalReportExportLoading,
  selectStatisticalReportExportError,
  selectStatisticalReportFilters
} from '../features/statisticalReport/statisticalReportSelectors';
import {
  clearError,
  setFilters,
  resetFilters,
  clearSummaryReport,
  clearFieldReport,
  clearStatusReport
} from '../features/statisticalReport/statisticalReportSlice';

export const useStatisticalReport = () => {
  const dispatch = useDispatch();

  const summaryReport = useSelector(selectSummaryReport);
  const fieldReport = useSelector(selectFieldReport);
  const statusReport = useSelector(selectStatusReport);
  const loading = useSelector(selectStatisticalReportLoading);
  const error = useSelector(selectStatisticalReportError);
  const exportLoading = useSelector(selectStatisticalReportExportLoading);
  const exportError = useSelector(selectStatisticalReportExportError);
  const currentFilters = useSelector(selectStatisticalReportFilters);

  const loadSummaryReport = useCallback((params = {}) => {
    return dispatch(fetchSummaryReport(params)).unwrap();
  }, [dispatch]);

  const exportSummaryExcel = useCallback(async (params = {}) => {
    const blob = await dispatch(exportSummaryReportExcel(params)).unwrap();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-tong-hop-${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return blob;
  }, [dispatch]);

  const loadFieldReport = useCallback((params = {}) => {
    return dispatch(fetchFieldReport(params)).unwrap();
  }, [dispatch]);

  const exportFieldExcel = useCallback(async (params = {}) => {
    const blob = await dispatch(exportFieldReportExcel(params)).unwrap();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-linh-vuc-${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return blob;
  }, [dispatch]);

  const loadStatusReport = useCallback((params = {}) => {
    return dispatch(fetchStatusReport(params)).unwrap();
  }, [dispatch]);

  const exportStatusExcel = useCallback(async (params = {}) => {
    const blob = await dispatch(exportStatusReportExcel(params)).unwrap();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-trang-thai-${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return blob;
  }, [dispatch]);

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const clearStatisticalReportError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSummaryData = useCallback(() => {
    dispatch(clearSummaryReport());
  }, [dispatch]);

  const clearFieldData = useCallback(() => {
    dispatch(clearFieldReport());
  }, [dispatch]);

  const clearStatusData = useCallback(() => {
    dispatch(clearStatusReport());
  }, [dispatch]);

  return {
    summaryReport,
    fieldReport,
    statusReport,
    loading,
    error,
    exportLoading,
    exportError,
    filters: currentFilters,

    loadSummaryReport,
    exportSummaryExcel,
    loadFieldReport,
    exportFieldExcel,
    loadStatusReport,
    exportStatusExcel,
    updateFilters,
    clearFilters,
    clearError: clearStatisticalReportError,
    clearSummaryData,
    clearFieldData,
    clearStatusData
  };
};