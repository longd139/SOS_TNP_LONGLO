import { createSelector } from '@reduxjs/toolkit';

export const selectNewsState = (state) => state.news;
export const selectNewsList = (state) => state.news.news;
export const selectNewsLoading = (state) => state.news.loading;
export const selectNewsError = (state) => state.news.error;
export const selectNewsPagination = (state) => state.news.pagination;
export const selectCurrentNews = (state) => state.news.currentNews;
export const selectNewsFilters = (state) => state.news.filters;
export const selectShowActive = (state) => state.news.showActive;

export const selectNewsStatistics = createSelector(
    [selectNewsList],
    (news) => {
        const total = news.length;
        const active = news.filter(item => item.isActive === true).length;
        const inactive = news.filter(item => item.isActive === false).length;

        return {
            total,
            active,
            inactive
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
