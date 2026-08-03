import { createSelector } from '@reduxjs/toolkit';

export const selectUsersState = (state) => state.users;

export const selectUsers = (state) => state.users.users;

export const selectCurrentUser = (state) => state.users.currentUser;

export const selectSelectedUserDetail = (state) => state.users.selectedUserDetail;

export const selectLoading = (state) => state.users.loading;

export const selectDetailLoading = (state) => state.users.detailLoading;

export const selectError = (state) => state.users.error;

export const selectPagination = (state) => state.users.pagination;

export const selectUserStatistics = createSelector(
    [selectUsers],
    (users) => ({
        total: users.length,
        active: users.filter(user => user.active !== false).length,
        inactive: users.filter(user => user.active === false).length,
        admins: users.filter(user => user.role === 'ADMIN').length,
        employees: users.filter(user => user.role === 'NHAN_VIEN').length,
        leaders: users.filter(user => ['LANH_DAO', 'PHO_CHU_TICH', 'CHU_TICH'].includes(user.role)).length
    })
);

export const selectUsersByRole = createSelector(
    [selectUsers, (state, role) => role],
    (users, role) => users.filter(user => user.role === role)
);

export const selectActiveUsers = createSelector(
    [selectUsers],
    (users) => users.filter(user => user.active !== false)
);

export const selectInactiveUsers = createSelector(
    [selectUsers],
    (users) => users.filter(user => user.active === false)
);

export const selectFormattedUsers = createSelector(
    [selectUsers],
    (users) => users.map(user => ({
        ...user,
        statusText: user.active !== false ? 'Hoạt động' : 'Đã khóa',
        statusColor: user.active !== false ? 'text-green-600' : 'text-red-600',
        lastLoginFormatted: user.lastLogin ?
            new Date(user.lastLogin).toLocaleString('vi-VN') :
            'Chưa đăng nhập'
    }))
);
