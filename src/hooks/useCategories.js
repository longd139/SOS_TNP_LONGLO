import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCategories,
    fetchCategoriesWithPagination,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategoryById,
    updateStatusCategory,
    countNewsByCategory
} from '../features/categories/categoriesThunks';
import {
    clearError,
    setCurrentCategory,
    clearCurrentCategory,
    setFilters,
    resetFilters,
    setShowActive
} from '../features/categories/categoriesSlice';
import {
    selectCategoriesList,
    selectCategoriesLoading,
    selectCategoriesError,
    selectActiveCategories,
    selectCategoriesPagination,
    selectCurrentCategory,
    selectCategoriesFilters,
    selectCategoriesShowActive,
    selectCategoriesNewsCount
} from '../features/categories/categoriesSelectors';

export const useCategories = ({ autoFetch = false, filters = {}, isActive } = {}) => {
    const dispatch = useDispatch();

    const categories = useSelector(selectCategoriesList);
    const activeCategories = useSelector(selectActiveCategories);
    const currentCategory = useSelector(selectCurrentCategory);
    const loading = useSelector(selectCategoriesLoading);
    const error = useSelector(selectCategoriesError);
    const pagination = useSelector(selectCategoriesPagination);
    const currentFilters = useSelector(selectCategoriesFilters);
    const showActive = useSelector(selectCategoriesShowActive);
    const newsCount = useSelector(selectCategoriesNewsCount);
    const isFetched = useSelector(state => state.categories?.isFetched);

    useEffect(() => {
        if (autoFetch && (!categories || categories.length === 0)) {
            loadCategoriesWithPagination({
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                isActive: isActive !== undefined ? isActive : showActive,
                ...filters
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFetch]);

    const loadCategories = useCallback((params = {}) => {
        return dispatch(fetchCategories(params)).unwrap();
    }, [dispatch]);

    const loadCategoriesWithPagination = useCallback((params = {}) => {
        const requestParams = {
            page: params.page || pagination.currentPage,
            pageSize: params.pageSize || pagination.pageSize,
            search: params.search !== undefined ? params.search : (currentFilters.search || ''),
            isRemoved: params.isActive !== undefined ? !params.isActive : !showActive
        };

        return dispatch(fetchCategoriesWithPagination(requestParams)).unwrap();
    }, [dispatch, pagination, currentFilters, showActive]);

    const loadCategoriesIfEmpty = useCallback((params = {}) => {
        if (categories && categories.length > 0) {
            return Promise.resolve(categories);
        }

        const requestParams = {
            page: params.page || pagination.currentPage,
            pageSize: params.pageSize || pagination.pageSize,
            search: params.search !== undefined ? params.search : (currentFilters.search || ''),
            isRemoved: params.isActive !== undefined ? !params.isActive : !showActive
        };

        return dispatch(fetchCategoriesWithPagination(requestParams)).unwrap();
    }, [dispatch, pagination, currentFilters, showActive, categories]);

    const createNewCategory = useCallback((formData) => {
        return dispatch(createCategory(formData)).unwrap();
    }, [dispatch]);

    const updateExistingCategory = useCallback((categoryId, formData) => {
        return dispatch(updateCategory({ categoryId, categoryData: formData })).unwrap();
    }, [dispatch]);

    const deleteExistingCategory = useCallback((categoryId) => {
        return dispatch(deleteCategory(categoryId)).unwrap();
    }, [dispatch]);

    const updateCategoryStatus = useCallback((categoryId, isActive) => {
        return dispatch(updateStatusCategory({ categoryId, isActive })).unwrap();
    }, [dispatch]);

    const loadCategoryById = useCallback((categoryId) => {
        return dispatch(fetchCategoryById(categoryId)).unwrap();
    }, [dispatch]);

    const loadNewsCount = useCallback(() => {
        return dispatch(countNewsByCategory()).unwrap();
    }, [dispatch]);

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const clearFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const setSelectedCategory = useCallback((category) => {
        dispatch(setCurrentCategory(category));
    }, [dispatch]);

    const clearSelectedCategory = useCallback(() => {
        dispatch(clearCurrentCategory());
    }, [dispatch]);

    const updateShowActive = useCallback((value) => {
        dispatch(setShowActive(value));
    }, [dispatch]);

    const clearCategoriesError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        categories,
        activeCategories,
        currentCategory,
        loading,
        error,
        pagination,
        filters: currentFilters,
        showActive,
        newsCount,
        isFetched,

        loadCategories,
        loadCategoriesWithPagination,
        loadCategoriesIfEmpty,
        createNewCategory,
        updateExistingCategory,
        deleteExistingCategory,
        updateCategoryStatus,
        loadCategoryById,
        loadNewsCount,
        updateFilters,
        clearFilters,
        setSelectedCategory,
        clearSelectedCategory,
        updateShowActive,
        clearError: clearCategoriesError
    };
};
