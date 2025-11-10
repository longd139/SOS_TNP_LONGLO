import { createSlice } from '@reduxjs/toolkit';
import { fetchTemplates, fetchTemplatesPaging, createTemplate, updateTemplate, deleteTemplate } from './templatesThunks';

const DEFAULT_PAGE_SIZE = 10;

const initialState = {
    templates: [],
    currentTemplate: null,
    loading: false,
    error: null,
    showRemoved: false,
    pagination: {
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 0
    },
    filters: {
        searchKeyword: ''
    }
};

const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentTemplate: (state, action) => {
            state.currentTemplate = action.payload;
        },
        clearCurrentTemplate: (state) => {
            state.currentTemplate = null;
        },
        setShowRemoved: (state, action) => {
            state.showRemoved = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {
                searchKeyword: ''
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = action.payload;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách biểu mẫu thất bại';
            })

            // Fetch templates with pagination
            .addCase(fetchTemplatesPaging.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplatesPaging.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = action.payload.content || [];
                state.pagination = {
                    current: action.payload.page,
                    pageSize: action.payload.size,
                    total: action.payload.totalElements || 0,
                    totalPages: action.payload.totalPages || 0
                };
            })
            .addCase(fetchTemplatesPaging.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lấy danh sách biểu mẫu thất bại';
                state.templates = [];
            })

            .addCase(createTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTemplate.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.templates.unshift(action.payload);
                }
            })
            .addCase(createTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Tạo biểu mẫu thất bại';
            })

            .addCase(updateTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const updated = action.payload;
                    const index = state.templates.findIndex(t => t.id === updated.id);
                    const isDeleted = updated.isDelete ?? updated.is_deleted ?? updated.isRemoved ?? updated.is_removed ?? false;

                    if (isDeleted) {
                        state.templates = state.templates.filter(t => t.id !== updated.id);
                    } else if (index !== -1) {
                        state.templates[index] = updated;
                    } else {
                        state.templates.unshift(updated);
                    }
                }
            })
            .addCase(updateTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật biểu mẫu thất bại';
            })

            .addCase(deleteTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload;
                let idToRemove = null;
                if (!payload) return;
                if (typeof payload === 'object' && payload.templateId) {
                    idToRemove = payload.templateId;
                } else if (typeof payload === 'number' || typeof payload === 'string') {
                    idToRemove = payload;
                }

                if (idToRemove !== null) {
                    state.templates = state.templates.filter(t => t.id !== idToRemove);
                }
            })
            .addCase(deleteTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa biểu mẫu thất bại';
            });
    }
});

export const { clearError, setCurrentTemplate, clearCurrentTemplate, setShowRemoved, setFilters, resetFilters } = templatesSlice.actions;
export default templatesSlice.reducer;