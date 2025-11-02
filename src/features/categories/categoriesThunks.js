import { createAsyncThunk } from '@reduxjs/toolkit';
import { CATEGORY_API } from '../../apis/categoryNews';

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async ({ isRemoved = false } = {}, { rejectWithValue }) => {
        try {
            const data = await CATEGORY_API.getAllCategories(isRemoved);
            return data || [];
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách danh mục thất bại'
            });
        }
    }
);
