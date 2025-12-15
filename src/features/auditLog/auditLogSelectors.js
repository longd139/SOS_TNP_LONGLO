import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const selectAuditLogState = (state) => state.auditLog;
export const selectAuditLogs = (state) => state.auditLog.auditLogs;
export const selectSelectedAuditLog = (state) => state.auditLog.selectedAuditLog;
export const selectLoading = (state) => state.auditLog.loading;
export const selectDetailLoading = (state) => state.auditLog.detailLoading;
export const selectError = (state) => state.auditLog.error;
export const selectPagination = (state) => state.auditLog.pagination;
export const selectFilters = (state) => state.auditLog.filters;

// Memoized selectors
export const selectAuditLogsWithFormatting = createSelector(
  [selectAuditLogs],
  (auditLogs) => {
    return auditLogs.map(log => ({
      ...log,
      formattedTimestamp: log.timestamp ? new Date(log.timestamp).toLocaleString('vi-VN') : '',
      actionBadge: getActionBadge(log.action)
    }));
  }
);

export const selectPaginationInfo = createSelector(
  [selectPagination],
  (pagination) => ({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    hasNextPage: pagination.currentPage < pagination.totalPages,
    hasPrevPage: pagination.currentPage > 1
  })
);

export const selectActiveFiltersCount = createSelector(
  [selectFilters],
  (filters) => {
    let count = 0;
    if (filters.search && filters.search.trim()) count++;
    if (filters.from) count++;
    if (filters.to) count++;
    return count;
  }
);

// Helper function
const getActionBadge = (action) => {
  const badges = {
    'CREATE': { text: 'Tạo mới', color: 'green' },
    'UPDATE': { text: 'Cập nhật', color: 'blue' },
    'DELETE': { text: 'Xóa', color: 'red' }
  };
  return badges[action] || { text: action, color: 'gray' };
};
