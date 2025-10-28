import { apiFormClient } from "../utils/apiClient";

const createForm = async (formData) => {
    try {
        const response = await apiFormClient.post('/api/mau-don', formData);
        if (response.data.success) return response.data.data;
        else throw new Error("Tạo biểu mẫu thất bại");
    } catch (error) {
        console.error("Lỗi khi tạo biểu mẫu:", error);
        throw error;
    }
}

const updateForm = async (formId, formData) => {
    try {
        const response = await apiFormClient.put(`/api/mau-don/${formId}`, formData);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật biểu mẫu thất bại");
    } catch (error) {
        console.error("Lỗi khi cập nhật biểu mẫu:", error);
        throw error;
    }
}

export const FORM_API = {
    createForm,
    updateForm
}