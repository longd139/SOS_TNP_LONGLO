import apiClient from "../utils/apiClient";

const getAuditLogs = async ({
  page = 1,
  size = 10,
  from,
  to,
  search
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    if (from) {
      params.append('from', from);
    }

    if (to) {
      params.append('to', to);
    }

    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiClient.get(`/api/audit-logs?${params.toString()}`);

    if (response.data && response.data.success) {
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || {
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          totalItems: 0
        }
      };
    }

    throw new Error(response.data?.message || "Lấy danh sách nhật ký thất bại");
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

const getAuditLogDetail = async (id) => {
  try {
    const response = await apiClient.get(`/api/audit-logs/${id}`);

    if (response.data && response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data?.message || "Lấy chi tiết nhật ký thất bại");
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const AUDIT_LOG_API = {
  getAuditLogs,
  getAuditLogDetail
};
