import { createAsyncThunk } from '@reduxjs/toolkit';
import { STATISTICAL_REPORT_API } from "../../apis/statisticalReport";

export const fetchSummaryReport = createAsyncThunk(
  'statisticalReport/fetchSummaryReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await STATISTICAL_REPORT_API.getSummaryReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy báo cáo tổng hợp thất bại');
    }
  }
);

export const exportSummaryReportExcel = createAsyncThunk(
  'statisticalReport/exportSummaryReportExcel',
  async (params = {}, { rejectWithValue }) => {
    try {
      const blob = await STATISTICAL_REPORT_API.exportSummaryReportExcel(params);
      return blob;
    } catch (error) {
      return rejectWithValue(error.message || 'Xuất báo cáo tổng hợp thất bại');
    }
  }
);

export const fetchFieldReport = createAsyncThunk(
  'statisticalReport/fetchFieldReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await STATISTICAL_REPORT_API.getFieldReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy báo cáo lĩnh vực thất bại');
    }
  }
);

export const exportFieldReportExcel = createAsyncThunk(
  'statisticalReport/exportFieldReportExcel',
  async (params = {}, { rejectWithValue }) => {
    try {
      const blob = await STATISTICAL_REPORT_API.exportFieldReportExcel(params);
      return blob;
    } catch (error) {
      return rejectWithValue(error.message || 'Xuất báo cáo lĩnh vực thất bại');
    }
  }
);

export const fetchStatusReport = createAsyncThunk(
  'statisticalReport/fetchStatusReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await STATISTICAL_REPORT_API.getStatusReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy báo cáo trạng thái thất bại');
    }
  }
);

export const exportStatusReportExcel = createAsyncThunk(
  'statisticalReport/exportStatusReportExcel',
  async (params = {}, { rejectWithValue }) => {
    try {
      const blob = await STATISTICAL_REPORT_API.exportStatusReportExcel(params);
      return blob;
    } catch (error) {
      return rejectWithValue(error.message || 'Xuất báo cáo trạng thái thất bại');
    }
  }
);