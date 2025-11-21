import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchNews, 
    createNewsItem, 
    updateNewsItem, 
    deleteNewsItem,
    updateNewsStatus as updateNewsStatusThunk
} from '../features/news/newsThunks';
import { 
    clearError,
    setCurrentNews,
    clearCurrentNews,
    setFilters,
    resetFilters,
    setShowActive
} from '../features/news/newsSlice';
import { 
    selectNewsList, 
    selectNewsLoading, 
    selectNewsError, 
    selectNewsPagination,
    selectNewsStatistics,
    selectCurrentNews,
    selectNewsFilters,
    selectShowActive
} from '../features/news/newsSelectors';

export const useNews = () => {
    const dispatch = useDispatch();
    const news = useSelector(selectNewsList);
    const loading = useSelector(selectNewsLoading);
    const error = useSelector(selectNewsError);
    const pagination = useSelector(selectNewsPagination);
    const statistics = useSelector(selectNewsStatistics);
    const currentNews = useSelector(selectCurrentNews);
    const filters = useSelector(selectNewsFilters);
    const showActive = useSelector(selectShowActive);

    const fetchNewsList = useCallback((page = 1, size = 10) => {
        dispatch(fetchNews({
            page,
            size,
            isActive: showActive,
            idDanhMuc: filters.idDanhMuc,
            search: filters.search
        }));
    }, [dispatch, showActive, filters.idDanhMuc, filters.search]);

    const loadNews = useCallback((params) => {
        return dispatch(fetchNews(params));
    }, [dispatch]);

    const createNews = useCallback(async (newsData) => {
        const result = await dispatch(createNewsItem(newsData));
        if (createNewsItem.fulfilled.match(result)) {
            return { success: true, data: result.payload };
        } else {
            return { success: false, error: result.payload?.message || result.payload || 'Tạo tin tức thất bại!' };
        }
    }, [dispatch]);

    const updateNews = useCallback(async (newsId, newsData) => {
        const result = await dispatch(updateNewsItem({ newsId, newsData }));
        if (updateNewsItem.fulfilled.match(result)) {
            return { success: true, data: result.payload };
        } else {
            return { success: false, error: result.payload?.message || result.payload || 'Cập nhật tin tức thất bại!' };
        }
    }, [dispatch]);

    const handleUpdateStatus = useCallback(async (newsItem) => {
        const newStatus = !(newsItem.is_active || newsItem.isActive);
        const result = await dispatch(updateNewsStatusThunk({ 
            newsId: newsItem.id, 
            isActive: newStatus 
        }));
        
        if (updateNewsStatusThunk.fulfilled.match(result)) {
            return { success: true };
        } else {
            return { success: false, error: result.payload?.message || result.payload || 'Cập nhật trạng thái thất bại!' };
        }
    }, [dispatch]);

    const deleteNews = useCallback(async (newsId) => {
        const result = await dispatch(deleteNewsItem(newsId));
        if (deleteNewsItem.fulfilled.match(result)) {
            return { success: true };
        } else {
            return { success: false, error: result.payload?.message || result.payload || 'Xóa tin tức thất bại!' };
        }
    }, [dispatch]);

    const handleSetCurrentNews = useCallback((newsItem) => {
        dispatch(setCurrentNews(newsItem));
    }, [dispatch]);

    const handleClearCurrentNews = useCallback(() => {
        dispatch(clearCurrentNews());
    }, [dispatch]);

    const handleSetFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const handleSetShowActive = useCallback((value) => {
        dispatch(setShowActive(value));
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
        currentNews,
        filters,
        showActive,
        fetchNewsList,
        loadNews,
        createNews,
        updateNews,
        updateStatus: handleUpdateStatus,
        deleteNews,
        setCurrentNews: handleSetCurrentNews,
        clearCurrentNews: handleClearCurrentNews,
        setFilters: handleSetFilters,
        resetFilters: handleResetFilters,
        setShowActive: handleSetShowActive,
        clearError: clearNewsError
    };
};
