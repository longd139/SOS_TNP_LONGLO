import apiClient from '../utils/apiClient';

export const LEADER_MEETING_API = {
  // 1. Quản lý lịch gặp lãnh đạo (Schedules)
  getSchedules: async (params = {}) => {
    const response = await apiClient.get('/api/leader-meeting-schedules', { params });
    return response.data;
  },

  getManagementSchedules: async (params = {}) => {
    const response = await apiClient.get('/api/leader-meeting-schedules/management', { params });
    return response.data;
  },

  getManagementScheduleDetail: async (id) => {
    const response = await apiClient.get(`/api/leader-meeting-schedules/management/${id}`);
    return response.data;
  },

  updateScheduleStatus: async (id, isActive) => {
    const response = await apiClient.put(`/api/leader-meeting-schedules/management/${id}/status`, { isActive });
    return response.data;
  },

  createSchedule: async (data) => {
    // Tạo lịch rảnh gặp lãnh đạo
    const response = await apiClient.post('/api/leader-meeting-schedules/management', data);
    return response.data;
  },

  deleteSchedule: async (id) => {
    const response = await apiClient.delete(`/api/leader-meeting-schedules/management/${id}`);
    return response.data;
  },

  // 2. Quản lý đơn đăng ký gặp lãnh đạo (Registrations)
  getRegistrations: async (params = {}) => {
    const response = await apiClient.get('/api/leader-meeting-registrations', { params });
    return response.data;
  },

  getRegistrationDetail: async (id) => {
    const response = await apiClient.get(`/api/leader-meeting-registrations/${id}`);
    return response.data;
  },

  createRegistration: async (formData) => {
    const response = await apiClient.post('/api/leader-meeting-registrations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  approveRegistration: async (id, data = {}) => {
    const response = await apiClient.put(`/api/leader-meeting-registrations/${id}/approve`, data);
    return response.data;
  },

  rejectRegistration: async (id, reason) => {
    const response = await apiClient.put(`/api/leader-meeting-registrations/${id}/reject`, { reason });
    return response.data;
  },

  processRegistration: async (id) => {
    const response = await apiClient.put(`/api/leader-meeting-registrations/${id}/process`);
    return response.data;
  },

  completeRegistration: async (id, result = '') => {
    const response = await apiClient.put(`/api/leader-meeting-registrations/${id}/complete`, { result });
    return response.data;
  },

  cancelRegistration: async (id, reason) => {
    const response = await apiClient.put(`/api/leader-meeting-registrations/${id}/cancel`, { reason });
    return response.data;
  },

  // 3. Đánh giá gặp lãnh đạo (Ratings)
  getRatings: async (params = {}) => {
    const response = await apiClient.get('/api/leader-meeting-ratings', { params });
    return response.data;
  },

  getRatingStatistics: async (params = {}) => {
    const response = await apiClient.get('/api/leader-meeting-ratings/statistics', { params });
    return response.data;
  },

  getRatingConfiguration: async () => {
    const response = await apiClient.get('/api/leader-meeting-ratings/configuration');
    return response.data;
  },

  createRating: async (data) => {
    const response = await apiClient.post('/api/leader-meeting-ratings', data);
    return response.data;
  }
};

export default LEADER_MEETING_API;
