import apiClient from "../utils/apiClient";
import { normalizeReceptionOfficers } from "./receptionOfficerMapper";

export const RECEPTION_COUNTER_API = {
  // Lấy danh sách 8 quầy tiếp dân
  getCounters: async () => {
    const res = await apiClient.get("/api/reception-counters");
    return res.data?.data || res.data || [];
  },

  // Xem chi tiết 1 quầy
  getCounterById: async (id) => {
    const res = await apiClient.get(`/api/reception-counters/${id}`);
    return res.data?.data || res.data;
  },

  // Cập nhật quầy tiếp dân (tên, mô tả, bật/tắt)
  updateCounter: async (id, data) => {
    const res = await apiClient.patch(`/api/reception-counters/${id}`, data);
    return res.data?.data || res.data;
  },

  // Lấy danh sách phân công cán bộ - quầy
  getAssignments: async (params = {}) => {
    const res = await apiClient.get("/api/reception-counter-assignments", { params });
    return res.data?.data || res.data || [];
  },

  getAssignmentById: async (id) => {
    const res = await apiClient.get(`/api/reception-counter-assignments/${id}`);
    return res.data?.data || res.data;
  },

  updateAssignment: async (id, data) => {
    const res = await apiClient.patch(`/api/reception-counter-assignments/${id}`, data);
    return res.data?.data || res.data;
  },

  deleteAssignment: async (id) => {
    const res = await apiClient.delete(`/api/reception-counter-assignments/${id}`);
    return res.data?.data || res.data;
  },

  // Cập nhật phân công cán bộ cho 1 ca trực
  replaceShiftAssignments: async (shiftId, assignments) => {
    const res = await apiClient.put(`/api/reception-shifts/${shiftId}/counter-assignments`, {
      assignments
    });
    return res.data?.data || res.data;
  },

  // Lấy danh sách người dùng/cán bộ để chọn trong dropdown
  getOfficers: async () => {
    try {
      const res = await apiClient.get("/api/users", { params: { page: 1, size: 100 } });
      const users = res.data?.data?.items || res.data?.data || res.data || [];
      return normalizeReceptionOfficers(users);
    } catch (e) {
      console.warn("Could not fetch user list", e);
      return [];
    }
  },

  // Lấy danh sách ca trực theo ngày
  getSchedules: async (params = {}) => {
    try {
      const res = await apiClient.get("/api/reception-schedules/management", { params });
      return res.data?.data || res.data || [];
    } catch (e) {
      return [];
    }
  },

  getScheduleDetail: async (id) => {
    const res = await apiClient.get(`/api/reception-schedules/management/${id}`);
    return res.data?.data || res.data;
  }
};
