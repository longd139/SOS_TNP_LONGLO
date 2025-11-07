import { createSelector } from "@reduxjs/toolkit";

export const selectReportArea = (state) => state.reportAreas;
export const selectReportAreaList = (state) => state.reportAreas.reportAreas;
export const selectReportAreaLoading = (state) => state.reportAreas.loading;
export const selectReportAreaError = (state) => state.reportAreas.error;
export const selectReportAreaPagination = (state) => state.reportAreas.pagination;
export const selectCurrentReportArea = (state) => state.reportAreas.currentReportArea;
export const selectReportAreaFilters = (state) => state.reportAreas.filters;
export const selectShowActive = (state) => state.reportAreas.showActive;

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
