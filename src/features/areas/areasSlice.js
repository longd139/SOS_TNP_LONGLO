import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchAreas, 
    createArea, 
    updateArea, 
    deleteArea, 
    updateAreaStatus, 
    fetchAreaById, 
    fetchAreasPagination 
} from './areasThunks';

const initialState = {
    areas: [],
    currentArea: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0
    },
    filters: {
        search: '',
        isActive: true
    }
};

const areasSlice = createSlice({
    name: 'areas',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                search: '',
                isActive: true
            };
        },
        clearCurrentArea: (state) => {
            state.currentArea = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.areas = action.payload;
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách lĩnh vực thất bại';
            })

            .addCase(createArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createArea.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.areas.unshift(action.payload);
                }
            })
            .addCase(createArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Tạo lĩnh vực thất bại';
            })

            .addCase(updateArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArea.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.areas.findIndex(area => area.id === action.payload.id);
                    if (index !== -1) {
                        state.areas[index] = action.payload;
                    }
                }
            })
            .addCase(updateArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật lĩnh vực thất bại';
            })

            .addCase(deleteArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArea.fulfilled, (state, action) => {
                state.loading = false;
                state.areas = state.areas.filter(area => area.id !== action.payload);
            })
            .addCase(deleteArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa lĩnh vực thất bại';
            })

            .addCase(updateAreaStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAreaStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { id, isActive } = action.payload;
                const area = state.areas.find(area => area.id === id);
                if (area) {
                    area.is_active = isActive;
                }
            })
            .addCase(updateAreaStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật trạng thái lĩnh vực thất bại';
            })

            .addCase(fetchAreaById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreaById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentArea = action.payload;
            })
            .addCase(fetchAreaById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy thông tin lĩnh vực thất bại';
            })

            .addCase(fetchAreasPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreasPagination.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.areas = action.payload.data || [];
                    if (action.payload.pagination) {
                        state.pagination = {
                            currentPage: action.payload.pagination.currentPage || 1,
                            pageSize: action.payload.pagination.pageSize || 10,
                            totalPages: action.payload.pagination.totalPages || 0,
                            totalItems: action.payload.pagination.totalItems || 0
                        };
                    }
                }
            })
            .addCase(fetchAreasPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách lĩnh vực thất bại';
            });
    }
});

export const { clearError, setFilters, clearFilters, clearCurrentArea } = areasSlice.actions;
export default areasSlice.reducer;

