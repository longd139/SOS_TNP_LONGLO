import apiClient from "../utils/apiClient";

const getMyProfile = async () => {
    try {
        const primary = "/api/users/my-profile";

        try {
            const response = await apiClient.get(primary);
            if (response.data && response.data.success) return response.data.data;
            if (response && response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
                return response.data;
            }
            throw new Error(response.data?.message || "Lấy thông tin cá nhân thất bại");
        } catch (err) {
            const status = err?.response?.status;
            if (status === 404) {
                const alternatives = ["/api/users/me", "/api/users/profile", "/api/auth/me"];
                for (const path of alternatives) {
                    try {
                        const r = await apiClient.get(path);
                        if (r.data && r.data.success) return r.data.data;
                        if (r.data && !r.data.success && typeof r.data === 'object' && Object.keys(r.data).length > 0) return r.data;
                    } catch (e2) {

                    }
                }
            }
            throw err;
        }
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
    isActive,
    vaiTro,
    search
}) => {
    try {
        const params = new URLSearchParams({
            page,
            size,
        });

        if (isActive !== undefined && isActive !== null && isActive !== '') {
            params.append('isActive', isActive);
        }

        if (vaiTro && vaiTro !== '') {
            params.append('vaiTro', vaiTro);
        }
        if (search && search.trim() !== '') {
            params.append('search', search.trim());
        }

        const response = await apiClient.get("/api/users", { params });
        if (response.data.success) {
            const mappedData = response.data.data.map(user => ({
                id: user.id,
                username: user.ten_dang_nhap || user.username,
                fullName: user.ho_va_ten || user.ho_ten || user.fullName || user.ten,
                email: user.email || user.email_dang_nhap,
                phone: user.so_dien_thoai || user.sdt,
                role: user.vai_tro || user.role,
                twoFactorAuth: user.xac_thuc_hai_yeu_to,
                active: user.is_active,
                createdAt: user.thoi_gian_tao,
                updatedAt: user.thoi_gian_cap_nhat
            }));

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

const searchUsers = async (keyword) => {
    try {
        const params = { search: keyword};
        const response = await apiClient.get("/api/users/search", { params });

        if (response.data.success) {
            return response.data.data.map(user => ({
                id: user.id,
                username: user.ten_dang_nhap || user.username,
                fullName: user.ho_va_ten || user.ho_ten || user.fullName || user.ten,
                email: user.email || user.email_dang_nhap,
                phone: user.so_dien_thoai || user.sdt,
                role: user.vai_tro || user.role,
                active: user.is_active,
            }));
        } else {
            return [];
        }
    } catch (error) {
        return [];
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
        else {
             const errorData = {
                message: response.data.message || "Tạo tài khoản thất bại",
                errors: response.data.errors || []
            };
            throw errorData;
        }
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
            vaiTro: userData.role,
            tenDangNhap: userData.username,
            email: userData.email,
            matKhau: userData.password || undefined,
        };

        const response = await apiClient.put("/api/users/update-by-admin", requestData);
        if (response.data.success) return response.data.data;
        else {
             const errorData = {
                message: response.data.message || "Cập nhật thông tin người dùng thất bại",
                errors: response.data.errors || []
            };
            throw errorData;
        }
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

const getUserById = async (userId) => {
    try {
        const response = await apiClient.get(`/api/users/${userId}`);
        if (response.data.success) return response.data.data;
        else throw new Error(response.data.message || "Lấy thông tin người dùng thất bại");
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
    updateStatus,
    getUserById,
    searchUsers 
}