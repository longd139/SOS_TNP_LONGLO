import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchWorkSchedules, 
    importWorkSchedule, 
    updateWorkScheduleStatus, 
    deleteWorkSchedule, 
    getTemplateWorkSchedule
} from './workScheduleThunks';

const initialState = {
    schedules: [],
    currentSchedule: null,
    loading: false,
    error: null,
    filters: {
        weekYear: null,
        monthYear: null,
        date: null,
        isActive: true
    },
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    showActive: true
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
        },
        setSelectedYear: (state, action) => {
            state.selectedYear = action.payload;
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
    removeSchedule
} = workScheduleSlice.actions;

export default workScheduleSlice.reducer;