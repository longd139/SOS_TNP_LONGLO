
export const validatePhoneNumber = (phone) => {
    if (!phone) return true; // Phone is optional
    
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    
    const vietnamesePhoneRegex = /^(\+84|84|0)?([3578])[0-9]{8}$|^(\+84|84|0)?([2-9])[0-9]{7,9}$/;
    
    return vietnamesePhoneRegex.test(cleanPhone);
};

export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
        return `${cleanPhone.substring(0, 4)} ${cleanPhone.substring(4, 7)} ${cleanPhone.substring(7)}`;
    }
    
    if (cleanPhone.startsWith('+84') && cleanPhone.length === 12) {
        return `+84 ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6, 9)} ${cleanPhone.substring(9)}`;
    }
    
    return cleanPhone;
};

export const validateEmail = (email) => {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateUsername = (username) => {
    if (!username) {
        return { isValid: false, message: 'Tên đăng nhập là bắt buộc' };
    }
    
    if (username.length < 3) {
        return { isValid: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' };
    }
    
    if (username.length > 50) {
        return { isValid: false, message: 'Tên đăng nhập không được vượt quá 50 ký tự' };
    }
    
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, message: 'Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới và dấu chấm' };
    }
    
    return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Mật khẩu là bắt buộc', strength: 'weak' };
    }
    
    if (password.length < 8) {
        return { isValid: false, message: 'Mật khẩu phải có ít nhất 8 ký tự', strength: 'weak' };
    }
    
    if (password.length > 100) {
        return { isValid: false, message: 'Mật khẩu không được vượt quá 100 ký tự', strength: 'weak' };
    }
    
    let strength = 'weak';
    let strengthScore = 0;
    
    if (password.length >= 12) strengthScore += 1;
    
    if (/[a-z]/.test(password)) strengthScore += 1; 
    if (/[A-Z]/.test(password)) strengthScore += 1; 
    if (/[0-9]/.test(password)) strengthScore += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strengthScore += 1; 
    
    if (strengthScore >= 4) strength = 'strong';
    else if (strengthScore >= 2) strength = 'medium';
    
    return { 
        isValid: true, 
        message: '', 
        strength,
        score: strengthScore
    };
};

export const validateFullName = (fullName) => {
    if (!fullName || !fullName.trim()) {
        return { isValid: false, message: 'Họ và tên là bắt buộc' };
    }
    
    if (fullName.trim().length < 2) {
        return { isValid: false, message: 'Họ và tên phải có ít nhất 2 ký tự' };
    }
    
    if (fullName.length > 100) {
        return { isValid: false, message: 'Họ và tên không được vượt quá 100 ký tự' };
    }
    
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẰẮẲẴẶĂẤẦẨẪẬẤẦẨêẬÉÈẺẼẸÉÈẺẼẸÊÊỀẾỂỄỆÊÊỀẾỂỄỆÍÌỈĨỊÍÌỈĨỊÓÒỎÕỌÓÒỎÕỌÔỒỐỔỖỘÔỒỐỔỖỘƠỜỚỞỠỢƠỜỚỞỠỢÚÙỦŨỤÚÙỦŨỤƯỪỨỬỮỰƯỪỨỬỮỰÝỲỶỸỴÝỲỶỸỴ\s.'-]+$/;
    
    if (!nameRegex.test(fullName.trim())) {
        return { isValid: false, message: 'Họ và tên chứa ký tự không hợp lệ' };
    }
    
    return { isValid: true, message: '' };
};

export const validateRole = (role, availableRoles = []) => {
    if (!role) {
        return { isValid: false, message: 'Vai trò là bắt buộc' };
    }
    
    if (availableRoles.length > 0 && !availableRoles.includes(role)) {
        return { isValid: false, message: 'Vai trò không hợp lệ' };
    }
    
    return { isValid: true, message: '' };
};

export const validateUserForm = (userData, isEditMode = false, availableRoles = []) => {
    const errors = {};
    
    if (!isEditMode) {
        const usernameValidation = validateUsername(userData.username);
        if (!usernameValidation.isValid) {
            errors.username = usernameValidation.message;
        }
    }
    
    const fullNameValidation = validateFullName(userData.fullName);
    if (!fullNameValidation.isValid) {
        errors.fullName = fullNameValidation.message;
    }
    
    if (!validateEmail(userData.email)) {
        errors.email = 'Email không hợp lệ';
    }
    
    if (userData.phone && !validatePhoneNumber(userData.phone)) {
        errors.phone = 'Số điện thoại không hợp lệ';
    }
    
    const roleValidation = validateRole(userData.role, availableRoles);
    if (!roleValidation.isValid) {
        errors.role = roleValidation.message;
    }
    
    if (!isEditMode || userData.password) {
        const passwordValidation = validatePassword(userData.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.message;
        }
        
        if (userData.password !== userData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};