import { apiFormClient } from "../utils/apiClient";

// Helper: convert snake_case keys to camelCase recursively
const toCamel = (s) => s.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());

function keysToCamel(obj) {
    if (Array.isArray(obj)) {
        return obj.map(v => keysToCamel(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = toCamel(key);
            acc[camelKey] = keysToCamel(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

const createForm = async (formData, options = {}) => {
    // options: { onUploadProgress?: function, timeout?: number }
    try {
        const config = {};
        if (options.onUploadProgress) config.onUploadProgress = options.onUploadProgress;

    const response = await apiFormClient.post('/api/mau-don', formData, config);
    if (response.data.success) return keysToCamel(response.data.data);
        else throw new Error("Tạo biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

const updateForm = async (formId, formData, options = {}) => {
    // options: { onUploadProgress?: function, timeout?: number }
    try {
        const config = {};
        if (options.onUploadProgress) config.onUploadProgress = options.onUploadProgress;

    const response = await apiFormClient.put(`/api/mau-don/${formId}`, formData, config);
    if (response.data.success) return keysToCamel(response.data.data);
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
        if (response.data.success) return keysToCamel(response.data.data);
        else throw new Error("Lấy tất cả biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

const deleteForm = async (formId) => {
    try {
        console.log('[FORM_API] deleteForm request id:', formId);
        const response = await apiFormClient.delete(`/api/mau-don/${formId}`);
        console.log('[FORM_API] deleteForm response status:', response.status, 'data:', response.data);
        if (response.data.success) return keysToCamel(response.data.data);
        else {
            console.error('[FORM_API] deleteForm failed response:', response.data);
            throw new Error("Xóa biểu mẫu thất bại");
        }
    } catch (error) {
        console.error('[FORM_API] deleteForm error:', error);
        throw error;
    }
}

export const FORM_API = {
    createForm,
    updateForm,
    getAllForms,
    deleteForm
}