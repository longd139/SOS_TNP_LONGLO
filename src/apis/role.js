import apiClient from "../utils/apiClient";

const getRole = async (search = '') => {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);

        const response = await apiClient.get('/api/role', { params });
        if (response.data.success) {
            return response.data.data || [];
        } else {
            throw new Error(response.data.message || 'Lấy danh sách vai trò thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}
 
const createRole = async (roleData) => {
    try {
        const response = await apiClient.post('/api/role', roleData);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Tạo vai trò thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getRoleByPagination = async (page, size, search = '', isActive) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        if (search) params.append('search', search);
        if (typeof isActive === 'boolean') {
            params.append('isActive', isActive);
        }
        const response = await apiClient.get('/api/role/pagination', { params });
        if (response.data.success) {
            return {
                data: response.data.data || [],
                pagination: response.data.pagination || null
            };
        } else {
            throw new Error(response.data.message || 'Lấy danh sách vai trò theo phân trang thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getRoleById = async (roleId) => {
    try {
        const response = await apiClient.get(`/api/role/${roleId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Lấy vai trò thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateRole = async (roleId, roleData) => {
    try {
        const response = await apiClient.put(`/api/role/${roleId}`, roleData);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Cập nhật vai trò thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteRole = async (roleId) => {
    try {
        const response = await apiClient.delete(`/api/role/${roleId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Xóa vai trò thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateStatusRole = async (roleId, isActive) => {
    try {
        const response = await apiClient.put(`/api/role/update-status/${roleId}`, { isActive });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Cập nhật trạng thái vai trò thất bại');
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const ROLE_API = {
    getRole,
    createRole,
    getRoleByPagination,
    getRoleById,
    updateRole,
    deleteRole,
    updateRoleStatus: updateStatusRole,
}