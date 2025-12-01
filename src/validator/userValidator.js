import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

const vietnamesePhoneRegex = /^(\+84|84|0)?([3578])[0-9]{8}$|^(\+84|84|0)?([2-9])[0-9]{7,9}$/;

const usernameRegex = /^[a-zA-Z0-9_.]+$/;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const createUserSchema = yup.object().shape({
    username: yup
        .string()
        .required("Tên đăng nhập là bắt buộc")
        .test('trim', 'Tên đăng nhập là bắt buộc', value => value && value.trim().length > 0)
        .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
        .matches(usernameRegex, "Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới và dấu chấm"),
    email: yup
        .string()
        .required("Email là bắt buộc")
        .test('trim', 'Email là bắt buộc', value => value && value.trim().length > 0)
        .matches(emailRegex, "Email không hợp lệ"),
    role: yup
        .string()
        .required("Vai trò là bắt buộc")
        .test('trim', 'Vai trò là bắt buộc', value => value && value.trim().length > 0),

    password: yup
        .string()
        .required("Mật khẩu là bắt buộc")
        .test('trim', 'Mật khẩu là bắt buộc', value => value && value.trim().length > 0)
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
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
        .test('trim', 'Họ và tên là bắt buộc', value => value && value.trim().length > 0),

    role: yup
        .string()
        .required("Vai trò là bắt buộc")
        .test('trim', 'Vai trò là bắt buộc', value => value && value.trim().length > 0),

    password: yup
        .string()
        .notRequired()
        .test('password-length', 'Mật khẩu phải có ít nhất 8 ký tự', function(value) {
            if (!value || value.trim() === '') return true;
            return value.length >= 8;
        }),
    confirmPassword: yup
        .string()
        .notRequired()
        .test('passwords-match', 'Mật khẩu xác nhận không khớp', function(value) {
            const { password } = this.parent;
            if (!password || password.trim() === '') return true;
            return value === password;
        }),

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

export const updateUserWithPhoneSchema = yup.object().shape({
    fullName: yup
        .string()
        .required("Họ và tên là bắt buộc")
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .test('trim', 'Họ và tên là bắt buộc', value => value && value.trim().length > 0),

    role: yup
        .string()
        .required("Vai trò là bắt buộc")
        .test('trim', 'Vai trò là bắt buộc', value => value && value.trim().length > 0),

    password: yup
        .string()
        .notRequired()
        .test('password-length', 'Mật khẩu phải có ít nhất 8 ký tự', function(value) {
            if (!value || value.trim() === '') return true;
            return value.length >= 8;
        }),
    confirmPassword: yup
        .string()
        .notRequired()
        .test('passwords-match', 'Mật khẩu xác nhận không khớp', function(value) {
            const { password } = this.parent;
            if (!password || password.trim() === '') return true;
            return value === password;
        }),

    phone: yup
        .string()
        .nullable()
        .notRequired()
        .test('phone-format', 'Số điện thoại không hợp lệ', function (value) {
            if (!value || value.trim() === '') return true;
            const cleanPhone = value.replace(/[\s\-()]/g, '');
            return vietnamesePhoneRegex.test(cleanPhone);
        }),

    active: yup
        .boolean()
        .default(true)
});

export const changePasswordSchema = yup.object().shape({
    matKhauHienTai: yup
        .string()
        .required("Mật khẩu hiện tại là bắt buộc")
        .test('trim', 'Mật khẩu hiện tại là bắt buộc', value => value && value.trim().length > 0),

    matKhauMoi: yup
        .string()
        .required("Mật khẩu mới là bắt buộc")
        .test('trim', 'Mật khẩu mới là bắt buộc', value => value && value.trim().length > 0)
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .notOneOf([yup.ref('matKhauHienTai')], "Mật khẩu mới phải khác mật khẩu hiện tại"),

    confirmMatKhauMoi: yup
        .string()
        .required("Xác nhận mật khẩu mới là bắt buộc")
        .oneOf([yup.ref('matKhauMoi')], "Xác nhận mật khẩu không khớp")
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
    
    let schema;

    if (isEditMode) {
        schema = includePhone ? updateUserWithPhoneSchema : updateUserSchema;
    } else {
        schema = includePhone ? createUserWithPhoneSchema : createUserSchema;
    }
    
    const result = await validateSchema(schema, userData);
        
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