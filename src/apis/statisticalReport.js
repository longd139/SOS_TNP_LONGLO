import apiClient from "../utils/apiClient";


const getPhanAnhReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/phan-anh", { params });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy báo cáo phản ánh thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const exportPhanAnhReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/phan-anh/export", {
            params,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const getThuTucReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/thu-tuc", { params });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy báo cáo thủ tục thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const exportThuTucReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/thu-tuc/export", {
            params,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const getTinTucReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/tin-tuc", { params });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy báo cáo tin tức thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const exportTinTucReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/tin-tuc/export", {
            params,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const STATISTICAL_REPORT_API = {
    getPhanAnhReport,
    exportPhanAnhReport,
    getThuTucReport,
    exportThuTucReport,
    getTinTucReport,
    exportTinTucReport
};