import apiClient from "../utils/apiClient";

const getFormalityApi = async ({
    page = 1,
    size = 10,
    search = '',
    id_linh_vuc,
    is_removed = false
}) => {
    try {
        const params = new URLSearchParams({
            page,
            size,
            search,
            is_removed
        });

        if (id_linh_vuc) {
            params.append('id_linh_vuc', id_linh_vuc);
        }

        const response = await apiClient.get("/api/thu-tuc", { params });
        if (response.data.success) {
            const topData = response.data.data;

            let content = [];
            if (Array.isArray(topData)) {
                content = topData;
            } else if (topData && Array.isArray(topData.data)) {
                content = topData.data;
            } else {
                content = [];
            }

            const paginationObj = response.data.pagintation || (topData && (topData.pagination || topData.pagintation)) || null;

            return {
                content: content,
                totalElements: paginationObj?.totalItems || response.data.totalItems || 0,
                totalPages: paginationObj?.totalPages || 0,
                currentPage: paginationObj?.currentPage || page,
                pageSize: paginationObj?.pageSize || size
            };
        }
        else throw new Error("Lấy danh sách thủ tục hành chính thất bại");
    } catch (error) {
        console.error('Error fetching formality data:', error);
        throw error;
    }
}

const createFormality = async (data) => {
    try {
        const response = await apiClient.post("/api/thu-tuc", data);
        if (response.data.success) return response.data.data;
        else throw new Error("Tạo thủ tục hành chính thất bại");
    } catch (error) {
        console.error("Lỗi khi tạo thủ tục hành chính:", error);
        throw error;
    }
}

const getFormalityById = async (formalityId) => {
    try {
        const response = await apiClient.get(`/api/thu-tuc/${formalityId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy thủ tục hành chính theo ID thất bại");
    } catch (error) {
        console.error("Lỗi khi lấy thủ tục hành chính theo ID:", error);
        throw error;
    }
}

const getFormByFormalityId = async (formalityId) => {
    try {
        const response = await apiClient.get(`/api/thu-tuc/${formalityId}/mau-don`);
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy biểu mẫu theo thủ tục hành chính thất bại");
    } catch (error) {
        console.error("Lỗi khi lấy biểu mẫu theo thủ tục hành chính:", error);
        throw error;
    }
}

const updateFormality = async (formalityId, data) => {
    try {
        const response = await apiClient.put(`/api/thu-tuc/${formalityId}`, data);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật thủ tục hành chính thất bại");
    } catch (error) {
        console.error("Lỗi khi cập nhật thủ tục hành chính:", error);
        throw error;
    }
}

const deleteFormality = async (formalityId) => {
    try {
        const response = await apiClient.delete(`/api/thu-tuc/${formalityId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Xóa thủ tục hành chính thất bại");
    } catch (error) {
        console.error("Lỗi khi xóa thủ tục hành chính:", error);
        throw error;
    }
}

export const FORMALITY_API = {
    getFormalityApi,
    createFormality,
    getFormalityById,
    getFormByFormalityId,
    updateFormality,
    deleteFormality
}
