import { createSlice } from '@reduxjs/toolkit';
import { fetchMyProfile, updateProfileData } from './userProfileThunks';

const initialState = {
    profile: null,
    loading: false,
    updating: false,
    error: null,
    updateError: null,
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUpdateError: (state) => {
            state.updateError = null;
        },
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.updateError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy thông tin cá nhân thất bại';
            })

            .addCase(updateProfileData.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateProfileData.fulfilled, (state, action) => {
                state.updating = false;
                state.profile = action.payload;
            })
            .addCase(updateProfileData.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload || 'Cập nhật thông tin thất bại';
            });
    },
});

export const { clearError, clearUpdateError, clearProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
