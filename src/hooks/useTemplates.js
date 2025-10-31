import { useState, useEffect, useCallback } from 'react';
import { FORM_API } from '../apis/form';

const debugLogger = {
    log: (...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(...args);
        }
    },
    error: (...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.error(...args);
        }
    }
};

export const useTemplates = (showRemoved = false) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadTemplates = useCallback(async (isRemoved = false) => {
        setLoading(true);
        try {
            const response = await FORM_API.getAllForms(isRemoved);
            debugLogger.log('Templates API response:', response);
            setTemplates(response || []);
        } catch (error) {
            debugLogger.error('Error fetching templates:', error);
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTemplate = useCallback(async (formData) => {
        try {
            debugLogger.log('Creating template:', formData);
            await FORM_API.createForm(formData);
            await loadTemplates(showRemoved);
            alert('Tạo biểu mẫu thành công!');
            return { success: true };
        } catch (error) {
            alert('Có lỗi xảy ra khi tạo biểu mẫu!');
            debugLogger.error('Error creating template:', error);
            return { success: false, error };
        }
    }, [showRemoved, loadTemplates]);

    const updateTemplate = useCallback(async (templateId, formData) => {
        try {
            debugLogger.log('Updating template:', templateId, formData);
            await FORM_API.updateForm(templateId, formData);
            await loadTemplates(showRemoved);
            alert('Cập nhật biểu mẫu thành công!');
            return { success: true };
        } catch (error) {
            alert('Có lỗi xảy ra khi cập nhật biểu mẫu!');
            debugLogger.error('Error updating template:', error);
            return { success: false, error };
        }
    }, [showRemoved, loadTemplates]);

    const deleteTemplate = useCallback(async (templateId, templateName) => {
        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa biểu mẫu "${templateName}"?`);
        if (!confirmed) return { success: false, cancelled: true };

        try {
            await FORM_API.deleteForm(templateId);
            await loadTemplates(showRemoved);
            alert(`Đã xóa biểu mẫu thành công.`);
            return { success: true };
        } catch (error) {
            debugLogger.error('Error deleting template:', error);
            alert('Có lỗi xảy ra khi xóa biểu mẫu!');
            return { success: false, error };
        }
    }, [showRemoved, loadTemplates]);

    useEffect(() => {
        loadTemplates(showRemoved);
    }, [showRemoved]);

    return {
        templates,
        loading,
        loadTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate
    };
};
