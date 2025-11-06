import { apiFormClient } from "../utils/apiClient";

const createNews = async (newsData) => {
    try {
        const response = await apiFormClient.post("/api/tin-tuc", newsData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Tạo tin tức thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getAllNews = async ({ page, size, isActive, idDanhMuc, search }) => {
    try {
        const params = { page, size };
        if (isActive !== undefined && isActive !== null) params.isActive = isActive;
        if (idDanhMuc) params.idDanhMuc = idDanhMuc;
        if (search) params.search = search;
        const response = await apiFormClient.get("/api/tin-tuc", { params });
        
        if (response.data.success) {
            return {
                content: response.data.data || [],
                pagination: response.data.pagination || {
                    currentPage: page,
                    pageSize: size,
                    totalPages: 1,
                    totalItems: response.data.data?.length || 0
                }
            };
        } else {
            throw new Error(response.data.message || "Lấy danh sách tin tức thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateNews = async (newsId, newsData) => {
    try {
        const response = await apiFormClient.put(`/api/tin-tuc/${newsId}`, newsData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật tin tức thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getNewsById = async (newsId) => {
    try {
        const response = await apiFormClient.get(`/api/tin-tuc/${newsId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy tin tức thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateNewsStatus = async (newsId, isActive) => {
    try {
        const response = await apiFormClient.put(`/api/tin-tuc/update-status/${newsId}`, { isActive });
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật trạng thái tin tức thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteNews = async (newsId) => {
    try {
        const response = await apiFormClient.delete(`/api/tin-tuc/${newsId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Xóa tin tức thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const uploadFile = async (idTinTuc, fileData) => {
    try {
        const response = await apiFormClient.post(`/api/tin-tuc/upload/${idTinTuc}`, fileData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Tải lên tệp tin thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const NEWS_API = {
    createNews,
    getAllNews,
    updateNews,
    getNewsById,
    updateNewsStatus,
    deleteNews,
    uploadFile
}