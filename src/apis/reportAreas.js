import apiClient from "../utils/apiClient";

const createReportArea = async (report) => {
    try {
        const response = await apiClient.post("/api/linh-vuc-phan-anh", report);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Tạo lĩnh vực báo cáo thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getAllReportAreas = async (
    page,
    size,
    isActive,
    search
) => {
    try {
        const params = new URLSearchParams({
            page,
            size
        });

        if (typeof isActive === 'boolean') {
            params.append('isActive', isActive);
        }
        if (typeof search === 'string') {
            params.append('search', search);
        }
        const response = await apiClient.get("/api/linh-vuc-phan-anh", { params });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy danh sách lĩnh vực báo cáo thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateReportArea = async (areaId, areaData) => {
    try {
        const response = await apiClient.put(`/api/linh-vuc-phan-anh/${areaId}`, areaData);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Cập nhật lĩnh vực báo cáo thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}
const getReportAreaById = async (areaId) => {
    try {
        const response = await apiClient.get(`/api/linh-vuc-phan-anh/${areaId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy lĩnh vực báo cáo thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }  
}   

const deleteReportArea = async (areaId) => {
    try {
        const response = await apiClient.delete(`/api/linh-vuc-phan-anh/${areaId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Xóa lĩnh vực báo cáo thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateReportAreaStatus = async (areaId, isActive) => {
    try {
        const response = await apiClient.put(`/api/linh-vuc-phan-anh/update-status/${areaId}`, { isActive });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Cập nhật trạng thái lĩnh vực báo cáo thất bại");
        }   
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const REPORT_AREAS_API = {
    createReportArea,
    getAllReportAreas,
    updateReportArea,
    getReportAreaById,
    deleteReportArea,
    updateReportAreaStatus
};