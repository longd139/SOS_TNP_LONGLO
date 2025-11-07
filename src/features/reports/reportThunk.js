import { createAsyncThunk } from '@reduxjs/toolkit';
import { REPORT_API } from "../../apis/report";

export const fetchReportPagination = createAsyncThunk(
    'report/fetchReportPagination',
    async ({
        idLinhVucPhanAnh = '',
        trangThai = '',
        mucDo = '',
        page = 1,
        size = 10,
        maPhanAnh = '',
    }, { rejectWithValue }) => {
        try {
            const params = {
                page,
                size
            };

            if (idLinhVucPhanAnh) params.idLinhVucPhanAnh = idLinhVucPhanAnh;
            if (trangThai) params.trangThai = trangThai;
            if (mucDo) params.mucDo = mucDo;
            if (maPhanAnh) params.maPhanAnh = maPhanAnh;

            const response = await REPORT_API.getReportPagination(params);

            return {
                content: Array.isArray(response.data) ? response.data : [],
                page: Number(response.pagination?.currentPage) || page,
                size: Number(response.pagination?.pageSize) || size,
                totalElements: Number(response.pagination?.totalItems) || 0,
                totalPages: Number(response.pagination?.totalPages) || 0
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch procedures');
        }
    }
)

export const fetchHistoryStatus = createAsyncThunk(
    'report/fetchHistoryStatus',
    async (reportId, { rejectWithValue }) => {
        try {
            const response = await REPORT_API.getHistoryStatus(reportId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch history status');
        }
    }
)

export const fetchExtent = createAsyncThunk(
    'report/fetchExtent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await REPORT_API.getExtent();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch extent');
        }
    }
)

export const fetchStatusReport = createAsyncThunk(
    'report/fetchStatusReport',
    async (_, { rejectWithValue }) => {
        try {
            const response = await REPORT_API.getStatusReport();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch status report');
        }
    }
)

export const fetchReportById = createAsyncThunk(
    'report/fetchReportById',
    async (reportId, { rejectWithValue }) => {
        try {
            const response = await REPORT_API.getReportById(reportId);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch report by ID');
        }
    }
)

