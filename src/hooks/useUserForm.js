import { useState, useEffect, useCallback } from 'react';
import { ROLE } from '../constants/role';
import { validateUserForm } from '../validator/userValidator';

const INITIAL_FORM_STATE = {
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: ROLE.NHAN_VIEN,
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
                    role: initialUser.role || ROLE.NHAN_VIEN,
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
            return result.isValid;
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }, [formData, isEditMode]);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setIsSubmitting(false);
    }, []);

    const prepareSubmitData = useCallback(() => {
        const submitData = { ...formData };

        if (isEditMode) {
            delete submitData.username;
            delete submitData.email;
            delete submitData.password;
            delete submitData.confirmPassword;
        } else {
            delete submitData.fullName;
            delete submitData.phone;
            delete submitData.active;
            delete submitData.confirmPassword;
        }

        if (submitData.phone) {
            submitData.phone = submitData.phone.trim();
        }

        return submitData;
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
