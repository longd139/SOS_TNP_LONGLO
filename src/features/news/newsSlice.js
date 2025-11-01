import { createSlice } from '@reduxjs/toolkit';
import { fetchNews, createNewsItem, updateNewsItem, deleteNewsItem } from './newsThunks';

const initialState = {
    news: [],
    currentNews: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0
    }
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentNews: (state, action) => {
            state.currentNews = action.payload;
        },
        clearCurrentNews: (state) => {
            state.currentNews = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.loading = false;
                state.news = action.payload.data || [];
                state.pagination = action.payload.pagination || initialState.pagination;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách tin tức thất bại';
            })

            .addCase(createNewsItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewsItem.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.news.unshift(action.payload);
                    state.pagination.totalItems += 1;
                }
            })
            .addCase(createNewsItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Tạo tin tức thất bại';
            })

            .addCase(updateNewsItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNewsItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.news.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.news[index] = action.payload;
                }
            })
            .addCase(updateNewsItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật tin tức thất bại';
            })

            .addCase(deleteNewsItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNewsItem.fulfilled, (state, action) => {
                state.loading = false;
                state.news = state.news.filter(item => item.id !== action.payload);
                state.pagination.totalItems -= 1;
            })
            .addCase(deleteNewsItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa tin tức thất bại';
            });
    }
});

export const { clearError, setCurrentNews, clearCurrentNews } = newsSlice.actions;
export default newsSlice.reducer;
