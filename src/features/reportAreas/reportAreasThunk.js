import { createAsyncThunk } from '@reduxjs/toolkit';
import { REPORT_AREAS_API } from "../../apis/reportAreas";

export const fetchReportAreas = createAsyncThunk(
    'reportAreas/fetchReportAreas',
    async ({ page = 1, size = 10, search = '', isActive }, { rejectWithValue }) => {
        try {
            const response = await REPORT_AREAS_API.getAllReportAreas(page, size, isActive, search);

            return {
                content: response.data || [],
                page: response.pagination?.currentPage || page,
                size: response.pagination?.pageSize || size,
                totalElements: response.pagination?.totalItems || 0,
                totalPages: response.pagination?.totalPages || 0
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Lấy danh sách lĩnh vực phản ánh thất bại');
        }
    }
)

export const createReportArea = createAsyncThunk(
    'reportAreas/createReportArea',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await REPORT_AREAS_API.createReportArea(formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Tạo lĩnh vực phản ánh thất bại');
        }
    }
)

export const updateReportArea = createAsyncThunk(
    'reportAreas/updateReportArea',
    async ({ reportAreaId, formData }, { rejectWithValue }) => {
        try {
            const response = await REPORT_AREAS_API.updateReportArea(reportAreaId, formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Cập nhật lĩnh vực phản ánh thất bại');
        }
    }
)

export const fetchReportAreaById = createAsyncThunk(
    'reportAreas/fetchReportAreaById',
    async (reportAreaId, { rejectWithValue }) => {
        try {
            const response = await REPORT_AREAS_API.getReportAreaById(reportAreaId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Lấy lĩnh vực phản ánh thất bại');
        }
    }
)

export const updateStatusReportArea = createAsyncThunk(
    'reportAreas/updateStatusReportArea',
    async ({ reportAreaId, isActive }, { rejectWithValue }) => {
        try {
            const result = await REPORT_AREAS_API.updateReportAreaStatus(reportAreaId, isActive);
            return result;
        } catch (error) {
            return rejectWithValue(error || 'Cập nhật trạng thái lĩnh vực phản ánh thất bại');
        }
    }
)

export const deleteReportArea = createAsyncThunk(
    'reportAreas/deleteReportArea',
    async (reportAreaId, { rejectWithValue }) => {
        try {
            const response = await REPORT_AREAS_API.deleteReportArea(reportAreaId);
            return { reportAreaId };
        } catch (error) {
            return rejectWithValue(error.message || 'Xóa lĩnh vực phản ánh thất bại');
        }
    }
)
