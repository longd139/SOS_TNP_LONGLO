import { createSlice } from '@reduxjs/toolkit';
import {
    fetchGovernment,
    createGovernment,
    updateGovernment,
    deleteGovernment,
    updateGovernmentStatus,
    fetchGovernmentById,
    fetchGovernmentPagination
} from './governmentThunks';

const initialState = {
    governments: [],
    currentGovernment: null,
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

const governmentSlice = createSlice({
    name: 'government',
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
        clearCurrentGovernment: (state) => {
            state.currentGovernment = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGovernment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGovernment.fulfilled, (state, action) => {
                state.loading = false;
                state.governments = action.payload;
            })
            .addCase(fetchGovernment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách cơ sở dịch vụ công thất bại';
            })

            .addCase(createGovernment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGovernment.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.governments.unshift(action.payload);
                }
            })
            .addCase(createGovernment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Tạo cơ sở dịch vụ công thất bại';
            })

            .addCase(updateGovernment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGovernment.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.governments.findIndex(gov => gov.id === action.payload.id);
                    if (index !== -1) {
                        state.governments[index] = action.payload;
                    }
                }
            })
            .addCase(updateGovernment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật cơ sở dịch vụ công thất bại';
            })

            .addCase(deleteGovernment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGovernment.fulfilled, (state, action) => {
                state.loading = false;
                state.governments = state.governments.filter(gov => gov.id !== action.payload);
            })
            .addCase(deleteGovernment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa cơ sở dịch vụ công thất bại';
            })

            .addCase(updateGovernmentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGovernmentStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { id, isActive } = action.payload;
                const government = state.governments.find(gov => gov.id === id);
                if (government) {
                    government.is_active = isActive;
                }
            })
            .addCase(updateGovernmentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật trạng thái cơ sở dịch vụ công thất bại';
            })

            .addCase(fetchGovernmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGovernmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGovernment = action.payload;
            })
            .addCase(fetchGovernmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy thông tin cơ sở dịch vụ công thất bại';
            })

            .addCase(fetchGovernmentPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGovernmentPagination.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.governments = action.payload.data || [];
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
            .addCase(fetchGovernmentPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách cơ sở dịch vụ công thất bại';
            });
    }
});

export const { clearError, setFilters, clearFilters, clearCurrentGovernment } = governmentSlice.actions;
export default governmentSlice.reducer;
