import { createAsyncThunk } from '@reduxjs/toolkit';
import { FORMALITY_API } from '../../apis/formality';
import { AREAS_API } from '../../apis/areas';

export const fetchProcedures = createAsyncThunk(
    'procedures/fetchProcedures',
    async ({ page = 1, size = 10, search = '', id_linh_vuc = '', isActive = true }, { rejectWithValue }) => {
        try {
            const params = {
                page,
                size,
                search,
                isActive
            };

            if (id_linh_vuc) {
                params.id_linh_vuc = id_linh_vuc;
            }

            const response = await FORMALITY_API.getFormalityApi(params);

            return {
                content: response.data || response.content || [],
                page: response.pagination?.currentPage || page,
                size: response.pagination?.pageSize || size,
                totalElements: response.pagination?.totalItems || response.totalElements || 0,
                totalPages: response.pagination?.totalPages || response.totalPages || 0
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch procedures');
        }
    }
);

export const fetchAreas = createAsyncThunk(
    'procedures/fetchAreas',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AREAS_API.getAreas(false);
            return response || [];
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch areas');
        }
    }
);

export const createProcedure = createAsyncThunk(
    'procedures/createProcedure',
    async (formData, { rejectWithValue }) => {
        try {
            await FORMALITY_API.createFormality(formData);
            return { success: true };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create procedure');
        }
    }
);

export const updateProcedure = createAsyncThunk(
    'procedures/updateProcedure',
    async ({ procedureId, formData }, { rejectWithValue }) => {
        try {
            await FORMALITY_API.updateFormality(procedureId, formData);
            return { success: true };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update procedure');
        }
    }
);

export const deleteProcedure = createAsyncThunk(
    'procedures/deleteProcedure',
    async ({ procedureId, procedureName }, { rejectWithValue }) => {
        try {
            await FORMALITY_API.deleteFormality(procedureId);
            return { success: true };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete procedure');
        }
    }
);

export const fetchProcedureById = createAsyncThunk(
    'procedures/fetchProcedureById',
    async (procedureId, { rejectWithValue }) => {
        try {
            const response = await FORMALITY_API.getFormalityById(procedureId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch procedure');
        }
    }
);
