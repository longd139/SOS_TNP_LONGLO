import { createAsyncThunk } from '@reduxjs/toolkit';
import { GOVERNMENT_API } from '../../apis/government';

export const fetchGovernment = createAsyncThunk(
    'government/fetchGovernment',
    async ({ isActive = true, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await GOVERNMENT_API.getGovernment(isActive, search);
            return response || [];
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách cơ sở dịch vụ công thất bại'
            });
        }
    }
);

export const fetchGovernmentPagination = createAsyncThunk(
    'government/fetchGovernmentPagination',
    async ({ page = 1, size = 10, isActive, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await GOVERNMENT_API.getGovernment({
                page,
                size,
                isActive,
                search
            });

            return {
                data: response.content || [],
                pagination: response.pagination ? {
                    currentPage: response.pagination.currentPage || page,
                    pageSize: response.pagination.pageSize || size,
                    totalPages: response.pagination.totalPages || 0,
                    totalItems: response.pagination.totalItems || 0
                } : null
            };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách cơ sở dịch vụ công thất bại'
            });
        }
    }
);

export const createGovernment = createAsyncThunk(
    'government/createGovernment',
    async (governmentData, { rejectWithValue }) => {
        try {
            const response = await GOVERNMENT_API.createGovernment(governmentData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Tạo cơ sở dịch vụ công thất bại'
            });
        }
    }
);

export const updateGovernment = createAsyncThunk(
    'government/updateGovernment',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await GOVERNMENT_API.updateGovernment(id, data);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật cơ sở dịch vụ công thất bại'
            });
        }
    }
);

export const deleteGovernment = createAsyncThunk(
    'government/deleteGovernment',
    async (governmentId, { rejectWithValue }) => {
        try {
            await GOVERNMENT_API.deleteGovernment(governmentId);
            return governmentId;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Xóa cơ sở dịch vụ công thất bại'
            });
        }
    }
);

export const updateGovernmentStatus = createAsyncThunk(
    'government/updateGovernmentStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await GOVERNMENT_API.updateStatusGovernment(id, isActive);
            return { id, isActive, data: response };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật trạng thái cơ sở dịch vụ công thất bại'
            });
        }
    }
);

export const fetchGovernmentById = createAsyncThunk(
    'government/fetchGovernmentById',
    async (governmentId, { rejectWithValue }) => {
        try {
            const response = await GOVERNMENT_API.getGovernmentById(governmentId);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy thông tin cơ sở dịch vụ công thất bại'
            });
        }
    }
);


