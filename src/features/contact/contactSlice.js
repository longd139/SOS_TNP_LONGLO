import { createSlice } from '@reduxjs/toolkit';
import { fetchContact, createContact, updateContact } from './contactThunks';

const initialState = {
    contact: null,
    loading: false,
    error: null,
    updateSuccess: false,
};

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUpdateSuccess: (state) => {
            state.updateSuccess = false;
        },
        resetContactState: (state) => {
            state.contact = null;
            state.loading = false;
            state.error = null;
            state.updateSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContact.fulfilled, (state, action) => {
                state.loading = false;
                state.contact = action.payload;
                state.error = null;
            })
            .addCase(fetchContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createContact.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(createContact.fulfilled, (state, action) => {
                state.loading = false;
                state.contact = action.payload;
                state.updateSuccess = true;
                state.error = null;
            })
            .addCase(createContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.updateSuccess = false;
            })
            .addCase(updateContact.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateContact.fulfilled, (state, action) => {
                state.loading = false;
                state.contact = action.payload;
                state.updateSuccess = true;
                state.error = null;
            })
            .addCase(updateContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.updateSuccess = false;
            });
    },
});

export const { clearError, clearUpdateSuccess, resetContactState } = contactSlice.actions;
export default contactSlice.reducer;