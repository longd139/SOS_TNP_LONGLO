import { createSlice } from "@reduxjs/toolkit";
import { createRole, deleteRole, fetchRoleById, fetchRoles, fetchRolesByPagination, updateRole, updateRoleStatus } from "./roleThunk";

const DEFAULT_PAGE_SIZE = 10;
const initialState = {
    roles: [],
    allRoles: [],
    currentRole: null,
    loading: false,
    allRolesLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
        totalItems: 0
    },
    filters: {
        search: '',
    },
    showActive: true
}

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentRole: (state, action) => {
            state.currentRole = action.payload;
        },
        clearCurrentRole: (state) => {
            state.currentRole = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        setShowActive: (state, action) => {
            state.showActive = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.allRolesLoading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.allRolesLoading = false;
                state.allRoles = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.allRolesLoading = false;
                state.error = action.payload || 'Lấy danh sách vai trò thất bại';
            })
            .addCase(fetchRolesByPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRolesByPagination.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.content || [];
                state.pagination = {
                    currentPage: action.payload.page,
                    pageSize: action.payload.size,
                    totalPages: action.payload.totalPages,
                    totalItems: action.payload.totalElements
                };
            })
            .addCase(fetchRolesByPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy danh sách vai trò theo phân trang thất bại';
            })
            .addCase(fetchRoleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRole = action.payload;
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lấy vai trò theo ID thất bại';
            })
            .addCase(createRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.roles.unshift(action.payload);
                    state.pagination.totalItems += 1;
                }
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Tạo vai trò thất bại';
            })
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.roles.findIndex(role => role.id === action.payload.id);
                    if (index !== -1) {
                        state.roles[index] = action.payload;
                    }
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Cập nhật vai trò thất bại';
            })
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = state.roles.filter(role => role.id !== action.payload);
                state.pagination.totalItems -= 1;
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Xóa vai trò thất bại';
            })
            .addCase(updateRoleStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRoleStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.roles.findIndex(role => role.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
            })
            .addCase(updateRoleStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Cập nhật trạng thái vai trò thất bại';
            })
    }
})

export const {
    clearError,
    setCurrentRole,
    clearCurrentRole,
    setFilters,
    resetFilters,
    setShowActive
} = roleSlice.actions;

export default roleSlice.reducer;