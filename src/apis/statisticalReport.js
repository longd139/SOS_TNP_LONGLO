import apiClient from "../utils/apiClient";

const getSummaryReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/tong-hop", { params });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy báo cáo tổng hợp thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const exportSummaryReportExcel = async (params) => {
    try {
        const response = await apiClient.get("/api/report/tong-hop/export-excel", {
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

const getFieldReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/linh-vuc", { params });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy báo cáo lĩnh vực thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const exportFieldReportExcel = async (params) => {
    try {
        const response = await apiClient.get("/api/report/linh-vuc/export-excel", {
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

const getStatusReport = async (params) => {
    try {
        const response = await apiClient.get("/api/report/trang-thai", { params });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy báo cáo trạng thái thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

const exportStatusReportExcel = async (params) => {
    try {
        const response = await apiClient.get("/api/report/trang-thai/export-excel", {
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
    getSummaryReport,
    exportSummaryReportExcel,
    getFieldReport,
    exportFieldReportExcel,
    getStatusReport,
    exportStatusReportExcel
};