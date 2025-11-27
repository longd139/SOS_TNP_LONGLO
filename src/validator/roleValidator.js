import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const createRoleSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên vai trò là bắt buộc")
        .test('trim', 'Tên vai trò là bắt buộc', value => value && value.trim().length > 0)
        .min(2, "Tên vai trò phải có ít nhất 2 ký tự")
        .max(100, "Tên vai trò không được vượt quá 100 ký tự"),
    description: yup
        .string()
        .nullable()
        .max(255, "Mô tả không được vượt quá 255 ký tự")
        .transform((value) => value || null),
    permissionCodes: yup
        .array()
        .of(yup.string())
        .required("Phải chọn ít nhất một quyền")
        .min(1, "Phải chọn ít nhất một quyền")
});

export const updateRoleSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên vai trò là bắt buộc")
        .test('trim', 'Tên vai trò là bắt buộc', value => value && value.trim().length > 0)
        .min(2, "Tên vai trò phải có ít nhất 2 ký tự")
        .max(100, "Tên vai trò không được vượt quá 100 ký tự"),
    description: yup
        .string()
        .nullable()
        .max(255, "Mô tả không được vượt quá 255 ký tự")
        .transform((value) => value || null),
    permissionCodes: yup
        .array()
        .of(yup.string())
        .required("Phải chọn ít nhất một quyền")
        .min(1, "Phải chọn ít nhất một quyền")
});

export async function validateCreateRole(data) {
    const result = await validateSchema(createRoleSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateRole(data) {
    const result = await validateSchema(updateRoleSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateRoleForm(roleData, isEditMode = false) {
    const schema = isEditMode ? updateRoleSchema : createRoleSchema;
    const result = await validateSchema(schema, roleData);
    return { isValid: result.valid, errors: result.errors };
}

