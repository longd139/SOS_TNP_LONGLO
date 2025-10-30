import apiClient from "../utils/apiClient";

const getGovernment = async (isRemoved, search) => {
    try {
        const params = new URLSearchParams();
        const response = await apiClient.get('/api/co-so-dich-vu-cong', {
            params
        });

        if (!response.data.success) throw new Error('Failed to fetch government data');
        return response.data.data;
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
