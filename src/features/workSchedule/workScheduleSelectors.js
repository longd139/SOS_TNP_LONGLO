import { createSelector } from '@reduxjs/toolkit';
import { normalizeDate } from '../../utils/dateUtils';

const selectWorkScheduleState = (state) => state.workSchedule;

const getScheduleDateField = (schedule) => {
    return schedule.ngay_tiep_dan || schedule.date;
};

export const selectSchedulesList = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.schedules
);

export const selectAllSchedulesList = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.allSchedules || workSchedule.schedules
);

export const selectSchedulesLoading = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.loading
);

export const selectSchedulesError = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.error
);

export const selectCurrentSchedule = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.currentSchedule
);

export const selectScheduleFilters = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.filters
);

export const selectSelectedMonth = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.selectedMonth
);

export const selectSelectedYear = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.selectedYear
);

export const selectSchedulesForDisplay = createSelector(
    [selectSchedulesList],
    (schedules) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return schedules
            .filter(schedule => {
                const scheduleDate = new Date(getScheduleDateField(schedule));
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate >= today;
            })
            .slice()
            .sort((a, b) => {
                const dateA = new Date(getScheduleDateField(a));
                const dateB = new Date(getScheduleDateField(b));
                return dateA - dateB;
            });
    }
);

export const selectSchedulesForMonth = createSelector(
    [selectAllSchedulesList, selectSelectedMonth, selectSelectedYear],
    (schedules, month, year) => {
        return schedules.filter(schedule => {
            const norm = normalizeDate(getScheduleDateField(schedule));
            if (/^\d{4}-\d{2}-\d{2}$/.test(norm)) {
                const [sYear, sMonth] = norm.split('-').map(Number);
                return sMonth === month && sYear === year;
            }
            return false;
        });
    }
);

export const selectHasScheduleForDay = createSelector(
    [selectSchedulesForMonth],
    (monthSchedules) => (day) => {
        if (!day) return false;

        if (typeof day === 'string') {
            const targetNorm = normalizeDate(day);
            return monthSchedules.some(schedule => {
                return normalizeDate(getScheduleDateField(schedule)) === targetNorm;
            });
        }

        return monthSchedules.some(schedule => {
            const norm = normalizeDate(getScheduleDateField(schedule));
            if (/^\d{4}-\d{2}-\d{2}$/.test(norm)) {
                const [, , sDay] = norm.split('-').map(Number);
                return sDay === day;
            }
            return false;
        });
    }
);

export const selectSchedulesForDate = createSelector(
    [selectSchedulesList, (state, date) => date],
    (schedules, date) => {
        if (!date) return [];
        const targetNorm = normalizeDate(date);
        return schedules.filter(schedule => {
            const scheduleDate = getScheduleDateField(schedule);
            return normalizeDate(scheduleDate) === targetNorm;
        }).sort((a, b) => {
            const timeA = a.thoi_gian || a.time || '';
            const timeB = b.thoi_gian || b.time || '';
            return timeA.localeCompare(timeB);
        });
    }
);

export const selectScheduleStatistics = createSelector(
    [selectSchedulesList],
    (schedules) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return {
            total: schedules.length,
            active: schedules.filter(s => s.isActive || s.is_active).length,
            inactive: schedules.filter(s => !(s.isActive || s.is_active)).length,
            upcoming: schedules.filter(s => {
                const scheduleDate = new Date(getScheduleDateField(s));
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate >= today;
            }).length,
            past: schedules.filter(s => {
                const scheduleDate = new Date(getScheduleDateField(s));
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate < today;
            }).length
        };
    }
);

export const selectSchedulePagination = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.pagination || {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0
    }
);

export const selectScheduleCounts = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.counts || {
        all: 0,
        active: 0,
        inactive: 0
    }
);