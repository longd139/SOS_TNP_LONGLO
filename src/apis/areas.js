import apiClient from '../utils/apiClient';

const getAreas = async (is_removed, search) => {
    try {
        const params = new URLSearchParams();
        if (typeof is_removed === 'boolean') {
            params.append('is_removed', is_removed);
        }
        if (typeof search === 'string') {
            params.append('search', search);
        }
        const response = await apiClient.get("/api/linh-vuc", { params });
        if (response.data.success) {
            return response.data.data || [];
        }
        else throw new Error("Lấy danh sách lĩnh vực thất bại");    
    } catch (error) {
        throw error;
    }
}

const createAreas = async (areaData) => {
    try {
        const response = await apiClient.post("/api/linh-vuc", areaData);
        if (response.data.success) {
            return response.data.data;
        }
        else throw new Error("Tạo lĩnh vực thất bại");    
    }
    catch (error) {
        throw error;
    }   
}
export const AREAS_API = {
    getAreas,
    createAreas
};

export default AREAS_API;