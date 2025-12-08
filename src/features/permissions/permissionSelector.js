export const selectPermissionState = (state) => state.permission || {};

// Trả về API response gốc (chứa grouped, cate, type)
export const selectPermissionRawData = (state) => selectPermissionState(state).permissions || {};

export const selectPermissions = (state) => {
	const rawData = selectPermissionRawData(state);
	// API trả về { grouped, cate, type }, nhưng chúng ta chỉ cần grouped
	if (rawData?.grouped) {
		return rawData.grouped || {};
	}
	return rawData || {};
};

export const selectPermissionCategories = (state) => selectPermissionState(state).categories || [];
export const selectPermissionLoading = (state) => !!selectPermissionState(state).loading;
export const selectPermissionError = (state) => selectPermissionState(state).error;
export const selectPermissionFilters = (state) => selectPermissionState(state).filters || {};

export const selectAllPermissionList = (state) => {
	const perms = selectPermissions(state);
	const result = [];
	Object.keys(perms || {}).forEach((category) => {
		const items = perms[category];
		if (Array.isArray(items)) {
			items.forEach((p) => result.push({ category, ...p }));
		}
	});
	return result;
};
