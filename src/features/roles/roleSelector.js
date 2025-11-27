export const selectRoleState = (state) => state.role || {};
export const selectRoles = (state) => selectRoleState(state).roles || [];
export const selectAllRoles = (state) => selectRoleState(state).allRoles || [];
export const selectCurrentRole = (state) => selectRoleState(state).currentRole || null;
export const selectRolesLoading = (state) => selectRoleState(state).loading || false;
export const selectAllRolesLoading = (state) => selectRoleState(state).allRolesLoading || false;
export const selectRolesError = (state) => selectRoleState(state).error || null;
export const selectRolesPagination = (state) => selectRoleState(state).pagination || {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
};
export const selectRolesFilters = (state) => selectRoleState(state).filters || {
    search: '',
};
export const selectShowActive = (state) => selectRoleState(state).showActive;