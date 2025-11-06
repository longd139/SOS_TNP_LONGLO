import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchWorkSchedules, 
    importWorkSchedule, 
    updateWorkScheduleStatus, 
    deleteWorkSchedule 
} from '../features/workSchedule/workScheduleThunks';
import { 
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
} from '../features/workSchedule/workScheduleSlice';
import { 
    selectSchedulesList, 
    selectSchedulesLoading, 
    selectSchedulesError, 
    selectCurrentSchedule,
    selectScheduleFilters,
    selectSelectedMonth,
    selectSelectedYear,
    // selectShowActive,
    selectSchedulesForDisplay,
    selectSchedulesForMonth,
    selectHasScheduleForDay,
    selectScheduleStatistics
} from '../features/workSchedule/workScheduleSelectors';

export const useSchedule = () => {
    const dispatch = useDispatch();
    const schedules = useSelector(selectSchedulesList);
    const loading = useSelector(selectSchedulesLoading);
    const error = useSelector(selectSchedulesError);
    const currentSchedule = useSelector(selectCurrentSchedule);
    const filters = useSelector(selectScheduleFilters);
    const selectedMonth = useSelector(selectSelectedMonth);
    const selectedYear = useSelector(selectSelectedYear);
    // const showActive = useSelector(selectShowActive);
    const schedulesForDisplay = useSelector(selectSchedulesForDisplay);
    const schedulesForMonth = useSelector(selectSchedulesForMonth);
    const hasScheduleForDay = useSelector(selectHasScheduleForDay);
    const statistics = useSelector(selectScheduleStatistics);

    const getSchedulesForDate = useCallback((date) => {
        if (!date) return [];
        
        const normalizeDate = (dateStr) => {
            if (!dateStr) return '';
            
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                return dateStr;
            }
            
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
                const [day, month, year] = dateStr.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            
            if (dateStr.includes('T') || dateStr.includes('Z') || /^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            }
            
            try {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            } catch (e) {
            }
            
            return dateStr;
        };
        
        const normalizedDate = normalizeDate(date);
        
        const filtered = schedules.filter(schedule => {
            const scheduleDate = schedule.ngay_tiep_dan || schedule.date;
            const normalizedScheduleDate = normalizeDate(scheduleDate);
            return normalizedScheduleDate === normalizedDate;
        }).sort((a, b) => {
            const timeA = a.thoi_gian || a.time || '';
            const timeB = b.thoi_gian || b.time || '';
            return timeA.localeCompare(timeB);
        });
        
        return filtered;
    }, [schedules]);

    const fetchSchedules = useCallback((params = {}) => {
        const defaultParams = {
            weekYear: filters.weekYear,
            monthYear: filters.monthYear,
            date: filters.date,
            ...params
        };
        return dispatch(fetchWorkSchedules(defaultParams));
    }, [dispatch, filters]);

    const importSchedule = useCallback(async (file) => {
        try {
            const result = await dispatch(importWorkSchedule(file));
            if (importWorkSchedule.fulfilled.match(result)) {
                await fetchSchedules();
                return { success: true, data: result.payload };
            } else {
                return { success: false, error: result.payload?.message || result.payload || 'Import lịch tiếp dân thất bại!' };
            }
        } catch (error) {
            return { success: false, error: error.message || 'Import lịch tiếp dân thất bại!' };
        }
    }, [dispatch, fetchSchedules]);

    // Update schedule status
    const updateStatus = useCallback(async (schedule) => {
        const newStatus = !(schedule.isActive || schedule.is_active);
        const result = await dispatch(updateWorkScheduleStatus({ 
            scheduleId: schedule.id, 
            isActive: newStatus 
        }));
        
        if (updateWorkScheduleStatus.fulfilled.match(result)) {
            return { success: true };
        } else {
            return { success: false, error: result.payload?.message || result.payload || 'Cập nhật trạng thái thất bại!' };
        }
    }, [dispatch]);

    // Delete schedule
    const deleteScheduleItem = useCallback(async (scheduleId) => {
        const result = await dispatch(deleteWorkSchedule(scheduleId));
        if (deleteWorkSchedule.fulfilled.match(result)) {
            return { success: true };
        } else {
            return { success: false, error: result.payload?.message || result.payload || 'Xóa lịch tiếp dân thất bại!' };
        }
    }, [dispatch]);

    // Add new schedule locally (for optimistic updates)
    const addNewSchedule = useCallback((scheduleData) => {
        dispatch(addSchedule(scheduleData));
    }, [dispatch]);

    // Update existing schedule locally
    const updateExistingSchedule = useCallback((scheduleData) => {
        dispatch(updateSchedule(scheduleData));
    }, [dispatch]);

    // Remove schedule locally
    const removeScheduleLocal = useCallback((scheduleId) => {
        dispatch(removeSchedule(scheduleId));
    }, [dispatch]);

    // Set current schedule
    const handleSetCurrentSchedule = useCallback((schedule) => {
        dispatch(setCurrentSchedule(schedule));
    }, [dispatch]);

    // Clear current schedule
    const handleClearCurrentSchedule = useCallback(() => {
        dispatch(clearCurrentSchedule());
    }, [dispatch]);

    // Set filters
    const handleSetFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    // Reset filters
    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    // Set selected month
    const handleSetSelectedMonth = useCallback((month) => {
        dispatch(setSelectedMonth(month));
    }, [dispatch]);

    // Set selected year
    const handleSetSelectedYear = useCallback((year) => {
        dispatch(setSelectedYear(year));
    }, [dispatch]);

    // Set show active
    const handleSetShowActive = useCallback((value) => {
        dispatch(setShowActive(value));
    }, [dispatch]);

    // Clear error
    const clearScheduleError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Utility function to check if a day has schedule
    const hasSchedule = useCallback((day) => {
        if (!day) return false;
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return schedules.some(schedule => schedule.date === dateStr);
    }, [schedules, selectedMonth, selectedYear]);

    // Get schedules for display (sorted by date)
    const getSchedulesForDisplay = useCallback(() => {
        return schedules
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [schedules]);

    // Format date utility
    const formatDate = useCallback((dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        });
    }, []);

    return {
        // State
        schedules,
        loading,
        error,
        currentSchedule,
        filters,
        selectedMonth,
        selectedYear,
        // showActive,
        schedulesForDisplay,
        schedulesForMonth,
        hasScheduleForDay,
        statistics,
        
        // Actions
        fetchSchedules,
        importSchedule,
        updateStatus,
        deleteSchedule: deleteScheduleItem,
        
        // Local state management
        addNewSchedule,
        updateExistingSchedule,
        removeScheduleLocal,
        
        // Current schedule management
        setCurrentSchedule: handleSetCurrentSchedule,
        clearCurrentSchedule: handleClearCurrentSchedule,
        
        // Filters and settings
        setFilters: handleSetFilters,
        resetFilters: handleResetFilters,
        setSelectedMonth: handleSetSelectedMonth,
        setSelectedYear: handleSetSelectedYear,
        setShowActive: handleSetShowActive,
        
        // Utilities
        clearError: clearScheduleError,
        hasSchedule,
        getSchedulesForDisplay,
        getSchedulesForDate,
        formatDate
    };
};