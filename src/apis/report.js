import apiClient from "../utils/apiClient";

const getReportPagination = async (params) => {
    try {
        const response = await apiClient.get("/api/phan-anh", { params });
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Lấy danh sách phản ánh thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getHistoryStatus = async (reportId) => {
    try {
        const response = await apiClient.get(`/api/phan-anh/${reportId}/lich-su-trang-thai`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy lịch sử trạng thái thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getExtent = async () => {
    try {
        const response = await apiClient.get("/api/phan-anh/muc-do");
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy mức độ phản ánh thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getStatusReport = async () => {
    try {
        const response = await apiClient.get("/api/phan-anh/trang-thai");
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy trạng thái phản ánh thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getReportById = async (reportId) => {
    try {
        const response = await apiClient.get(`/api/phan-anh/${reportId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy phản ánh thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateStatusReport = async (reportId, statusData) => {
    try {
        const response = await apiClient.put(`/api/phan-anh/update-status/${reportId}`, statusData);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Cập nhật trạng thái phản ánh thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const REPORT_API = {
    getReportPagination,
    getHistoryStatus,
    getExtent,
    getStatusReport,
    getReportById,
    updateStatusReport,
};