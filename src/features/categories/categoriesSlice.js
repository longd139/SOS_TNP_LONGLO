import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from './categoriesThunks';

const initialState = {
    categories: [],
    loading: false,
    error: null
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh mục';
            });
    }
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
