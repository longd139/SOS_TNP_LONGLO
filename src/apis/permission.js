import apiClient from "../utils/apiClient";

const getAllPermissions = async (search = '', danhMuc) => {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (danhMuc) params.append('danhMuc', danhMuc);
        const response = await apiClient.get('/api/permission', { params });
        if (response.data.success) {
            return response.data.data || [];
        } else {
            throw new Error(response.data.message || 'Lấy danh sách quyền thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getPermissionCategory = async () => {
    try {
        const response = await apiClient.get('/api/permission/cate');
        if (response.data.success) {
            return response.data.data || [];
        } else {
            throw new Error(response.data.message || 'Lấy danh mục quyền thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const PERMISSION_API = {
    getAllPermissions,
    getPermissionCategory
};