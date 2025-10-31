import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";
const newsSchema = yup.object().shape({
    idDanhMuc: yup
        .string()
        .required("Danh mục tin tức là bắt buộc"),
    tieuDe: yup
        .string()
        .required("Tiêu đề là bắt buộc"),
    noiDung: yup
        .string()
        .required("Nội dung là bắt buộc"),
    trangThai: yup
        .string()
        .required("Trạng thái là bắt buộc"),
    file: yup
        .mixed()
        .test('fileSize', 'Kích thước file quá lớn', (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024; // 5MB
        })
        .test('fileType', 'Định dạng file không hợp lệ', (value) => {
            if (!value) return true;
            const allowedTypes = ['image/jpeg', 'image/png'];
            return allowedTypes.includes(value.type);
        })
});

export async function validateNewsForm(data) {
    const result = await validateSchema(newsSchema, data);
    return { isValid: result.valid, errors: result.errors };
}