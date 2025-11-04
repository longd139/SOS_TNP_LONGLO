import { createAsyncThunk } from '@reduxjs/toolkit';
import { AREAS_API } from '../../apis/areas';

export const fetchAreas = createAsyncThunk(
    'areas/fetchAreas',
    async ({ isRemoved = false, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.getAreas(isRemoved, search);
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
