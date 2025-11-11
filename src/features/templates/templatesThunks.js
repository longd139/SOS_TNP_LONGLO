import { createAsyncThunk } from '@reduxjs/toolkit';
import { FORM_API } from '../../apis/form';

const toBoolean = (v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v === 1;
    if (typeof v === 'string') return v === 'true' || v === '1';
    return false;
};

export const fetchTemplates = createAsyncThunk(
    'templates/fetchTemplates',
    async (isRemoved = false, { rejectWithValue }) => {
        try {
            const response = await FORM_API.getAllForms(isRemoved);
            if (Array.isArray(response)) {
                const normalized = response.map(item => ({
                    ...item,
                    isActive: toBoolean(item.isActive ?? item.is_active),
                    isDelete: toBoolean(item.isDelete ?? item.is_deleted ?? item.is_delete)
                }));
                return normalized;
            }
            if (response && typeof response === 'object') {
                const item = response;
                item.isActive = toBoolean(item.isActive ?? item.is_active);
                item.isDelete = toBoolean(item.isDelete ?? item.is_deleted ?? item.is_delete);
                return item;
            }
            return response || [];
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách biểu mẫu thất bại'
            });
        }
    }
);

export const fetchTemplatesPaging = createAsyncThunk(
    'templates/fetchTemplatesPaging',
    async ({ page = 1, pageSize = 10, isRemoved = false, search = '' }, { rejectWithValue }) => {
        try {
            const response = await FORM_API.getAllFormPaging(page, pageSize, isRemoved, search);
            
            const templates = response.data || [];
            const paginationInfo = response.pagination || {};
            
            const normalizedData = templates.map(item => ({
                ...item,
                isActive: toBoolean(item.isActive ?? item.is_active),
                isDelete: toBoolean(item.isDelete ?? item.is_deleted ?? item.is_delete)
            }));

            return {
                content: normalizedData,
                page: parseInt(paginationInfo.currentPage) || page,
                size: parseInt(paginationInfo.pageSize) || pageSize,
                totalElements: parseInt(paginationInfo.totalItems) || 0,
                totalPages: parseInt(paginationInfo.totalPages) || 0
            };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Lấy danh sách biểu mẫu thất bại'
            });
        }
    }
);

export const createTemplate = createAsyncThunk(
    'templates/createTemplate',
    async (payload, { rejectWithValue }) => {
        const { formData, options } = payload || {};
        try {
            const response = await FORM_API.createForm(formData, options);
            if (response && typeof response === 'object') {
                response.isActive = toBoolean(response.isActive ?? response.is_active);
                response.isDelete = toBoolean(response.isDelete ?? response.is_deleted ?? response.is_delete);
            }
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
    async ({ templateId, formData, options }, { rejectWithValue }) => {
        try {
            const response = await FORM_API.updateForm(templateId, formData, options);
            if (response && typeof response === 'object') {
                response.isActive = toBoolean(response.isActive ?? response.is_active);
                response.isDelete = toBoolean(response.isDelete ?? response.is_deleted ?? response.is_delete);
            }
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
            const resp = await FORM_API.deleteForm(templateId);
            return { templateId, serverData: resp };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Xóa biểu mẫu thất bại'
            });
        }
    }
);

export const updateTemplateStatus = createAsyncThunk(
    'templates/updateTemplateStatus',
    async ({ templateId, isActive, options } = {}, { rejectWithValue }) => {
        try {
            const response = await FORM_API.updateMauDonStatus(templateId, isActive, options);
            return { templateId, data: response };
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Cập nhật trạng thái biểu mẫu thất bại'
            });
        }
    }
);