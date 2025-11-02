import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../features/categories/categoriesThunks';
import { clearError } from '../features/categories/categoriesSlice';
import { 
    selectCategoriesList, 
    selectCategoriesLoading, 
    selectCategoriesError,
    selectActiveCategories 
} from '../features/categories/categoriesSelectors';

export const useCategories = ({ autoFetch = true, isRemoved = false } = {}) => {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategoriesList);
    const activeCategories = useSelector(selectActiveCategories);
    const loading = useSelector(selectCategoriesLoading);
    const error = useSelector(selectCategoriesError);

    useEffect(() => {
        if (autoFetch) {
            dispatch(fetchCategories({ isRemoved }));
        }
    }, [dispatch, autoFetch, isRemoved]);

    const loadCategories = useCallback((params) => {
        return dispatch(fetchCategories(params));
    }, [dispatch]);

    const clearCategoriesError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        categories,
        activeCategories,
        loading,
        error,
        loadCategories,
        clearError: clearCategoriesError
    };
};
