export const selectReports = (state) => state.reports?.reports || [];
export const selectCurrentReport = (state) => state.reports?.currentReport || null;
export const selectHistoryStatus = (state) => state.reports?.historyStatus || [];
export const selectExtent = (state) => state.reports?.extent || null;
export const selectStatusReport = (state) => state.reports?.statusReport || null;
export const selectReportLoading = (state) => state.reports?.loading || false;
export const selectReportError = (state) => state.reports?.error || null;
export const selectReportPagination = (state) => state.reports?.pagination || {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
};
export const selectReportFilters = (state) => state.reports?.filters || {
    maPhanAnh: '',
    idLinhVucPhanAnh: '',
    trangThai: '',
    mucDo: ''
};
