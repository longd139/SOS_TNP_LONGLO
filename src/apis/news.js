import { apiFormClient } from "../utils/apiClient";

const createNews = async (newsData) => {
    try {
        const response = await apiFormClient.post("/api/tin-tuc", newsData);
        if (response.data.success) return response.data.data;
        else throw new Error("Tạo tin tức thất bại");
    } catch (error) {
        throw error;
    }
}

const getAllNews = async (page, size, isRemoved, idDanhMuc) => {
    try {
        const params = { page, size };
        if (isRemoved !== undefined && isRemoved !== null) params.isRemoved = isRemoved;
        if (idDanhMuc) params.idDanhMuc = idDanhMuc;
        
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
        throw error;
    }
}

const updateNews = async (newsId, newsData) => {
    try {
        const response = await apiFormClient.put(`/api/tin-tuc/${newsId}`, newsData);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật tin tức thất bại");
    } catch (error) {
        throw error;
    }
}

const getNewsById = async (newsId) => {
    try {
        const response = await apiFormClient.get(`/api/tin-tuc/${newsId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy tin tức thất bại");
    } catch (error) {
        throw error;
    }
}

const deleteNews = async (newsId) => {
    try {
        const response = await apiFormClient.delete(`/api/tin-tuc/${newsId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Xóa tin tức thất bại");
    } catch (error) {
        throw error;
    }
}

const uploadFile = async (idTinTuc, fileData) => {
    try {
        const response = await apiFormClient.post(`/api/tin-tuc/upload/${idTinTuc}`, fileData);
        if (response.data.success) return response.data.data;
        else throw new Error("Tải lên tệp tin thất bại");
    } catch (error) {
        throw error;
    }
}

export const NEWS_API = {
    createNews,
    getAllNews,
    updateNews,
    getNewsById,
    deleteNews,
    uploadFile
}