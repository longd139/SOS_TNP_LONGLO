import { createAsyncThunk } from '@reduxjs/toolkit';
import { STATISTICAL_REPORT_API } from "../../apis/statisticalReport";

export const fetchPhanAnhReport = createAsyncThunk(
  'statisticalReport/fetchPhanAnhReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await STATISTICAL_REPORT_API.getPhanAnhReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy báo cáo phản ánh thất bại');
    }
  }
);

export const exportPhanAnhReportExcel = createAsyncThunk(
  'statisticalReport/exportPhanAnhReportExcel',
  async (params = {}, { rejectWithValue }) => {
    try {
      const blob = await STATISTICAL_REPORT_API.exportPhanAnhReport(params);
      return blob;
    } catch (error) {
      return rejectWithValue(error.message || 'Xuất báo cáo phản ánh thất bại');
    }
  }
);

export const fetchThuTucReport = createAsyncThunk(
  'statisticalReport/fetchThuTucReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await STATISTICAL_REPORT_API.getThuTucReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy báo cáo thủ tục thất bại');
    }
  }
);

export const exportThuTucReportExcel = createAsyncThunk(
  'statisticalReport/exportThuTucReportExcel',
  async (params = {}, { rejectWithValue }) => {
    try {
      const blob = await STATISTICAL_REPORT_API.exportThuTucReport(params);
      return blob;
    } catch (error) {
      return rejectWithValue(error.message || 'Xuất báo cáo thủ tục thất bại');
    }
  }
);

export const fetchTinTucReport = createAsyncThunk(
  'statisticalReport/fetchTinTucReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await STATISTICAL_REPORT_API.getTinTucReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy báo cáo tin tức thất bại');
    }
  }
);

export const exportTinTucReportExcel = createAsyncThunk(
  'statisticalReport/exportTinTucReportExcel',
  async (params = {}, { rejectWithValue }) => {
    try {
      const blob = await STATISTICAL_REPORT_API.exportTinTucReport(params);
      return blob;
    } catch (error) {
      return rejectWithValue(error.message || 'Xuất báo cáo tin tức thất bại');
    }
  }
);