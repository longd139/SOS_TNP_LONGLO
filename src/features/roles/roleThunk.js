import { createAsyncThunk } from "@reduxjs/toolkit";
import { ROLE_API } from "../../apis/role";

export const fetchRoles = createAsyncThunk(
    'role/fetchRoles',
    async (search = '', { rejectWithValue }) => {
        try {
            const response = await ROLE_API.getRole(search);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Lấy danh sách vai trò thất bại');
        }
    }
)

export const createRole = createAsyncThunk(
    'role/createRole',
    async (roleData, { rejectWithValue }) => {
        try {
            const response = await ROLE_API.createRole(roleData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Tạo vai trò thất bại');
        }
    }
)

export const fetchRolesByPagination = createAsyncThunk(
    'role/fetchRolesByPagination',
    async ({ page, size, search = '', isActive }, { rejectWithValue }) => {
        try {
            const response = await ROLE_API.getRoleByPagination(page, size, search, isActive);

            return {
                content: Array.isArray(response.data) ? response.data : [],
                page: Number(response.pagination?.currentPage) || page,
                size: Number(response.pagination?.pageSize) || size,
                totalElements: Number(response.pagination?.totalItems) || 0,
                totalPages: Number(response.pagination?.totalPages) || 0
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Lấy danh sách vai trò theo phân trang thất bại');
        }
    }
)

export const fetchRoleById = createAsyncThunk(
    'role/fetchRoleById',
    async (roleId, { rejectWithValue }) => {
        try {
            const response = await ROLE_API.getRoleById(roleId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Lấy vai trò theo ID thất bại');
        }
    }
)

export const updateRole = createAsyncThunk(
    'role/updateRole',
    async ({ roleId, roleData }, { rejectWithValue }) => {
        try {
            const response = await ROLE_API.updateRole(roleId, roleData);
            return { roleId, updatedData: response };
        } catch (error) {
            return rejectWithValue(error.message || 'Cập nhật vai trò thất bại');
        }
    }
)

export const deleteRole = createAsyncThunk(
    'role/deleteRole',
    async (roleId, { rejectWithValue }) => {
        try {
            const response = await ROLE_API.deleteRole(roleId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Xóa vai trò thất bại');
        }
    }
)

export const updateRoleStatus = createAsyncThunk(
    'role/updateRoleStatus',
    async ({ roleId, isActive }, { rejectWithValue }) => {
        try {
            const response = await ROLE_API.updateRoleStatus(roleId, isActive);
            return response;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || 'Cập nhật trạng thái vai trò thất bại');
        }
    }
)