import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";
const categorySchema = yup.object().shape({
    tenDanhMuc: yup
        .string()
        .required("Tên danh mục là bắt buộc"),
});

export async function validateCategoryForm(data) {
    const result = await validateSchema(categorySchema, data);
    return { isValid: result.valid, errors: result.errors };
}