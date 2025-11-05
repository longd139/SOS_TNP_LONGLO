import { USER_API } from '../apis/user';

export class UserService {

    static async createAccount(userData) {
        try {
            const result = await USER_API.createAccount(userData);
            return result;
        } catch (error) {
            console.error('UserService.createAccount error:', error);
            throw this.formatError(error);
        }
    }

    static async updateUserByAdmin(userData) {
        try {
            const result = await USER_API.updateUserProfileByAdmin(userData);
            return result;
        } catch (error) {
            console.error('UserService.updateUserByAdmin error:', error);
            throw this.formatError(error);
        }
    }

    static async getAllUsers(params = { page: 1, size: 10 }) {
        try {
            const result = await USER_API.getAllUsersWithPagination(params);
            return result;
        } catch (error) {
            console.error('UserService.getAllUsers error:', error);
            throw this.formatError(error);
        }
    }

    static async deleteUser(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required for deletion');
            }

            const result = await USER_API.deleteUser(userId);
            return result;
        } catch (error) {
            console.error('UserService.deleteUser error:', error);
            throw this.formatError(error);
        }
    }

    static async updateUserStatus(userId, isActive) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const result = await USER_API.updateStatus(userId, isActive);
            return result;
        } catch (error) {
            console.error('UserService.updateUserStatus error:', error);
            throw this.formatError(error);
        }
    }

    static async getMyProfile() {
        try {
            const result = await USER_API.getMyProfile();
            return result;
        } catch (error) {
            console.error('UserService.getMyProfile error:', error);
            throw this.formatError(error);
        }
    }

    static formatError(error) {
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }

        return error;
    }

    static getUserStatistics(users = []) {
        return {
            total: users.length,
            active: users.filter(user => user.active !== false).length,
            inactive: users.filter(user => user.active === false).length,
            admins: users.filter(user => user.role === 'ADMIN').length,
            employees: users.filter(user => user.role === 'NHAN_VIEN').length,
            leaders: users.filter(user => ['LANH_DAO', 'PHO_CHU_TICH', 'CHU_TICH'].includes(user.role)).length
        };
    }

    static formatUserForDisplay(user) {
        return {
            ...user,
            statusText: user.active !== false ? 'Hoạt động' : 'Đã khóa',
            statusColor: user.active !== false ? 'text-green-600' : 'text-red-600',
            lastLoginFormatted: user.lastLogin ?
                new Date(user.lastLogin).toLocaleString('vi-VN') :
                'Chưa đăng nhập'
        };
    }
}

export default UserService;