import { createSelector } from "@reduxjs/toolkit";

export const selectReportArea = (state) => state.reportArea;
export const selectReportAreaList = (state) => state.reportArea?.reportAreas || [];
export const selectReportAreaLoading = (state) => state.reportArea?.loading || false;
export const selectReportAreaError = (state) => state.reportArea?.error || null;
export const selectReportAreaPagination = (state) => state.reportArea?.pagination || {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
};
export const selectCurrentReportArea = (state) => state.reportArea?.currentReportArea || null;
export const selectReportAreaFilters = (state) => state.reportArea?.filters || { search: '' };
export const selectShowActive = (state) => state.reportArea?.showActive ?? true;

export const selectReportAreaStatistics = createSelector(
    [selectReportAreaList],
    (reportAreas) => {
        const total = reportAreas.length;
        const active = reportAreas.filter(item => item.isActive === true).length;
        const inactive = reportAreas.filter(item => item.isActive === false).length;

        return {
            total,
            active,
            inactive
        };
    }
);
