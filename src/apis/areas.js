import apiClient from '../utils/apiClient';

const getAreas = async (is_removed) => {
    try {
        const params = new URLSearchParams();
        if (typeof is_removed === 'boolean') {
            params.append('is_removed', is_removed);
        }
        const response = await apiClient.get("/api/linh-vuc", { params });
        if (response.data.success) {
            return response.data.data || [];
        }
        else throw new Error("Lấy danh sách lĩnh vực thất bại");    
    } catch (error) {
        console.error('Error fetching areas data:', error);
        throw error;
    }
}

export const AREAS_API = {
    getAreas
};

export default AREAS_API;