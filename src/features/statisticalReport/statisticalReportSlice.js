import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPhanAnhReport,
  exportPhanAnhReportExcel,
  fetchThuTucReport,
  exportThuTucReportExcel,
  fetchTinTucReport,
  exportTinTucReportExcel
} from "./statisticalReportThunk";

const initialState = {
  phanAnhReport: null,
  thuTucReport: null,
  tinTucReport: null,
  
  loading: false,
  error: null,
  exportLoading: false,
  exportError: null,
  filters: {
    from: '',
    to: '',
    id_linh_vuc: null
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
    clearPhanAnhReport: (state) => {
      state.phanAnhReport = null;
    },
    clearThuTucReport: (state) => {
      state.thuTucReport = null;
    },
    clearTinTucReport: (state) => {
      state.tinTucReport = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhanAnhReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhanAnhReport.fulfilled, (state, action) => {
        state.loading = false;
        state.phanAnhReport = action.payload;
      })
      .addCase(fetchPhanAnhReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy báo cáo phản ánh thất bại';
      })

      .addCase(exportPhanAnhReportExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportPhanAnhReportExcel.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportPhanAnhReportExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Xuất báo cáo phản ánh thất bại';
      })

      .addCase(fetchThuTucReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThuTucReport.fulfilled, (state, action) => {
        state.loading = false;
        state.thuTucReport = action.payload;
      })
      .addCase(fetchThuTucReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy báo cáo thủ tục thất bại';
      })

      .addCase(exportThuTucReportExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportThuTucReportExcel.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportThuTucReportExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Xuất báo cáo thủ tục thất bại';
      })

      .addCase(fetchTinTucReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTinTucReport.fulfilled, (state, action) => {
        state.loading = false;
        state.tinTucReport = action.payload;
      })
      .addCase(fetchTinTucReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy báo cáo tin tức thất bại';
      })

      .addCase(exportTinTucReportExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportTinTucReportExcel.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportTinTucReportExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Xuất báo cáo tin tức thất bại';
      });
  }
});

export const {
  clearError,
  setFilters,
  resetFilters,
  clearPhanAnhReport,
  clearThuTucReport,
  clearTinTucReport
} = statisticalReportSlice.actions;

export default statisticalReportSlice.reducer;