import apiClient from "../utils/apiClient";

const getMyProfile = async () => {
    try {
        const response = await apiClient.get("/api/users/my-profile");
        if (response.data.success) return response.data.data;
        else throw new Error("Lấy thông tin cá nhân thất bại");
    } catch (error) {
        console.error("Lỗi khi lấy thông tin cá nhân:", error);
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

        console.log("Fetching users with params:", params.toString());

        const response = await apiClient.get("/api/users", { params });

        if (response.data.success) {
            const mappedData = response.data.data.map(user => ({
                id: user.id,
                username: user.tenDangNhap,
                fullName: user.hoVaTen,
                email: user.email,
                phone: user.soDienThoai,
                role: user.vaiTro,
                twoFactorAuth: user.xacThucHaiYeuTo,
                active: user.trangThai,
                createdAt: user.ngayTao,
                updatedAt: user.ngayCapNhap
            }));

            const pagination = response.data.pagintation || response.data.pagination;
            console.log("Pagination info:", pagination);
            return {
                content: mappedData,
                totalElements: pagination?.totalItems || 0,
                totalPages: pagination?.totalPages || 0,
                currentPage: pagination?.currentPage || 1,
                pageSize: pagination?.pageSize || size
            };
            
        } else {
            throw new Error("Lấy danh sách người dùng thất bại");
        }
    } catch (error) {   
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        throw error;
    }
}

const updateUserProfile = async (userData) => {
    try {
        const response = await apiClient.put("/api/users", userData);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật thông tin cá nhân thất bại");
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
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
        else throw new Error("Tạo tài khoản thất bại");
    } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
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
            trangThai: userData.active !== false 
        };

        const response = await apiClient.put("/api/users/update-by-admin", requestData);
        if (response.data.success) return response.data.data;
        else throw new Error("Cập nhật thông tin người dùng thất bại");
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        throw error;
    }
}

const deleteUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/api/users/${userId}`);
        if (response.data.success) return response.data.data;
        else throw new Error("Xóa người dùng thất bại");
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
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
}