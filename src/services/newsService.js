import { NEWS_API } from '../apis/news';

const formatError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'Đã xảy ra lỗi';
};

export const getAllNews = async ({ page, size, isActive, idDanhMuc }) => {
    try {
        return await NEWS_API.getAllNews({ page, size, isActive, idDanhMuc });
    } catch (error) {
        throw new Error(formatError(error));
    }
};

export const getNewsById = async (newsId) => {
    try {
        return await NEWS_API.getNewsById(newsId);
    } catch (error) {
        throw new Error(formatError(error));
    }
};

export const createNews = async (newsData) => {
    try {
        return await NEWS_API.createNews(newsData);
    } catch (error) {
        throw new Error(formatError(error));
    }
};

export const updateNews = async (newsId, newsData) => {
    try {
        return await NEWS_API.updateNews(newsId, newsData);
    } catch (error) {
        throw new Error(formatError(error));
    }
};

export const updateNewsStatus = async (newsId, isActive) => {
    try {
        return await NEWS_API.updateNewsStatus(newsId, isActive);
    } catch (error) {
        throw new Error(formatError(error));
    }
};

export const deleteNews = async (newsId) => {
    try {
        return await NEWS_API.deleteNews(newsId);
    } catch (error) {
        throw new Error(formatError(error));
    }
};

export const uploadNewsFile = async (idTinTuc, fileData) => {
    try {
        return await NEWS_API.uploadFile(idTinTuc, fileData);
    } catch (error) {
        throw new Error(formatError(error));
    }
};
