import { useState, useEffect, useCallback } from 'react';
import { validateUserForm } from '../validator/userValidator';
import { showToast } from '../utils/toastNotification';

const INITIAL_FORM_STATE = {
    username: '',
    fullName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    active: true
};

export const useUserForm = ({ initialUser = null, isOpen = false }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!initialUser;

    useEffect(() => {
        if (isOpen) {
            if (initialUser) {
                setFormData({
                    username: initialUser.username || '',
                    fullName: initialUser.fullName || '',
                    email: initialUser.email || '',
                    phone: initialUser.phone || '',
                    role: initialUser.role || initialUser.vai_tro || '',
                    password: '',
                    confirmPassword: '',
                    active: initialUser.active !== false
                });
            } else {
                setFormData(INITIAL_FORM_STATE);
            }
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen, initialUser]);

    const updateField = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        updateField(name, fieldValue);
    }, [updateField]);

    const validateForm = useCallback(async () => {
        try {
            const result = await validateUserForm(formData, isEditMode, true);
            setErrors(result.errors || {});
            if (!result.isValid) {
                showToast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
            }
            return result.isValid;
        } catch (error) {
            return false;
        }
    }, [formData, isEditMode]);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setIsSubmitting(false);
    }, []);

    const prepareSubmitData = useCallback(() => {
        if (isEditMode) {
            return {
                fullName: formData.fullName?.trim() || '',
                phone: formData.phone?.trim() || '',
                role: formData.role,
                username: formData.username?.trim() || '',
                email: formData.email?.trim() || '',
                password: formData.password.trim() || undefined,
            };
        } else {
            // Create mode - no phone field
            return {
                username: formData.username?.trim() || '',
                email: formData.email?.trim() || '',
                password: formData.password,
                role: formData.role
            };
        }
    }, [formData, isEditMode]);

    return {
        formData,
        errors,
        isSubmitting,
        isEditMode,

        updateField,
        handleInputChange,
        validateForm,
        resetForm,
        prepareSubmitData,
        setIsSubmitting,
        setErrors
    };
};
