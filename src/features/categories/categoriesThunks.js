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

export const fetchCategoriesWithPagination = createAsyncThunk(
    'categories/fetchCategoriesWithPagination',
    async ({ page = 1, pageSize = 10, isRemoved = false, search = '' } = {}, { rejectWithValue }) => {
        try {
            const result = await CATEGORY_API.getCategoriesWithPagination(page, pageSize, isRemoved, search);
            return {
                data: result.data || [],
                pagination: result.pagination || {}
            };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách danh mục thất bại'
            });
        }
    }
);

export const countNewsByCategory = createAsyncThunk(
    'categories/countNewsByCategory',
    async (_, { rejectWithValue }) => {
        try {
            const data = await CATEGORY_API.countNewsByCategory();
            return data || [];
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Đếm số lượng tin tức theo danh mục thất bại'
            });
        }
    }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const data = await CATEGORY_API.createCategory(categoryData);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Tạo danh mục thất bại'
            });
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ categoryId, categoryData }, { rejectWithValue }) => {
        try {
            const data = await CATEGORY_API.updateCategory(categoryId, categoryData);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật danh mục thất bại'
            });
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            await CATEGORY_API.deleteCategory(categoryId);
            return categoryId;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Xóa danh mục thất bại'
            });
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    'categories/fetchCategoryById',
    async (categoryId, { rejectWithValue }) => {
        try {
            const data = await CATEGORY_API.getCategoryById(categoryId);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh mục thất bại'
            });
        }
    }
);

export const updateStatusCategory = createAsyncThunk(
    'categories/updateStatusCategory',
    async ({ categoryId, isActive }, { rejectWithValue }) => {
        try {
            const data = await CATEGORY_API.updateStatusCategory(categoryId, isActive);
            return data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật trạng thái danh mục thất bại'
            });
        }
    }
);
