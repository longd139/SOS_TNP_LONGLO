import { createAsyncThunk } from '@reduxjs/toolkit';
import { USER_API } from '../../apis/user';

export const fetchMyProfile = createAsyncThunk(
    'userProfile/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await USER_API.getMyProfile();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProfileData = createAsyncThunk(
    'userProfile/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await USER_API.updateUserProfile(userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
