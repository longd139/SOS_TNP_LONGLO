import { createSelector } from '@reduxjs/toolkit';

const selectCategoriesState = (state) => state.categories;

export const selectCategoriesList = createSelector(
    [selectCategoriesState],
    (categories) => categories?.categories || []
);

export const selectCategoriesLoading = createSelector(
    [selectCategoriesState],
    (categories) => categories?.loading || false
);

export const selectCategoriesError = createSelector(
    [selectCategoriesState],
    (categories) => categories?.error || null
);

export const selectCategoriesPagination = createSelector(
    [selectCategoriesState],
    (categories) => categories?.pagination || {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0
    }
);

export const selectCurrentCategory = createSelector(
    [selectCategoriesState],
    (categories) => categories?.currentCategory || null
);

export const selectCategoriesFilters = createSelector(
    [selectCategoriesState],
    (categories) => categories?.filters || { search: '' }
);

export const selectCategoriesShowActive = createSelector(
    [selectCategoriesState],
    (categories) => categories?.showActive ?? true
);

export const selectCategoriesNewsCount = createSelector(
    [selectCategoriesState],
    (categories) => categories?.newsCount || []
);

export const selectActiveCategories = createSelector(
    [selectCategoriesList],
    (categories) => categories.filter(cat => !cat.is_removed)
);

export const selectCategoriesStatistics = createSelector(
    [selectCategoriesList],
    (categories) => {
        const total = categories.length;
        const active = categories.filter(item => item.isActive === true).length;
        const inactive = categories.filter(item => item.isActive === false).length;

        return {
            total,
            active,
            inactive
        };
    }
);
