import { createSlice } from "@reduxjs/toolkit";
import { 
    fetchHistoryStatus, 
    fetchReportPagination, 
    fetchExtent, 
    fetchStatusReport, 
    fetchReportById,
    updateReportStatus
} from "./reportThunk";

const DEFAULT_PAGE_SIZE = 10;

const initialState = {
    reports: [],
    currentReport: null,
    historyStatus: [],
    extent: null,
    statusReport: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
        totalItems: 0
    },
    filters: {
        maPhanAnh: '',
        idLinhVucPhanAnh: '',
        trangThai: '',
        mucDo: ''
    }
}

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentReport: (state, action) => {
            state.currentReport = action.payload;
        },
        clearCurrentReport: (state) => {
            state.currentReport = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReportPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportPagination.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload.content || [];
                state.pagination = {
                    currentPage: action.payload.page,
                    pageSize: action.payload.size,
                    totalPages: action.payload.totalPages,
                    totalItems: action.payload.totalElements
                };
            })
            .addCase(fetchReportPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy danh sách phản ánh thất bại';
            })
            
            .addCase(fetchHistoryStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHistoryStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.historyStatus = action.payload || [];
            })
            .addCase(fetchHistoryStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy lịch sử trạng thái thất bại';
            })
            
            .addCase(fetchExtent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExtent.fulfilled, (state, action) => {
                state.loading = false;
                state.extent = action.payload;
            })
            .addCase(fetchExtent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy mức độ phản ánh thất bại';
            })
            
            .addCase(fetchStatusReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatusReport.fulfilled, (state, action) => {
                state.loading = false;
                state.statusReport = action.payload;
            })
            .addCase(fetchStatusReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy trạng thái phản ánh thất bại';
            })
            
            .addCase(fetchReportById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReport = action.payload;
            })
            .addCase(fetchReportById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy phản ánh thất bại';
            })
            
            .addCase(updateReportStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentReport && state.currentReport.id === action.payload.reportId) {
                    state.currentReport = { ...state.currentReport, ...action.payload.updatedData };
                }
                const reportIndex = state.reports.findIndex(r => r.id === action.payload.reportId);
                if (reportIndex !== -1) {
                    state.reports[reportIndex] = { ...state.reports[reportIndex], ...action.payload.updatedData };
                }
            })
            .addCase(updateReportStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Cập nhật trạng thái phản ánh thất bại';
            });
    }
})

export const {
    clearError,
    setCurrentReport,
    clearCurrentReport,
    setFilters,
    resetFilters
} = reportSlice.actions;

export default reportSlice.reducer;