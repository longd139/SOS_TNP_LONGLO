import { createAsyncThunk } from '@reduxjs/toolkit';
import { NEWS_API } from '../../apis/news';

export const fetchNews = createAsyncThunk(
    'news/fetchNews',
    async ({ page = 1, size = 10, isActive = true, idDanhMuc = null, search = '' }, { rejectWithValue }) => {
        try {
            const response = await NEWS_API.getAllNews({ page, size, isActive, idDanhMuc, search });
            
            return {
                data: response.content || response,
                pagination: response.pagination || {
                    currentPage: page,
                    pageSize: size,
                    totalPages: 1,
                    totalItems: response.content?.length || 0
                }
            };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách tin tức thất bại'
            });
        }
    }
);

export const createNewsItem = createAsyncThunk(
    'news/createNewsItem',
    async (newsData, { rejectWithValue }) => {
        try {
            const response = await NEWS_API.createNews(newsData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Tạo tin tức thất bại'
            });
        }
    }
);

export const updateNewsItem = createAsyncThunk(
    'news/updateNewsItem',
    async ({ newsId, newsData }, { rejectWithValue }) => {
        try {
            const response = await NEWS_API.updateNews(newsId, newsData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật tin tức thất bại'
            });
        }
    }
);

export const deleteNewsItem = createAsyncThunk(
    'news/deleteNewsItem',
    async (newsId, { rejectWithValue }) => {
        try {
            await NEWS_API.deleteNews(newsId);
            return newsId;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Xóa tin tức thất bại'
            });
        }
    }
);

export const updateNewsStatus = createAsyncThunk(
    'news/updateNewsStatus',
    async ({ newsId, isActive }, { rejectWithValue }) => {
        try {
            await NEWS_API.updateNewsStatus(newsId, isActive);
            return { newsId, isActive };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật trạng thái tin tức thất bại'
            });
        }
    }
);

export const uploadNewsFile = createAsyncThunk(
    'news/uploadFile',
    async ({ idTinTuc, fileData }, { rejectWithValue }) => {
        try {
            const response = await NEWS_API.uploadFile(idTinTuc, fileData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Upload file thất bại'
            });
        }
    }
);
