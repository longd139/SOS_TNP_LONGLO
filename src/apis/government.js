import apiClient from "../utils/apiClient";

const getGovernment = async ({ search = '', isRemoved = false, page, size } = {}) => {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('isRemoved', isRemoved);
        params.append('is_removed', isRemoved);
        if (page !== undefined) params.append('page', page);
        if (size !== undefined) params.append('size', size);

        const response = await apiClient.get('/api/co-so-dich-vu-cong', {
            params
        });

        if (!response.data.success) throw new Error('Failed to fetch government data');

        const raw = response.data.data;
        if (!raw) return { content: [], pagination: null };

        if (Array.isArray(raw)) {
            return { content: raw, pagination: response.data.pagintation || response.data.pagination || null };
        }

        const content = raw.data || raw.content || [];
        const pagination = raw.pagination || raw.pagintation || response.data.pagintation || response.data.pagination || null;
        return { content, pagination };
    } catch (error) {
        console.error('Error fetching government data:', error);
        throw error;
    }
}

const createGovernment = async (governmentData) => {
    try {
        const response = await apiClient.post('/api/co-so-dich-vu-cong', governmentData);
        if (!response.data.success) throw new Error('Failed to create government data');
        return response.data.data;
    } catch (error) {
        console.error('Error creating government data:', error);
        throw error;
    }
}

const getGovernmentById = async (id) => {
    try {
        const response = await apiClient.get(`/api/co-so-dich-vu-cong/${id}`);
        if (!response.data.success) throw new Error('Failed to fetch government data by ID');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching government data by ID:', error);
        throw error;
    }
}

const updateGovernment = async (id, governmentData) => {
    try {
        const response = await apiClient.put(`/api/co-so-dich-vu-cong/${id}`, governmentData);
        if (!response.data.success) throw new Error('Failed to update government data');
        return response.data.data;
    } catch (error) {
        console.error('Error updating government data:', error);
        throw error;
    }
}

const deleteGovernment = async (id) => {
    try {
        const response = await apiClient.delete(`/api/co-so-dich-vu-cong/${id}`);
        if (!response.data.success) throw new Error('Failed to delete government data');
        return response.data.data;
    } catch (error) {
        console.error('Error deleting government data:', error);
        throw error;
    }
}

export const GOVERNMENT_API = {
    getGovernment,
    createGovernment,
    getGovernmentById,
    updateGovernment,
    deleteGovernment
}
