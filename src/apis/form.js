import { apiFormClient } from "../utils/apiClient";

const createForm = async (formData) => {
    try {
        const response = await apiFormClient.post('/api/mau-don', formData);
        if (response.data.success) return response.data.data;
        else throw new Error("Tạo biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

const updateForm = async (formId, formData) => {
    try {
        const response = await apiFormClient.put(`/api/mau-don/${formId}`, formData);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

const getAllForms = async (isRemoved = false) => {
    try {
        const response = await apiFormClient.get('/api/mau-don', {
            params: { isRemoved }
        });
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy tất cả biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

const deleteForm = async (formId) => {
    try {
        const response = await apiFormClient.delete(`/api/mau-don/${formId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Xóa biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

export const FORM_API = {
    createForm,
    updateForm,
    getAllForms,
    deleteForm
}