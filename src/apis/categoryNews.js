import apiClient from "../utils/apiClient";

const createCategory = async (categoryData) => {
    try {
        const response = await apiClient.post("/api/danh-muc-tin-tuc", categoryData);
        if (response.data.success) return response.data.data;
        else throw new Error("Tạo danh mục thất bại");
    } catch (error) {
        throw error;
    }
}

const getAllCategories = async (isRemoved) => {
    try {
        const response = await apiClient.get("/api/danh-muc-tin-tuc", {
            params: { isRemoved }
        });
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy danh sách danh mục thất bại");
    } catch (error) {
        throw error;
    }
}

const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await apiClient.put(`/api/danh-muc-tin-tuc/${categoryId}`, categoryData);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật danh mục thất bại");
    } catch (error) {
        throw error;
    }
}

const getCategoryById = async (categoryId) => {
    try {
        const response = await apiClient.get(`/api/danh-muc-tin-tuc/${categoryId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy danh mục thất bại");
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`/api/danh-muc-tin-tuc/${categoryId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Xóa danh mục thất bại");
    } catch (error) {
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