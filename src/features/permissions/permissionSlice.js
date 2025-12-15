import { createSlice } from "@reduxjs/toolkit";
import { fetchPermissions, fetchPermissionCategories } from "./permissionThunk";

const initialState = {
	permissions: {},
	categories: [],
	loading: false,
	error: null,
	filters: {
		search: '',
		danhMuc: ''
	}
}

const permissionSlice = createSlice({
	name: 'permission',
	initialState,
	reducers: {
		clearPermissionError: (state) => {
			state.error = null;
		},
		setPermissionFilters: (state, action) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		resetPermissionFilters: (state) => {
			state.filters = initialState.filters;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPermissions.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPermissions.fulfilled, (state, action) => {
				state.loading = false;
				state.permissions = action.payload || {};
			})
			.addCase(fetchPermissions.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Lấy danh sách quyền thất bại';
			})

			.addCase(fetchPermissionCategories.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPermissionCategories.fulfilled, (state, action) => {
				state.loading = false;
				state.categories = action.payload || [];
			})
			.addCase(fetchPermissionCategories.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Lấy danh mục quyền thất bại';
			})
	}
});

export const { clearPermissionError, setPermissionFilters, resetPermissionFilters } = permissionSlice.actions;

export default permissionSlice.reducer;
