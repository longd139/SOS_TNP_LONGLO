import apiClient from "../utils/apiClient";

const createCommittee = async (data) => {
    try {
        const response = await apiClient.post("/api/uy-ban", data); 
        if (response.data.success) return response.data.data;
        else throw new Error("Tạo ủy ban thất bại");
    } catch (error) {
        console.error("Lỗi khi tạo ủy ban:", error);
        throw error;
    }
}

const getCommittees = async () => {
    try {
        const response = await apiClient.get("/api/uy-ban");
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy danh sách ủy ban thất bại");
    } catch (error) {
        console.error("Lỗi khi lấy danh sách ủy ban:", error);
        throw error;
    }
}

const updateCommittee = async (committeeId, data) => {
    try {
        const response = await apiClient.put(`/api/uy-ban/${committeeId}`, data);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật ủy ban thất bại");
    } catch (error) {
        console.error("Lỗi khi cập nhật ủy ban:", error);
        throw error;
    }
}

export const COMMITTEE_API = {
    createCommittee,
    getCommittees,
    updateCommittee
}