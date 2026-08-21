import apiClient from '../utils/apiClient';

const dataOf = (response) => response.data?.data ?? response.data;

export const RECEPTION_API = {
  getAvailableSchedules: async (params = {}) => dataOf(
    await apiClient.get('/api/reception-schedules', { params })
  ),

  updateSlotCapacity: async (scheduleId, slotId, capacity) => dataOf(
    await apiClient.patch(`/api/reception-schedules/${scheduleId}/slots/${slotId}/capacity`, { capacity })
  ),

  getRegistrations: async (params = {}) => dataOf(
    await apiClient.get('/api/reception-registrations', { params })
  ),

  getRegistrationDetail: async (id) => dataOf(
    await apiClient.get(`/api/reception-registrations/${id}`)
  ),

  createRegistration: async (data) => dataOf(
    await apiClient.post('/api/reception-registrations', data)
  ),

  lookupRegistration: async (data) => dataOf(
    await apiClient.post('/api/reception-registrations/lookup', data)
  ),

  lookupRegistrationForRating: async (receptionCode) => dataOf(
    await apiClient.get(`/api/reception-registrations/rating-lookup/${encodeURIComponent(receptionCode)}`)
  ),

  approveRegistration: async (id) => dataOf(
    await apiClient.patch(`/api/reception-registrations/${id}/approve`, {})
  ),

  completeRegistration: async (id) => dataOf(
    await apiClient.patch(`/api/reception-registrations/${id}/complete`)
  ),

  rejectRegistration: async (id, reason) => dataOf(
    await apiClient.patch(`/api/reception-registrations/${id}/reject`, { reason })
  ),

  getRatingConfiguration: async () => dataOf(
    await apiClient.get('/api/reception-ratings/configuration')
  ),

  getRatings: async (params = {}) => (
    await apiClient.get('/api/reception-ratings', { params })
  ).data,

  getRatingStatistics: async (params = {}) => dataOf(
    await apiClient.get('/api/reception-ratings/statistics', { params })
  ),

  getRatingDetail: async (id) => dataOf(
    await apiClient.get(`/api/reception-ratings/${id}`)
  ),

  createRating: async (data) => dataOf(
    await apiClient.post('/api/reception-ratings', data)
  ),
};

export default RECEPTION_API;
