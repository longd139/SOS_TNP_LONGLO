import { createSlice } from '@reduxjs/toolkit';
import { fetchAuditLogs, fetchAuditLogDetail } from './auditLogThunks';

const initialState = {
  auditLogs: [],
  selectedAuditLog: null,
  loading: false,
  detailLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
  },
  filters: {
    page: 1,
    size: 10,
    from: '',
    to: '',
    search: ''
  }
};

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAuditLog: (state) => {
      state.selectedAuditLog = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        size: 10,
        from: '',
        to: '',
        search: ''
      };
    },
    resetAuditLogState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch audit logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.auditLogs = [];
      })
      // Fetch audit log detail
      .addCase(fetchAuditLogDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedAuditLog = action.payload;
        state.error = null;
      })
      .addCase(fetchAuditLogDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearSelectedAuditLog,
  updateFilters,
  resetFilters,
  resetAuditLogState
} = auditLogSlice.actions;

export default auditLogSlice.reducer;
