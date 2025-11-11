import { createAsyncThunk } from '@reduxjs/toolkit';
import { WORK_SCHEDULE_API } from '../../apis/workSchedule';

export const fetchWorkSchedules = createAsyncThunk(
    'workSchedule/fetchWorkSchedules',
    async ({ weekYear = null, monthYear = null, date = null, isActive = true } = {}, { rejectWithValue }) => {
        try {
            const response = await WORK_SCHEDULE_API.getWorkSchedules(weekYear, monthYear, date, isActive);
            return response || [];
        } catch (error) {
            return rejectWithValue({
                message: error.message || 'Lấy danh sách lịch tiếp dân thất bại'
            });
        }
    }
);

export const importWorkSchedule = createAsyncThunk(
    'workSchedule/importWorkSchedule',
    async (file, { rejectWithValue }) => {
        try {
            const response = await WORK_SCHEDULE_API.importWorkSchedule(file);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.message || 'Import lịch tiếp dân thất bại'
            });
        }
    }
);

export const updateWorkScheduleStatus = createAsyncThunk(
    'workSchedule/updateWorkScheduleStatus',
    async ({ scheduleId, isActive }, { rejectWithValue }) => {
        try {
            await WORK_SCHEDULE_API.updateWorkScheduleStatus(scheduleId, isActive);
            return { scheduleId, isActive };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật trạng thái lịch tiếp dân thất bại'
            });
        }
    }
);

export const deleteWorkSchedule = createAsyncThunk(
    'workSchedule/deleteWorkSchedule',
    async (scheduleId, { rejectWithValue }) => {
        try {
            await WORK_SCHEDULE_API.deleteWorkSchedule(scheduleId);
            return scheduleId;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Xóa lịch tiếp dân thất bại'
            });
        }
    }
);

export const getTemplateWorkSchedule = createAsyncThunk(
    'workSchedule/getTemplateWorkSchedule',
    async (_, { rejectWithValue }) => {
        try {
            const response = await WORK_SCHEDULE_API.getTemplateWorkSchedule();
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy template lịch tiếp dân thất bại'
            });
        }
    }
);

export const createWorkSchedule = createAsyncThunk(
    'workSchedule/createWorkSchedule',
    async (scheduleData, { rejectWithValue }) => {
        try {
            const response = await WORK_SCHEDULE_API.createWorkSchedule(scheduleData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Tạo lịch tiếp dân thất bại'
            });
        }
    }
);

export const updateWorkSchedule = createAsyncThunk(
    'workSchedule/updateWorkSchedule',
    async ({ scheduleId, scheduleData }, { rejectWithValue }) => {
        try {
            const response = await WORK_SCHEDULE_API.updateWorkSchedule(scheduleId, scheduleData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật lịch tiếp dân thất bại'
            });
        }
    }
);