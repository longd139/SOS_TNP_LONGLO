export const selectSummaryReport = (state) => state.statisticalReport?.summaryReport || null;
export const selectFieldReport = (state) => state.statisticalReport?.fieldReport || [];
export const selectStatusReport = (state) => state.statisticalReport?.statusReport || [];
export const selectStatisticalReportLoading = (state) => state.statisticalReport?.loading || false;
export const selectStatisticalReportError = (state) => state.statisticalReport?.error || null;
export const selectStatisticalReportExportLoading = (state) => state.statisticalReport?.exportLoading || false;
export const selectStatisticalReportExportError = (state) => state.statisticalReport?.exportError || null;
export const selectStatisticalReportFilters = (state) => state.statisticalReport?.filters || {
  from: '',
  to: ''
};