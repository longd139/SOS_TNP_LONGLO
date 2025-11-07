import { apiFormClient } from "../utils/apiClient";

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

const getAllForms = async (isRemoved = false, search = '') => {
    try {
        const response = await apiFormClient.get('/api/mau-don', {
            params: { isActive: !isRemoved, search }
        });
        if (response.data.success) return keysToCamel(response.data.data);
        else throw new Error("Lấy tất cả biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

const deleteForm = async (formId) => {
    try {
        const response = await apiFormClient.delete(`/api/mau-don/${formId}`);
        if (response?.data?.success) {
            return keysToCamel(response.data.data);
        }
        try {
            const fallbackPayload = { isDelete: 1, is_delete: 1, is_removed: 1 };
            const fallbackResp = await apiFormClient.put(`/api/mau-don/${formId}`, fallbackPayload);
            if (fallbackResp?.data?.success) return keysToCamel(fallbackResp.data.data);
        } catch (fbErr) {
        }

        throw new Error("Xóa biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
}

export const updateMauDonStatus = async (mauDonId, isActive, options = {}) => {
  try {
    const config = {};
    if (typeof options.timeout !== 'undefined') config.timeout = options.timeout;
    if (typeof options.headers !== 'undefined') config.headers = options.headers;

    const response = await apiFormClient.put(`/api/mau-don/update-status/${mauDonId}`, { isActive }, config);

    if (response?.data?.success) {
      return keysToCamel(response.data.data);
    }

    throw new Error(response?.data?.message || 'Cập nhật trạng thái mẫu đơn thất bại');
  } catch (error) {
    throw error;
  }
};

const getFormById = async (formId) => {
    try {
        const response = await apiFormClient.get(`/api/mau-don/${formId}`);
        if (response.data.success) return keysToCamel(response.data.data);
        else throw new Error("Lấy biểu mẫu thất bại");
    } catch (error) {
        throw error;
    }
};

const getAllFromPaging = async (pageIndex, pageSize, isRemoved = false, search = '') => {
    try {
        const response = await apiFormClient.get('/api/mau-don/paging', {
            params: { pageIndex, pageSize, isActive: !isRemoved, search }
        });
        if (response.data.success) return keysToCamel(response.data.data);
        else throw new Error("Lấy biểu mẫu phân trang thất bại");
    } catch (error) {
        throw error;
    }
};

export const FORM_API = {
    createForm,
    updateForm,
    getAllForms,
    deleteForm,
    updateMauDonStatus,
    getFormById,
    getAllFromPaging
}