import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

const vietnamesePhoneRegex = /^(\+84|84|0)?([3578])[0-9]{8}$|^(\+84|84|0)?([2-9])[0-9]{7,9}$/;

const usernameRegex = /^[a-zA-Z0-9_.]+$/;

export const createUserSchema = yup.object().shape({
    username: yup
        .string()
        .required("Tên đăng nhập là bắt buộc")
        .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
        .max(50, "Tên đăng nhập không được vượt quá 50 ký tự")
        .matches(usernameRegex, "Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới và dấu chấm"),

    fullName: yup
        .string()
        .required("Họ và tên là bắt buộc")
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .max(100, "Họ và tên không được vượt quá 100 ký tự")
        .test('trim', 'Họ và tên là bắt buộc', value => value && value.trim().length > 0),

    email: yup
        .string()
        .required("Email là bắt buộc")
        .email("Email không hợp lệ")
        .max(100, "Email không được vượt quá 100 ký tự"),

    role: yup
        .string()
        .required("Vai trò là bắt buộc")
        .oneOf(['ADMIN', 'NHAN_VIEN', 'LANH_DAO', 'PHO_CHU_TICH', 'CHU_TICH', 'KHU_PHO'], "Vai trò không hợp lệ"),

    password: yup
        .string()
        .required("Mật khẩu là bắt buộc")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .max(100, "Mật khẩu không được vượt quá 100 ký tự"),

    confirmPassword: yup
        .string()
        .required("Xác nhận mật khẩu là bắt buộc")
        .oneOf([yup.ref('password')], "Mật khẩu xác nhận không khớp"),

    active: yup
        .boolean()
        .default(true)
});

export const updateUserSchema = yup.object().shape({
    fullName: yup
        .string()
        .required("Họ và tên là bắt buộc")
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .max(100, "Họ và tên không được vượt quá 100 ký tự")
        .test('trim', 'Họ và tên là bắt buộc', value => value && value.trim().length > 0),

    role: yup
        .string()
        .required("Vai trò là bắt buộc")
        .oneOf(['ADMIN', 'NHAN_VIEN', 'LANH_DAO', 'PHO_CHU_TICH', 'CHU_TICH', 'KHU_PHO'], "Vai trò không hợp lệ"),

    active: yup
        .boolean()
        .default(true)
});

export const createUserWithPhoneSchema = createUserSchema.shape({
    phone: yup
        .string()
        .nullable()
        .notRequired()
        .test('phone-format', 'Số điện thoại không hợp lệ', function (value) {
            if (!value || value.trim() === '') return true;
            const cleanPhone = value.replace(/[\s\-()]/g, '');
            return vietnamesePhoneRegex.test(cleanPhone);
        })
});

export const updateUserWithPhoneSchema = updateUserSchema.shape({
    phone: yup
        .string()
        .nullable()
        .notRequired()
        .test('phone-format', 'Số điện thoại không hợp lệ', function (value) {
            if (!value || value.trim() === '') return true;
            const cleanPhone = value.replace(/[\s\-()]/g, '');
            return vietnamesePhoneRegex.test(cleanPhone);
        })
});

export const changePasswordSchema = yup.object().shape({
    currentPassword: yup
        .string()
        .required("Mật khẩu hiện tại là bắt buộc"),

    newPassword: yup
        .string()
        .required("Mật khẩu mới là bắt buộc")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .max(100, "Mật khẩu không được vượt quá 100 ký tự")
        .notOneOf([yup.ref('currentPassword')], "Mật khẩu mới phải khác mật khẩu hiện tại"),

    confirmNewPassword: yup
        .string()
        .required("Xác nhận mật khẩu mới là bắt buộc")
        .oneOf([yup.ref('newPassword')], "Xác nhận mật khẩu không khớp")
});

export async function validateCreateUser(data) {
    const result = await validateSchema(createUserSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateUser(data) {
    const result = await validateSchema(updateUserSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateCreateUserWithPhone(data) {
    const result = await validateSchema(createUserWithPhoneSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateUserWithPhone(data) {
    const result = await validateSchema(updateUserWithPhoneSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateChangePassword(data) {
    const result = await validateSchema(changePasswordSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUserForm(userData, isEditMode = false, includePhone = false) {
    console.log('validateUserForm called with:', { userData, isEditMode, includePhone });
    
    let schema;

    if (isEditMode) {
        schema = includePhone ? updateUserWithPhoneSchema : updateUserSchema;
    } else {
        schema = includePhone ? createUserWithPhoneSchema : createUserSchema;
    }

    console.log('Schema selected:', isEditMode ? 'update' : 'create', 'with phone:', includePhone);
    
    const result = await validateSchema(schema, userData);
    console.log('Validation result:', result);
    
    return { isValid: result.valid, errors: result.errors };
}

export const getPasswordStrength = (password) => {
    if (!password) return { strength: 'weak', score: 0 };

    let score = 0;

    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    let strength = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    return { strength, score };
};