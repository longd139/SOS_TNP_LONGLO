import { createAsyncThunk } from '@reduxjs/toolkit';
import { AUDIT_LOG_API } from '../../apis/auditlog';

/**
 * Thunk để lấy danh sách nhật ký hệ thống
 */
export const fetchAuditLogs = createAsyncThunk(
  'auditLog/fetchAuditLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await AUDIT_LOG_API.getAuditLogs(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy danh sách nhật ký thất bại');
    }
  }
);

/**
 * Thunk để lấy chi tiết nhật ký hệ thống
 */
export const fetchAuditLogDetail = createAsyncThunk(
  'auditLog/fetchAuditLogDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await AUDIT_LOG_API.getAuditLogDetail(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lấy chi tiết nhật ký thất bại');
    }
  }
);
