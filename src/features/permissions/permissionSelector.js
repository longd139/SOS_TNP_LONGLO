export const selectPermissionState = (state) => state.permission || {};

export const selectPermissions = (state) => selectPermissionState(state).permissions || {};
export const selectPermissionCategories = (state) => selectPermissionState(state).categories || [];
export const selectPermissionLoading = (state) => !!selectPermissionState(state).loading;
export const selectPermissionError = (state) => selectPermissionState(state).error;
export const selectPermissionFilters = (state) => selectPermissionState(state).filters || {};

export const selectAllPermissionList = (state) => {
	const perms = selectPermissions(state);
	const result = [];
	Object.keys(perms || {}).forEach((category) => {
		const items = perms[category] || [];
		items.forEach((p) => result.push({ category, ...p }));
	});
	return result;
};
