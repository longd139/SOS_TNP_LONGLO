import { createAsyncThunk } from '@reduxjs/toolkit';
import { FORM_API } from '../../apis/form';

export const fetchTemplates = createAsyncThunk(
    'templates/fetchTemplates',
    async (isRemoved = false, { rejectWithValue }) => {
        try {
            const response = await FORM_API.getAllForms(isRemoved);
            return response || [];
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách biểu mẫu thất bại'
            });
        }
    }
);

export const createTemplate = createAsyncThunk(
    'templates/createTemplate',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await FORM_API.createForm(formData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Tạo biểu mẫu thất bại'
            });
        }
    }
);

export const updateTemplate = createAsyncThunk(
    'templates/updateTemplate',
    async ({ templateId, formData }, { rejectWithValue }) => {
        try {
            const response = await FORM_API.updateForm(templateId, formData);
            return response;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật biểu mẫu thất bại'
            });
        }
    }
);

export const deleteTemplate = createAsyncThunk(
    'templates/deleteTemplate',
    async (templateId, { rejectWithValue }) => {
        try {
            await FORM_API.deleteForm(templateId);
            return templateId;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Xóa biểu mẫu thất bại'
            });
        }
    }
);
