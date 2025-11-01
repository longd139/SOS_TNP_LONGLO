import { createSelector } from '@reduxjs/toolkit';

const selectCategoriesState = (state) => state.categories;

export const selectCategoriesList = createSelector(
    [selectCategoriesState],
    (categories) => categories.categories
);

export const selectCategoriesLoading = createSelector(
    [selectCategoriesState],
    (categories) => categories.loading
);

export const selectCategoriesError = createSelector(
    [selectCategoriesState],
    (categories) => categories.error
);

export const selectActiveCategories = createSelector(
    [selectCategoriesList],
    (categories) => categories.filter(cat => !cat.is_removed)
);
