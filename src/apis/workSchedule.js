import { apiFormClient } from "../utils/apiClient";

const importWorkSchedule = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiFormClient.post('/api/lich-tiep-dan/import', formData);
        
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Import lịch tiếp dân thất bại");
        }
    } catch (error) {
        if (error.response?.status === 500) {
            const message = error.response?.data?.message || "Server đang gặp sự cố khi xử lý file";
            throw new Error(`${message}. Vui lòng kiểm tra định dạng file và thử lại.`);
        }
        
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        
        throw new Error("Không thể kết nối đến server. Vui lòng thử lại sau.");
    }
}

const getWorkSchedules = async (
    weekYear,
    monthYear,
    date,
    isActive
) => {
    try {
        const params = new URLSearchParams();
        if (weekYear) params.append('weekYear', weekYear);
        if (monthYear) params.append('monthYear', monthYear);
        if (date) params.append('date', date);
        if (typeof isActive === 'boolean') params.append('isActive', isActive);

        const response = await apiFormClient.get('/api/lich-tiep-dan', { params });
        
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lấy lịch tiếp dân thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }   
        throw error;
    }
}

const updateWorkScheduleStatus = async (scheduleId, isActive) => {
    try {
        const response = await apiFormClient.put(`/api/lich-tiep-dan/update-status/${scheduleId}`, { isActive });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Cập nhật trạng thái lịch tiếp dân thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const deleteWorkSchedule = async (scheduleId) => {
    try {
        const response = await apiFormClient.delete(`/api/lich-tiep-dan/${scheduleId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Xóa lịch tiếp dân thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getTemplateWorkSchedule = async () => {
    try {
        const response = await apiFormClient.get('/api/lich-tiep-dan/template');
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Lấy template lịch tiếp dân thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

const getWorkScheduleById = async (scheduleId) => {
    try {
        const response = await apiFormClient.get(`/api/lich-tiep-dan/${scheduleId}`);
        if (response.data.success) {
            return response.data.data;
        }
        else {
            throw new Error(response.data.message || "Lấy lịch tiếp dân thất bại");
        }
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}
export const WORK_SCHEDULE_API = {
    importWorkSchedule,
    getWorkSchedules,
    updateWorkScheduleStatus,
    deleteWorkSchedule,
    getTemplateWorkSchedule,
    getWorkScheduleById
};