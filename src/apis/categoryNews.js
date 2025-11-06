import apiClient from "../utils/apiClient";

const createCategory = async (categoryData) => {
    try {
        const response = await apiClient.post("/api/danh-muc-tin-tuc", categoryData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Tạo danh mục thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getAllCategories = async (isRemoved) => {
    try {
        const response = await apiClient.get("/api/danh-muc-tin-tuc", {
            params: { isRemoved }
        });
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy danh sách danh mục thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await apiClient.put(`/api/danh-muc-tin-tuc/${categoryId}`, categoryData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật danh mục thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getCategoryById = async (categoryId) => {
    try {
        const response = await apiClient.get(`/api/danh-muc-tin-tuc/${categoryId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy danh mục thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`/api/danh-muc-tin-tuc/${categoryId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Xóa danh mục thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const CATEGORY_API = {
    createCategory,
    getAllCategories,
    updateCategory,
    getCategoryById,
    deleteCategory
}