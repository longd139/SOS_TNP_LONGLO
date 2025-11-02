import { createSelector } from '@reduxjs/toolkit';

export const selectNewsState = (state) => state.news;
export const selectNewsList = (state) => state.news.news;
export const selectNewsLoading = (state) => state.news.loading;
export const selectNewsError = (state) => state.news.error;
export const selectNewsPagination = (state) => state.news.pagination;
export const selectCurrentNews = (state) => state.news.currentNews;

export const selectNewsStatistics = createSelector(
    [selectNewsList],
    (news) => {
        const total = news.length;
        const published = news.filter(item => item.trang_thai === 'XUAT_BAN').length;
        const draft = news.filter(item => item.trang_thai === 'NHAP').length;
        const removed = news.filter(item => item.is_removed === true).length;

        return {
            total,
            published,
            draft,
            removed
        };
    }
);

export const selectNewsByCategory = createSelector(
    [selectNewsList, (state, categoryId) => categoryId],
    (news, categoryId) => {
        if (!categoryId) return news;
        return news.filter(item => item.id_danh_muc === categoryId);
    }
);

export const selectNewsByStatus = createSelector(
    [selectNewsList, (state, status) => status],
    (news, status) => {
        if (!status) return news;
        return news.filter(item => item.trang_thai === status);
    }
);
