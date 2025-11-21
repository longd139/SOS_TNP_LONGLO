import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

const baseNewsFields = {
    idDanhMuc: yup
        .string()
        .required("Danh mục tin tức là bắt buộc"),
    tieuDe: yup
        .string()
        .required("Tiêu đề là bắt buộc")
        .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
        .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
    noiDung: yup
        .string()
        .required("Nội dung là bắt buộc")
        .test('notEmpty', 'Nội dung không được để trống', (value) => {
            if (!value) return false;
            const strippedValue = value.replace(/<[^>]*>/g, '').trim();
            return strippedValue.length > 0 && strippedValue !== '';
        })
};

const createNewsSchema = yup.object().shape({
    ...baseNewsFields,
    file: yup
        .mixed()
        .required('Vui lòng chọn ảnh đại diện')
        .test('fileSize', 'Kích thước file không được vượt quá 5MB', (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024; 
        })
        .test('fileType', 'Chỉ chấp nhận file PNG, JPG', (value) => {
            if (!value) return true;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            return allowedTypes.includes(value.type);
        })
});

const editNewsSchema = yup.object().shape({
    ...baseNewsFields,
    file: yup
        .mixed()
        .nullable()
        .test('fileRequired', 'Vui lòng chọn ảnh đại diện', function(value) {
            const existingImg = this.options.context?.hasExistingImage;
            if (existingImg) return true;
            return !!value;
        })
        .test('fileSize', 'Kích thước file không được vượt quá 5MB', (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024; 
        })
        .test('fileType', 'Chỉ chấp nhận file PNG, JPG', (value) => {
            if (!value) return true;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            return allowedTypes.includes(value.type);
        })
});

export async function validateNewsForm(data, isEditMode = false, hasExistingImage = false) {
    const schema = isEditMode ? editNewsSchema : createNewsSchema;
    const context = isEditMode ? { hasExistingImage } : undefined;
    const result = await validateSchema(schema, data, { context });
    return { isValid: result.valid, errors: result.errors };
}