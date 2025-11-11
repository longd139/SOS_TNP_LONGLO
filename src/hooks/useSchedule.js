import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchWorkSchedules, 
    importWorkSchedule, 
    updateWorkScheduleStatus, 
    deleteWorkSchedule, 
    getTemplateWorkSchedule,
    createWorkSchedule,
    updateWorkSchedule
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
    selectSchedulesForDisplay,
    selectSchedulesForMonth,
    selectHasScheduleForDay,
    selectScheduleStatistics
} from '../features/workSchedule/workScheduleSelectors';
import { normalizeDate, formatDateVN, createDateString } from '../utils/dateUtils';

export const useSchedule = () => {
    const dispatch = useDispatch();
    const schedules = useSelector(selectSchedulesList);
    const loading = useSelector(selectSchedulesLoading);
    const error = useSelector(selectSchedulesError);
    const currentSchedule = useSelector(selectCurrentSchedule);
    const filters = useSelector(selectScheduleFilters);
    const selectedMonth = useSelector(selectSelectedMonth);
    const selectedYear = useSelector(selectSelectedYear);
    const schedulesForDisplay = useSelector(selectSchedulesForDisplay);
    const schedulesForMonth = useSelector(selectSchedulesForMonth);
    const hasScheduleForDay = useSelector(selectHasScheduleForDay);
    const statistics = useSelector(selectScheduleStatistics);

    const getSchedulesForDate = useCallback((date) => {
        if (!date) return [];
        
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

    const getTemplate = useCallback(async () => {
        try {
            const result = await dispatch(getTemplateWorkSchedule());
            if (getTemplateWorkSchedule.fulfilled.match(result)) {
                return { success: true, data: result.payload };
            } else {
                return { success: false, error: result.payload?.message || result.payload || 'Lấy template lịch tiếp dân thất bại!' };
            }
        } catch (error) {
            return { success: false, error: error.message || 'Lấy template lịch tiếp dân thất bại!' };
        }
    }, [dispatch]);

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

    const deleteScheduleItem = useCallback(async (scheduleId) => {
        const result = await dispatch(deleteWorkSchedule(scheduleId));
        if (deleteWorkSchedule.fulfilled.match(result)) {
            return { success: true };
        } else {
            return { success: false, error: result.payload?.message || result.payload || 'Xóa lịch tiếp dân thất bại!' };
        }
    }, [dispatch]);

    const createScheduleItem = useCallback(async (scheduleData) => {
        try {
            const result = await dispatch(createWorkSchedule(scheduleData));
            if (createWorkSchedule.fulfilled.match(result)) {
                return { success: true, data: result.payload };
            } else {
                return { success: false, error: result.payload?.message || result.payload || 'Tạo lịch tiếp dân thất bại!' };
            }
        } catch (error) {
            return { success: false, error: error.message || 'Tạo lịch tiếp dân thất bại!' };
        }
    }, [dispatch]);

    const updateScheduleItem = useCallback(async (scheduleId, scheduleData) => {
        try {
            const result = await dispatch(updateWorkSchedule({ scheduleId, scheduleData }));
            if (updateWorkSchedule.fulfilled.match(result)) {
                return { success: true, data: result.payload };
            } else {
                return { success: false, error: result.payload?.message || result.payload || 'Cập nhật lịch tiếp dân thất bại!' };
            }
        } catch (error) {
            return { success: false, error: error.message || 'Cập nhật lịch tiếp dân thất bại!' };
        }
    }, [dispatch]);

    const addNewSchedule = useCallback((scheduleData) => {
        dispatch(addSchedule(scheduleData));
    }, [dispatch]);

    const updateExistingSchedule = useCallback((scheduleData) => {
        dispatch(updateSchedule(scheduleData));
    }, [dispatch]);

    const removeScheduleLocal = useCallback((scheduleId) => {
        dispatch(removeSchedule(scheduleId));
    }, [dispatch]);

    const handleSetCurrentSchedule = useCallback((schedule) => {
        dispatch(setCurrentSchedule(schedule));
    }, [dispatch]);

    const handleClearCurrentSchedule = useCallback(() => {
        dispatch(clearCurrentSchedule());
    }, [dispatch]);

    const handleSetFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const handleSetSelectedMonth = useCallback((month) => {
        dispatch(setSelectedMonth(month));
    }, [dispatch]);

    const handleSetSelectedYear = useCallback((year) => {
        dispatch(setSelectedYear(year));
    }, [dispatch]);

    const handleSetShowActive = useCallback((value) => {
        dispatch(setShowActive(value));
    }, [dispatch]);

    const clearScheduleError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const hasSchedule = useCallback((day) => {
        if (!day) return false;
        const dateStr = createDateString(selectedYear, selectedMonth, day);
        return schedules.some(schedule => schedule.date === dateStr);
    }, [schedules, selectedMonth, selectedYear]);

    const getSchedulesForDisplay = useCallback(() => {
        return schedules
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [schedules]);

    const formatDate = useCallback((dateStr) => {
        return formatDateVN(dateStr);
    }, []);

    return {
        schedules,
        loading,
        error,
        currentSchedule,
        filters,
        selectedMonth,
        selectedYear,
        schedulesForDisplay,
        schedulesForMonth,
        hasScheduleForDay,
        statistics,
        
        fetchSchedules,
        importSchedule,
        updateStatus,
        deleteSchedule: deleteScheduleItem,
        getTemplate: getTemplate,
        addNewSchedule,
        updateExistingSchedule,
        removeScheduleLocal,
        
        setCurrentSchedule: handleSetCurrentSchedule,
        clearCurrentSchedule: handleClearCurrentSchedule,
        
        setFilters: handleSetFilters,
        resetFilters: handleResetFilters,
        setSelectedMonth: handleSetSelectedMonth,
        setSelectedYear: handleSetSelectedYear,
        setShowActive: handleSetShowActive,
        
        clearError: clearScheduleError,
        hasSchedule,
        getSchedulesForDisplay,
        getSchedulesForDate,
        formatDate,
        createScheduleItem,
        updateScheduleItem
    };
};