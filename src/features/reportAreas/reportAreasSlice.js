import { createSlice } from "@reduxjs/toolkit";
import { createReportArea, deleteReportArea, fetchReportAreaById, fetchReportAreas, updateReportArea, updateStatusReportArea } from "./reportAreasThunk";

const DEFAULT_PAGE_SIZE = 10;

const initialState = {
    reportAreas: [],
    currentReportArea: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
        totalItems: 0
    },
    filters: {
        search: ''
    },
    showActive: true
}

const reportAreaSlice = createSlice({
    name: "reportAreas",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentReportArea: (state, action) => {
            state.currentReportArea = action.payload;
        },
        clearCurrentReportArea: (state) => {
            state.currentReportArea = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        setShowActive: (state, action) => {
            state.showActive = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReportAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.reportAreas = action.payload.content || [];
                state.pagination = {
                    currentPage: action.payload.page,
                    pageSize: action.payload.size,
                    totalPages: action.payload.totalPages,
                    totalItems: action.payload.totalElements
                };
            })
            .addCase(fetchReportAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy danh sách lĩnh vực phản ánh thất bại';
            })

            .addCase(createReportArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReportArea.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.reportAreas.unshift(action.payload);
                    state.pagination.totalItems += 1;
                }
            })
            .addCase(createReportArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Tạo lĩnh vực phản ánh thất bại';
            })

            .addCase(updateReportArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReportArea.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reportAreas.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.reportAreas[index] = action.payload;
                }
            })
            .addCase(updateReportArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Cập nhật lĩnh vực phản ánh thất bại';
            })

            .addCase(deleteReportArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReportArea.fulfilled, (state, action) => {
                state.loading = false;
                state.reportAreas = state.reportAreas.filter(item => item.id !== action.payload.reportAreaId);
                state.pagination.totalItems -= 1;
            })
            .addCase(deleteReportArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Xóa lĩnh vực phản ánh thất bại';
            })

            .addCase(updateStatusReportArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStatusReportArea.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reportAreas.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.reportAreas[index] = action.payload;
                }
            })
            .addCase(updateStatusReportArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Cập nhật trạng thái lĩnh vực phản ánh thất bại';
            })
            .addCase(fetchReportAreaById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportAreaById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReportArea = action.payload;
            })
            .addCase(fetchReportAreaById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy lĩnh vực phản ánh thất bại';
            });
    }
})

export const {
    clearError,
    setCurrentReportArea,
    clearCurrentReportArea,
    setFilters,
    resetFilters,
    setShowActive
} = reportAreaSlice.actions;

export default reportAreaSlice.reducer;