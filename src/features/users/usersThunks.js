import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../services/userService';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page = 1, size = 10, isActive, vaiTro, search } = {}, { rejectWithValue }) => {
        try {
            const response = await UserService.getAllUsers({ page, size, isActive, vaiTro, search });
            return {
                users: response.content || [],
                pagination: {
                    current: page,
                    pageSize: size,
                    total: response.totalElements || 0,
                    totalPages: response.totalPages || 0
                }
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải danh sách người dùng');
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const result = await UserService.createAccount(userData);
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tạo tài khoản');
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (userData, { rejectWithValue }) => {
        try {
            const result = await UserService.updateUserByAdmin(userData);
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể cập nhật tài khoản');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await UserService.deleteUser(userId);
            return userId;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể xóa tài khoản');
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    'users/updateUserStatus',
    async ({ userId, isActive }, { rejectWithValue }) => {
        try {
            await UserService.updateUserStatus(userId, isActive);
            return { userId, isActive };
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể cập nhật trạng thái tài khoản');
        }
    }
);

export const getUserById = createAsyncThunk(
    'users/getUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const result = await UserService.getUserById(userId);
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải thông tin người dùng');
        }
    }
);