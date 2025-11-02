import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews, createNewsItem, updateNewsItem, deleteNewsItem } from '../features/news/newsThunks';
import { clearError } from '../features/news/newsSlice';
import { 
    selectNewsList, 
    selectNewsLoading, 
    selectNewsError, 
    selectNewsPagination,
    selectNewsStatistics 
} from '../features/news/newsSelectors';

export const useNews = () => {
    const dispatch = useDispatch();
    const news = useSelector(selectNewsList);
    const loading = useSelector(selectNewsLoading);
    const error = useSelector(selectNewsError);
    const pagination = useSelector(selectNewsPagination);
    const statistics = useSelector(selectNewsStatistics);

    useEffect(() => {
        dispatch(fetchNews({ page: 1, pageSize: 10 }));
    }, [dispatch]);

    const loadNews = useCallback((params) => {
        return dispatch(fetchNews(params));
    }, [dispatch]);

    const createNews = useCallback(async (newsData) => {
        const result = await dispatch(createNewsItem(newsData));
        if (createNewsItem.fulfilled.match(result)) {
            return { success: true, data: result.payload };
        } else {
            return { success: false, error: result.payload?.message };
        }
    }, [dispatch]);

    const updateNews = useCallback(async (newsId, newsData) => {
        const result = await dispatch(updateNewsItem({ newsId, newsData }));
        if (updateNewsItem.fulfilled.match(result)) {
            return { success: true, data: result.payload };
        } else {
            return { success: false, error: result.payload?.message };
        }
    }, [dispatch]);

    const deleteNews = useCallback(async (newsId) => {
        const result = await dispatch(deleteNewsItem(newsId));
        if (deleteNewsItem.fulfilled.match(result)) {
            return { success: true };
        } else {
            return { success: false, error: result.payload?.message };
        }
    }, [dispatch]);

    const clearNewsError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        news,
        loading,
        error,
        pagination,
        statistics,
        loadNews,
        createNews,
        updateNews,
        deleteNews,
        clearError: clearNewsError
    };
};
