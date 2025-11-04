import { createSlice } from '@reduxjs/toolkit';
import {
    fetchProcedures,
    fetchAreas,
    createProcedure,
    updateProcedure,
    deleteProcedure,
    fetchProcedureById
} from './proceduresThunks';

const DEFAULT_PAGE_SIZE = 10;

const initialState = {
    procedures: [],
    areas: [],
    currentProcedure: null,
    loading: false,
    areasLoading: false,
    error: null,
    pagination: {
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 0
    },
    filters: {
        searchKeyword: '',
        selectedDomain: ''
    },
    showActive: true
};

const proceduresSlice = createSlice({
    name: 'procedures',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {
                searchKeyword: '',
                selectedDomain: ''
            };
        },
        setShowActive: (state, action) => {
            state.showActive = action.payload;
        },
        clearCurrentProcedure: (state) => {
            state.currentProcedure = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProcedures.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProcedures.fulfilled, (state, action) => {
                state.loading = false;
                state.procedures = action.payload.content || [];
                state.pagination = {
                    current: action.payload.page,
                    pageSize: action.payload.size,
                    total: action.payload.totalElements || 0,
                    totalPages: action.payload.totalPages || 0
                };
            })
            .addCase(fetchProcedures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch procedures';
                state.procedures = [];
            })

            .addCase(fetchAreas.pending, (state) => {
                state.areasLoading = true;
            })
            .addCase(fetchAreas.fulfilled, (state, action) => {
                state.areasLoading = false;
                state.areas = action.payload || [];
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.areasLoading = false;
                state.error = action.payload || 'Failed to fetch areas';
            })

            .addCase(createProcedure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProcedure.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProcedure.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create procedure';
            })

            .addCase(updateProcedure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProcedure.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProcedure.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update procedure';
            })

            .addCase(deleteProcedure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProcedure.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProcedure.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete procedure';
            })

            // Fetch Procedure By ID
            .addCase(fetchProcedureById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProcedureById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProcedure = action.payload;
            })
            .addCase(fetchProcedureById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch procedure';
            });
    }
});

export const {
    setFilters,
    resetFilters,
    setShowActive,
    clearCurrentProcedure,
    clearError
} = proceduresSlice.actions;

export default proceduresSlice.reducer;
