import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSummaryReport,
  exportSummaryReportExcel,
  fetchFieldReport,
  exportFieldReportExcel,
  fetchStatusReport,
  exportStatusReportExcel
} from "./statisticalReportThunk";

const initialState = {
  summaryReport: null,
  fieldReport: [],
  statusReport: [],
  loading: false,
  error: null,
  exportLoading: false,
  exportError: null,
  filters: {
    from: '',
    to: ''
  }
};

const statisticalReportSlice = createSlice({
  name: 'statisticalReport',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.exportError = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSummaryReport: (state) => {
      state.summaryReport = null;
    },
    clearFieldReport: (state) => {
      state.fieldReport = [];
    },
    clearStatusReport: (state) => {
      state.statusReport = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummaryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummaryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryReport = action.payload;
      })
      .addCase(fetchSummaryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy báo cáo tổng hợp thất bại';
      })

      .addCase(exportSummaryReportExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportSummaryReportExcel.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportSummaryReportExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Xuất báo cáo tổng hợp thất bại';
      })

      .addCase(fetchFieldReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldReport.fulfilled, (state, action) => {
        state.loading = false;
        state.fieldReport = action.payload || [];
      })
      .addCase(fetchFieldReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy báo cáo lĩnh vực thất bại';
      })

      .addCase(exportFieldReportExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportFieldReportExcel.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportFieldReportExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Xuất báo cáo lĩnh vực thất bại';
      })

      .addCase(fetchStatusReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusReport.fulfilled, (state, action) => {
        state.loading = false;
        state.statusReport = action.payload || [];
      })
      .addCase(fetchStatusReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy báo cáo trạng thái thất bại';
      })

      .addCase(exportStatusReportExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportStatusReportExcel.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportStatusReportExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Xuất báo cáo trạng thái thất bại';
      });
  }
});

export const {
  clearError,
  setFilters,
  resetFilters,
  clearSummaryReport,
  clearFieldReport,
  clearStatusReport
} = statisticalReportSlice.actions;

export default statisticalReportSlice.reducer;