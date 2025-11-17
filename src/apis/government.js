import apiClient from "../utils/apiClient";

const getGovernment = async ({ search = '', isActive = true, page, size } = {}) => {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('isActive', isActive);
        params.append('is_active', isActive);
        if (page !== undefined) params.append('page', page);
        if (size !== undefined) params.append('size', size);

        const response = await apiClient.get('/api/co-so-dich-vu-cong', {
            params
        });

        if (!response.data.success) throw new Error(response.data.message || 'Failed to fetch government data');

        const raw = response.data.data;
        if (!raw) return { content: [], pagination: null };

        if (Array.isArray(raw)) {
            return { content: raw, pagination: response.data.pagination || null };
        }

        const content = raw.data || raw.content || [];
        const pagination = raw.pagination || response.data.pagination || null;
        return { content, pagination };
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const createGovernment = async (governmentData) => {
    try {
        const response = await apiClient.post('/api/co-so-dich-vu-cong', governmentData);
        if (!response.data.success) throw new Error(response.data.message || 'Failed to create government data');
        return response.data.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getGovernmentById = async (id) => {
    try {
        const response = await apiClient.get(`/api/co-so-dich-vu-cong/${id}`);
        if (!response.data.success) throw new Error(response.data.message || 'Failed to fetch government data by ID');
        return response.data.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateGovernment = async (id, governmentData) => {
    try {
        const response = await apiClient.put(`/api/co-so-dich-vu-cong/${id}`, governmentData);
        if (!response.data.success) throw new Error(response.data.message || 'Failed to update government data');
        return response.data.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteGovernment = async (id) => {
    try {
        const response = await apiClient.delete(`/api/co-so-dich-vu-cong/${id}`);
        if (!response.data.success) throw new Error(response.data.message || 'Failed to delete government data');
        return response.data.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateStatusGovernment = async (id, isActive) => {
    try {
        const response = await apiClient.put(`/api/co-so-dich-vu-cong/update-status/${id}`, { isActive });
        if (!response.data.success) throw new Error(response.data.message || 'Failed to update government status');
        return response.data.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const GOVERNMENT_API = {
    getGovernment,
    createGovernment,
    getGovernmentById,
    updateGovernment,
    deleteGovernment,
    updateStatusGovernment
}
