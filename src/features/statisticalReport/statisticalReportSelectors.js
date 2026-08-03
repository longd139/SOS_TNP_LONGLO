export const selectPhanAnhReport = (state) => state.statisticalReport?.phanAnhReport || null;

export const selectThuTucReport = (state) => state.statisticalReport?.thuTucReport || null;

export const selectTinTucReport = (state) => state.statisticalReport?.tinTucReport || null;

export const selectStatisticalReportLoading = (state) => state.statisticalReport?.loading || false;
export const selectStatisticalReportError = (state) => state.statisticalReport?.error || null;
export const selectStatisticalReportExportLoading = (state) => state.statisticalReport?.exportLoading || false;
export const selectStatisticalReportExportError = (state) => state.statisticalReport?.exportError || null;
export const selectStatisticalReportFilters = (state) => state.statisticalReport?.filters || {
  from: '',
  to: '',
  id_linh_vuc: null
};