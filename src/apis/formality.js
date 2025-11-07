import apiClient from "../utils/apiClient";

const getFormalityApi = async ({
    page = 1,
    size = 10,
    search = '',
    id_linh_vuc,
    isActive = true
}) => {
    try {
        const params = new URLSearchParams({
            page,
            size,
            search,
            isActive
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

            const paginationObj = response.data.pagination || response.data.pagintation || (topData && (topData.pagination || topData.pagintation)) || null;

            return {
                content: content,
                totalElements: paginationObj?.totalItems || response.data.totalItems || 0,
                totalPages: paginationObj?.totalPages || 0,
                currentPage: paginationObj?.currentPage || page,
                pageSize: paginationObj?.pageSize || size
            };
        }
        else throw new Error(response.data.message || "Lấy danh sách thủ tục hành chính thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const createFormality = async (data) => {
    try {
        const response = await apiClient.post("/api/thu-tuc", data);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Tạo thủ tục hành chính thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getFormalityById = async (formalityId) => {
    try {
        const response = await apiClient.get(`/api/thu-tuc/${formalityId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy thủ tục hành chính theo ID thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getFormByFormalityId = async (formalityId) => {
    try {
        const response = await apiClient.get(`/api/thu-tuc/${formalityId}/mau-don`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy biểu mẫu theo thủ tục hành chính thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateFormality = async (formalityId, data) => {
    try {
        const response = await apiClient.put(`/api/thu-tuc/${formalityId}`, data);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật thủ tục hành chính thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteFormality = async (formalityId) => {
    try {
        const response = await apiClient.delete(`/api/thu-tuc/${formalityId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Xóa thủ tục hành chính thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateStatus = async (userProcedureId, isActive) => {
    try {
        const response = await apiClient.put(`/api/thu-tuc/update-status/${userProcedureId}`, { isActive });
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật trạng thái thủ tục thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getComponentByFormalityId = async (formalityId) => {
    try {
        const response = await apiClient.get(`/api/thu-tuc/${formalityId}/thanh-phan`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy thành phần theo thủ tục hành chính thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const FORMALITY_API = {
    getFormalityApi,
    createFormality,
    getFormalityById,
    getFormByFormalityId,
    updateFormality,
    deleteFormality,
    updateStatus,
    getComponentByFormalityId
}
