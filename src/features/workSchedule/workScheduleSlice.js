import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchWorkSchedules, 
    importWorkSchedule, 
    updateWorkScheduleStatus, 
    deleteWorkSchedule, 
    getTemplateWorkSchedule,
    createWorkSchedule,
    updateWorkSchedule,
    fetchWorkSchedulesPagination
} from './workScheduleThunks';

const initialState = {
    schedules: [],
    allSchedules: [],
    currentSchedule: null,
    loading: false,
    error: null,
    filters: {
        weekYear: null,
        monthYear: null,
        date: null,
        isActive: null 
    },
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    showActive: true,
    pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0
    },
    counts: {
        all: 0,
        active: 0,
        inactive: 0
    }
};

const workScheduleSlice = createSlice({
    name: 'workSchedule',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentSchedule: (state, action) => {
            state.currentSchedule = action.payload;
        },
        clearCurrentSchedule: (state) => {
            state.currentSchedule = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        setSelectedMonth: (state, action) => {
            state.selectedMonth = action.payload;
            state.allSchedules = [];
        },
        setSelectedYear: (state, action) => {
            state.selectedYear = action.payload;
            state.allSchedules = [];
        },
        setShowActive: (state, action) => {
            state.showActive = action.payload;
        },
        addSchedule: (state, action) => {
            state.schedules.unshift(action.payload);
        },
        updateSchedule: (state, action) => {
            const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
            if (index !== -1) {
                state.schedules[index] = action.payload;
            }
        },
        removeSchedule: (state, action) => {
            state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload);
        },
        setCounts: (state, action) => {
            state.counts = { ...state.counts, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.allSchedules = action.payload || [];
                state.schedules = action.payload || [];
            })
            .addCase(fetchWorkSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách lịch tiếp dân thất bại';
            })

            .addCase(importWorkSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(importWorkSchedule.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(importWorkSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Import lịch tiếp dân thất bại';
            })

            .addCase(updateWorkScheduleStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorkScheduleStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { scheduleId, isActive } = action.payload;
                const index = state.schedules.findIndex(schedule => schedule.id === scheduleId);
                if (index !== -1) {
                    state.schedules[index].isActive = isActive;
                }
            })
            .addCase(updateWorkScheduleStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật trạng thái lịch tiếp dân thất bại';
            })

            .addCase(deleteWorkSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWorkSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload);
            })
            .addCase(deleteWorkSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa lịch tiếp dân thất bại';
            })

            .addCase(getTemplateWorkSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTemplateWorkSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.template = action.payload.data;
            })
            .addCase(getTemplateWorkSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy template lịch tiếp dân thất bại';
            })
            .addCase(createWorkSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorkSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.schedules.unshift(action.payload);
            })
            .addCase(createWorkSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Tạo lịch tiếp dân thất bại';
            })
            .addCase(updateWorkSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorkSchedule.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
                if (index !== -1) {
                    state.schedules[index] = action.payload;
                }
            })
            .addCase(updateWorkSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật lịch tiếp dân thất bại';
            })
            
            .addCase(fetchWorkSchedulesPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkSchedulesPagination.fulfilled, (state, action) => {
                state.loading = false;
                const pageSize = action.payload.pagination?.pageSize || 10;
                
                // If page size is 10 or less, this is for the list display
                // If page size is larger, this is for calendar highlighting
                if (pageSize <= 10) {
                    // Update schedules for list display
                    state.schedules = action.payload.data || [];
                    state.pagination = action.payload.pagination || {
                        currentPage: 1,
                        pageSize: 10,
                        totalPages: 1,
                        totalItems: 0
                    };
                }
                
                // Always update allSchedules for calendar highlighting
                if (pageSize > 10) {
                    // Large fetch for calendar - replace allSchedules
                    state.allSchedules = action.payload.data || [];
                } else if (action.payload.data && action.payload.data.length > 0) {
                    // Small fetch - merge into allSchedules
                    const existingIds = new Set(state.allSchedules.map(s => s.id));
                    const newSchedules = action.payload.data.filter(s => !existingIds.has(s.id));
                    state.allSchedules = [...state.allSchedules, ...newSchedules];
                }
            })
            .addCase(fetchWorkSchedulesPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách lịch tiếp dân thất bại';
            });
    }
});

export const { 
    clearError, 
    setCurrentSchedule, 
    clearCurrentSchedule, 
    setFilters, 
    resetFilters,
    setSelectedMonth,
    setSelectedYear,
    setShowActive,
    addSchedule,
    updateSchedule,
    removeSchedule,
    setCounts
} = workScheduleSlice.actions;

export default workScheduleSlice.reducer;