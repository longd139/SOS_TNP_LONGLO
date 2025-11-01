import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";
import { STATUS_NEWS } from "../constants/status";

const newsSchema = yup.object().shape({
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
        }),
    trangThai: yup
        .string()
        .required("Trạng thái là bắt buộc")
        .oneOf([STATUS_NEWS.DRAFT, STATUS_NEWS.PUBLISHED], "Trạng thái không hợp lệ"),
    file: yup
        .mixed()
        .test('fileRequired', 'Vui lòng chọn ảnh đại diện', (value) => {
            if (value === 'existing') return true;
            return !!value;
        })
        .test('fileSize', 'Kích thước file không được vượt quá 5MB', (value) => {
            if (!value || value === 'existing') return true;
            return value.size <= 5 * 1024 * 1024; 
        })
        .test('fileType', 'Chỉ chấp nhận file PNG, JPG', (value) => {
            if (!value || value === 'existing') return true;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            return allowedTypes.includes(value.type);
        })
});

export async function validateNewsForm(data) {
    const result = await validateSchema(newsSchema, data);
    return { isValid: result.valid, errors: result.errors };
}