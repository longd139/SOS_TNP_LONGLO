import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchPhanAnhReport,
  exportPhanAnhReportExcel,
  fetchThuTucReport,
  exportThuTucReportExcel,
  fetchTinTucReport,
  exportTinTucReportExcel
} from '../features/statisticalReport/statisticalReportThunk';
import {
  selectPhanAnhReport,
  selectThuTucReport,
  selectTinTucReport,
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
  clearPhanAnhReport,
  clearThuTucReport,
  clearTinTucReport
} from '../features/statisticalReport/statisticalReportSlice';

export const useStatisticalReport = () => {
  const dispatch = useDispatch();

  const phanAnhReport = useSelector(selectPhanAnhReport);
  const thuTucReport = useSelector(selectThuTucReport);
  const tinTucReport = useSelector(selectTinTucReport);
  const loading = useSelector(selectStatisticalReportLoading);
  const error = useSelector(selectStatisticalReportError);
  const exportLoading = useSelector(selectStatisticalReportExportLoading);
  const exportError = useSelector(selectStatisticalReportExportError);
  const currentFilters = useSelector(selectStatisticalReportFilters);

  const loadPhanAnhReport = useCallback((params = {}) => {
    return dispatch(fetchPhanAnhReport(params)).unwrap();
  }, [dispatch]);

  const exportPhanAnhExcel = useCallback(async (params = {}) => {
    const blob = await dispatch(exportPhanAnhReportExcel(params)).unwrap();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-phan-anh-${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return blob;
  }, [dispatch]);

  const loadThuTucReport = useCallback((params = {}) => {
    return dispatch(fetchThuTucReport(params)).unwrap();
  }, [dispatch]);

  const exportThuTucExcel = useCallback(async (params = {}) => {
    const blob = await dispatch(exportThuTucReportExcel(params)).unwrap();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-thu-tuc-${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return blob;
  }, [dispatch]);

  const loadTinTucReport = useCallback((params = {}) => {
    return dispatch(fetchTinTucReport(params)).unwrap();
  }, [dispatch]);

  const exportTinTucExcel = useCallback(async (params = {}) => {
    const blob = await dispatch(exportTinTucReportExcel(params)).unwrap();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-tin-tuc-${new Date().getTime()}.xlsx`;
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

  const clearPhanAnhData = useCallback(() => {
    dispatch(clearPhanAnhReport());
  }, [dispatch]);

  const clearThuTucData = useCallback(() => {
    dispatch(clearThuTucReport());
  }, [dispatch]);

  const clearTinTucData = useCallback(() => {
    dispatch(clearTinTucReport());
  }, [dispatch]);

  return {
    phanAnhReport,
    thuTucReport,
    tinTucReport,
    loading,
    error,
    exportLoading,
    exportError,
    filters: currentFilters,

    loadPhanAnhReport,
    loadThuTucReport,
    loadTinTucReport,

    exportPhanAnhExcel,
    exportThuTucExcel,
    exportTinTucExcel,

    updateFilters,
    clearFilters,

    clearError: clearStatisticalReportError,
    clearPhanAnhData,
    clearThuTucData,
    clearTinTucData
  };
};