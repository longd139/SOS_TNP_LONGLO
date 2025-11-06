import { createSelector } from '@reduxjs/toolkit';

const selectWorkScheduleState = (state) => state.workSchedule;

export const selectSchedulesList = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.schedules
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

export const selectShowActive = createSelector(
    [selectWorkScheduleState],
    (workSchedule) => workSchedule.showActive
);

// Computed selectors
export const selectSchedulesForDisplay = createSelector(
    [selectSchedulesList],
    (schedules) => {
        return schedules
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
);

export const selectSchedulesForMonth = createSelector(
    [selectSchedulesList, selectSelectedMonth, selectSelectedYear],
    (schedules, month, year) => {
        return schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate.getMonth() + 1 === month && scheduleDate.getFullYear() === year;
        });
    }
);

export const selectHasScheduleForDay = createSelector(
    [selectSchedulesForMonth],
    (monthSchedules) => (day) => {
        if (!day) return false;
        return monthSchedules.some(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate.getDate() === day;
        });
    }
);

export const selectScheduleStatistics = createSelector(
    [selectSchedulesList],
    (schedules) => ({
        total: schedules.length,
        active: schedules.filter(s => s.isActive).length,
        inactive: schedules.filter(s => !s.isActive).length,
        upcoming: schedules.filter(s => new Date(s.date) > new Date()).length,
        past: schedules.filter(s => new Date(s.date) < new Date()).length
    })
);