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
export const AREAS_API = {
    getAreas,
    createAreas
};

export default AREAS_API;