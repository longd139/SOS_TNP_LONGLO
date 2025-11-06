// apis/committee.js
import apiClient from "../utils/apiClient";

const createCommittee = async (data) => {
    try {
        const response = await apiClient.post("/api/uy-ban", data); 
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Tạo ủy ban thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getCommittees = async () => {
    try {
        const response = await apiClient.get("/api/uy-ban");
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy danh sách ủy ban thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateCommittee = async (committeeId, data) => {
    try {
        const response = await apiClient.put(`/api/uy-ban/${committeeId}`, data);
        
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Cập nhật ủy ban thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const COMMITTEE_API = {
    createCommittee,
    getCommittees,
    updateCommittee
}