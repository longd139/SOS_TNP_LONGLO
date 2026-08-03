import { createSelector } from '@reduxjs/toolkit';

export const selectProceduresState = (state) => state.procedures;
export const selectProcedures = (state) => state.procedures.procedures;
export const selectAreas = (state) => state.procedures.areas;
export const selectCurrentProcedure = (state) => state.procedures.currentProcedure;
export const selectLoading = (state) => state.procedures.loading;
export const selectAreasLoading = (state) => state.procedures.areasLoading;
export const selectError = (state) => state.procedures.error;
export const selectPagination = (state) => state.procedures.pagination;
export const selectFilters = (state) => state.procedures.filters;
export const selectShowActive = (state) => state.procedures.showActive;

export const selectProceduresWithAreas = createSelector(
    [selectProcedures, selectAreas],
    (procedures, areas) => {
        return procedures.map(procedure => {
            const procedureAreas = procedure.danhSachLinhVucIds?.map(id => 
                areas.find(area => area.id === id)
            ).filter(Boolean) || [];

            return {
                ...procedure,
                areas: procedureAreas
            };
        });
    }
);

export const selectFilteredProcedures = createSelector(
    [selectProcedures, selectFilters],
    (procedures, filters) => {
        let filtered = [...procedures];

        if (filters.searchKeyword) {
            const keyword = filters.searchKeyword.toLowerCase();
            filtered = filtered.filter(p => 
                p.ten_thu_tuc?.toLowerCase().includes(keyword) ||
                p.ma_thu_tuc?.toLowerCase().includes(keyword)
            );
        }

        if (filters.selectedDomain) {
            filtered = filtered.filter(p => 
                p.danhSachLinhVucIds?.includes(filters.selectedDomain)
            );
        }

        return filtered;
    }
);

export const selectPaginationInfo = createSelector(
    [selectPagination],
    (pagination) => ({
        ...pagination,
        hasNextPage: pagination.current < pagination.totalPages,
        hasPreviousPage: pagination.current > 1,
        startItem: (pagination.current - 1) * pagination.pageSize + 1,
        endItem: Math.min(pagination.current * pagination.pageSize, pagination.total)
    })
);
