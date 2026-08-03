import { createAsyncThunk } from "@reduxjs/toolkit";
import { PERMISSION_API } from "../../apis/permission";

export const fetchPermissions = createAsyncThunk(
    'permission/fetchPermissions',
    async ({ search = '', danhMuc = '' }, { rejectWithValue }) => {
        try {
            const response = await PERMISSION_API.getAllPermissions(search, danhMuc);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Lấy danh sách quyền thất bại');
        }
    }
)

export const fetchPermissionCategories = createAsyncThunk(
    'permission/fetchPermissionCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await PERMISSION_API.getPermissionCategory();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Lấy danh mục quyền thất bại');
        }
    }
)