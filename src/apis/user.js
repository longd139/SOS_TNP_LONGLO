import apiClient from "../utils/apiClient";

const getMyProfile = async () => {
    try {
        const response = await apiClient.get("/api/users/my-profile");
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy thông tin cá nhân thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getAllUsersWithPagination = async ({
    page = 1,
    size = 10,
}) => {
    try {
        const params = new URLSearchParams({
            page,
            size,
        });

        const response = await apiClient.get("/api/users", { params });
        if (response.data.success) {
            const mappedData = response.data.data.map(user => {
                return {
                    id: user.id,
                    username: user.ten_dang_nhap,
                    fullName: user.ho_va_ten,
                    email: user.email,
                    phone: user.so_dien_thoai,
                    role: user.vai_tro,
                    twoFactorAuth: user.xac_thuc_hai_yeu_to,
                    active: user.is_active,
                    createdAt: user.thoi_gian_tao,
                    updatedAt: user.thoi_gian_cap_nhat
                };
            });

            const pagination = response.data.pagintation || response.data.pagination;
            return {
                content: mappedData,
                totalElements: pagination?.totalItems || 0,
                totalPages: pagination?.totalPages || 0,
                currentPage: pagination?.currentPage || 1,
                pageSize: pagination?.pageSize || size
            };
            
        } else {
            throw new Error(response.data.message || "Lấy danh sách người dùng thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateUserProfile = async (userData) => {
    try {
        const response = await apiClient.put("/api/users", userData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật thông tin cá nhân thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const createAccount = async (accountData) => {
    try {
        const requestData = {
            tenDangNhap: accountData.username,
            email: accountData.email,
            matKhau: accountData.password,
            vaiTro: accountData.role
        };

        const response = await apiClient.post("/api/users/create-account", requestData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Tạo tài khoản thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateUserProfileByAdmin = async (userData) => {
    try {
        const requestData = {
            userId: userData.id,
            hoVaTen: userData.fullName,
            soDienThoai: userData.phone || "",
            vaiTro: userData.role
        };

        const response = await apiClient.put("/api/users/update-by-admin", requestData);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật thông tin người dùng thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/api/users/${userId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Xóa người dùng thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const updateStatus = async (userId, isActive) => {
    try {
        const response = await apiClient.put(`/api/users/update-status/${userId}`, { isActive });
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Cập nhật trạng thái người dùng thất bại");
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const USER_API = {
    getMyProfile,
    getAllUsersWithPagination,
    updateUserProfile,
    createAccount,
    updateUserProfileByAdmin,
    deleteUser,
    updateStatus
}