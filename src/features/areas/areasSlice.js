import { createSlice } from '@reduxjs/toolkit';
import { fetchAreas, createArea } from './areasThunks';

const initialState = {
    areas: [],
    loading: false,
    error: null
};

const areasSlice = createSlice({
    name: 'areas',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.areas = action.payload;
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách lĩnh vực thất bại';
            })

            .addCase(createArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createArea.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.areas.unshift(action.payload);
                }
            })
            .addCase(createArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Tạo lĩnh vực thất bại';
            });
    }
});

export const { clearError } = areasSlice.actions;
export default areasSlice.reducer;
