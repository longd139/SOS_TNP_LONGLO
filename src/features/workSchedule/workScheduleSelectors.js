import { createSelector } from '@reduxjs/toolkit';

const selectWorkScheduleState = (state) => state.workSchedule;

const getScheduleDateField = (schedule) => {
    return schedule.ngay_tiep_dan || schedule.date;
};

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
    [selectSchedulesList, selectSelectedMonth, selectSelectedYear],
    (schedules, month, year) => {
        return schedules.filter(schedule => {
            const scheduleDate = new Date(getScheduleDateField(schedule));
            return scheduleDate.getMonth() + 1 === month && scheduleDate.getFullYear() === year;
        });
    }
);

export const selectHasScheduleForDay = createSelector(
    [selectSchedulesForMonth],
    (monthSchedules) => (day) => {
        if (!day) return false;

        if (typeof day === 'string') {
            return monthSchedules.some(schedule => {
                const scheduleDate = new Date(getScheduleDateField(schedule));
                const dStr = `${scheduleDate.getFullYear()}-${String(scheduleDate.getMonth() + 1).padStart(2, '0')}-${String(scheduleDate.getDate()).padStart(2, '0')}`;
                return dStr === day;
            });
        }

        return monthSchedules.some(schedule => {
            const scheduleDate = new Date(getScheduleDateField(schedule));
            return scheduleDate.getDate() === day;
        });
    }
);

export const selectSchedulesForDate = createSelector(
    [selectSchedulesList, (state, date) => date],
    (schedules, date) => {
        if (!date) return [];
        return schedules.filter(schedule => {
            const scheduleDate = getScheduleDateField(schedule);
            return scheduleDate === date;
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