import apiClient from '../utils/apiClient';

const getAreas = async (isActive, search) => {
    try {
        const params = new URLSearchParams();
        if (typeof isActive === 'boolean') {
            params.append('isActive', isActive);
        }
        if (typeof search === 'string') {
            params.append('search', search);
        }
        const response = await apiClient.get("/api/linh-vuc", { params });
        if (response.data.success) {
            return response.data.data || [];
        }
        else throw new Error(response.data.message || "Lấy danh sách lĩnh vực thất bại");    
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const createAreas = async (areaData) => {
    try {
        const response = await apiClient.post("/api/linh-vuc", areaData);
        if (response.data.success) {
            return response.data.data;
        }
        else throw new Error(response.data.message || "Tạo lĩnh vực thất bại");    
    }
    catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }   
}

const updateArea = async (areaId, areaData) => {
    try {
        const response = await apiClient.put(`/api/linh-vuc/${areaId}`, areaData);
        if (response.data.success) {
            return response.data.data;
        }
        else throw new Error(response.data.message || "Cập nhật lĩnh vực thất bại");    
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteArea = async (areaId) => {
    try {
        const response = await apiClient.delete(`/api/linh-vuc/${areaId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Xóa lĩnh vực thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }   
        throw error;
    }
}

const getAreaById = async (areaId) => {
    try {
        const response = await apiClient.get(`/api/linh-vuc/${areaId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy lĩnh vực thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateAreaStatus = async (areaId, isActive) => {
    try {
        const response = await apiClient.put(`/api/linh-vuc/update-status/${areaId}`, { isActive });
        if (response.data.success) {
            return response.data.data;
        }
        else throw new Error(response.data.message || "Cập nhật trạng thái lĩnh vực thất bại");    
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getAreasPagination = async (page, size , isActive, search) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size );
        if (typeof isActive === 'boolean') {
            params.append('isActive', isActive);
        }
        if (typeof search === 'string') {
            params.append('search', search);
        }
        const response = await apiClient.get("/api/linh-vuc/pagination", { params });
        if (response.data.success) {
            return response.data;
        }
        else throw new Error(response.data.message || "Lấy danh sách lĩnh vực thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const AREAS_API = {
    getAreas,
    createAreas,
    updateArea,
    deleteArea,
    getAreaById,
    updateAreaStatus,
    getAreasPagination
};

export default AREAS_API;