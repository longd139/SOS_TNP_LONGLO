import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const createTemplateSchema = yup.object().shape({
    tenMauDon: yup
        .string()
        .required("Tên biểu mẫu là bắt buộc")
        .min(3, "Tên biểu mẫu phải có ít nhất 3 ký tự")
        .max(500, "Tên biểu mẫu không được vượt quá 500 ký tự")
        .test('trim', 'Tên biểu mẫu là bắt buộc', value => value && value.trim().length > 0),
    
    maMauDon: yup
        .string()
        .required("Mã biểu mẫu là bắt buộc")
        .min(2, "Mã biểu mẫu phải có ít nhất 2 ký tự")
        .max(50, "Mã biểu mẫu không được vượt quá 50 ký tự")
        .test('trim', 'Mã biểu mẫu là bắt buộc', value => value && value.trim().length > 0),
    
    moTa: yup
        .string()
        .nullable()
        .max(1000, "Mô tả không được vượt quá 1000 ký tự"),
    
    file: yup
        .mixed()
        .required("Vui lòng chọn file")
        .test('fileType', 'Chỉ chấp nhận file PDF, DOC, DOCX', (value) => {
            if (!value) return false;
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            return allowedTypes.includes(value.type);
        })
        .test('fileSize', 'Kích thước file không được vượt quá 10MB', (value) => {
            if (!value) return false;
            return value.size <= 10 * 1024 * 1024;
        })
});

export const updateTemplateSchema = yup.object().shape({
    tenMauDon: yup
        .string()
        .required("Tên biểu mẫu là bắt buộc")
        .min(3, "Tên biểu mẫu phải có ít nhất 3 ký tự")
        .max(500, "Tên biểu mẫu không được vượt quá 500 ký tự")
        .test('trim', 'Tên biểu mẫu là bắt buộc', value => value && value.trim().length > 0),
    
    maMauDon: yup
        .string()
        .required("Mã biểu mẫu là bắt buộc")
        .min(2, "Mã biểu mẫu phải có ít nhất 2 ký tự")
        .max(50, "Mã biểu mẫu không được vượt quá 50 ký tự")
        .test('trim', 'Mã biểu mẫu là bắt buộc', value => value && value.trim().length > 0),
    
    moTa: yup
        .string()
        .nullable()
        .max(1000, "Mô tả không được vượt quá 1000 ký tự"),
    
    file: yup
        .mixed()
        .nullable()
        .test('fileType', 'Chỉ chấp nhận file PDF, DOC, DOCX', (value) => {
            if (!value) return true;
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            return allowedTypes.includes(value.type);
        })
        .test('fileSize', 'Kích thước file không được vượt quá 10MB', (value) => {
            if (!value) return true;
            return value.size <= 10 * 1024 * 1024;
        }),
    
    isRemoved: yup
        .boolean()
        .nullable()
});

export async function validateTemplateForm(templateData, isEditMode = false) {
    
    const schema = isEditMode ? updateTemplateSchema : createTemplateSchema;
        
    const result = await validateSchema(schema, templateData);
        
    return { isValid: result.valid, errors: result.errors };
}

export async function validateCreateTemplate(data) {
    const result = await validateSchema(createTemplateSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateTemplate(data) {
    const result = await validateSchema(updateTemplateSchema, data);
    return { isValid: result.valid, errors: result.errors };
}
