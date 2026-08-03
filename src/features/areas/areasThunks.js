import { createAsyncThunk } from '@reduxjs/toolkit';
import { AREAS_API } from '../../apis/areas';

export const fetchAreas = createAsyncThunk(
    'areas/fetchAreas',
    async ({ isActive = true, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.getAreas(isActive, search);
            return response || [];
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách lĩnh vực thất bại'
            });
        }
    }
);

export const createArea = createAsyncThunk(
    'areas/createArea',
    async (areaData, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.createAreas(areaData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Tạo lĩnh vực thất bại'
            });
        }
    }
);

export const updateArea = createAsyncThunk(
    'areas/updateArea',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.updateArea(id, data);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật lĩnh vực thất bại'
            });
        }
    }
);

export const deleteArea = createAsyncThunk(
    'areas/deleteArea',
    async (areaId, { rejectWithValue }) => {
        try {
            await AREAS_API.deleteArea(areaId);
            return areaId;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Xóa lĩnh vực thất bại'
            });
        }
    }
);

export const updateAreaStatus = createAsyncThunk(
    'areas/updateAreaStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.updateAreaStatus(id, isActive);
            return { id, isActive, data: response };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật trạng thái lĩnh vực thất bại'
            });
        }
    }
);

export const fetchAreaById = createAsyncThunk(
    'areas/fetchAreaById',
    async (areaId, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.getAreaById(areaId);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy thông tin lĩnh vực thất bại'
            });
        }
    }
);

export const fetchAreasPagination = createAsyncThunk(
    'areas/fetchAreasPagination',
    async ({ page = 1, size = 10, isActive, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.getAreasPagination(page, size, isActive, search);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách lĩnh vực thất bại'
            });
        }
    }
);

