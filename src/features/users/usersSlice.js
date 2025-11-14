import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, createUser, updateUser, deleteUser, getUserById } from './usersThunks';

const initialState = {
    users: [],
    currentUser: null,
    selectedUserDetail: null,
    loading: false,
    detailLoading: false,
    error: null,
    pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    }
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        clearSelectedUserDetail: (state) => {
            state.selectedUserDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
                state.pagination.total = Math.max(0, state.pagination.total - 1);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getUserById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedUserDetail = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentUser, clearError, setCurrentUser, clearSelectedUserDetail } = usersSlice.actions;
export default usersSlice.reducer;
