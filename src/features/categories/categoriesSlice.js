import { createSlice } from '@reduxjs/toolkit';
import {
    fetchCategories,
    fetchCategoriesWithPagination,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategoryById,
    updateStatusCategory,
    countNewsByCategory
} from './categoriesThunks';

const DEFAULT_PAGE_SIZE = 10;

const initialState = {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
    isFetched: false,
    pagination: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
        totalItems: 0
    },
    filters: {
        search: ''
    },
    showActive: true,
    newsCount: []
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
        clearCurrentCategory: (state) => {
            state.currentCategory = null;
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
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
                state.isFetched = true;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh mục';
            })

            .addCase(fetchCategoriesWithPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoriesWithPagination.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data || [];
                const pag = action.payload.pagination || {};
                state.pagination = {
                    currentPage: pag.page || pag.currentPage || 1,
                    pageSize: pag.size || pag.pageSize || DEFAULT_PAGE_SIZE,
                    totalPages: pag.totalPages || 0,
                    totalItems: pag.totalElements || pag.totalItems || pag.total || 0
                };
                state.isFetched = true;
            })
            .addCase(fetchCategoriesWithPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh mục';
            })

            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.categories.unshift(action.payload);
                    state.pagination.totalItems += 1;
                }
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Tạo danh mục thất bại';
            })

            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật danh mục thất bại';
            })

            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(item => item.id !== action.payload);
                state.pagination.totalItems -= 1;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa danh mục thất bại';
            })

            .addCase(updateStatusCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStatusCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateStatusCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật trạng thái danh mục thất bại';
            })

            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCategory = action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh mục thất bại';
            })

            .addCase(countNewsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(countNewsByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.newsCount = action.payload || [];
            })
            .addCase(countNewsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Đếm số lượng tin tức thất bại';
            });
    }
});

export const {
    clearError,
    setCurrentCategory,
    clearCurrentCategory,
    setFilters,
    resetFilters,
    setShowActive
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
