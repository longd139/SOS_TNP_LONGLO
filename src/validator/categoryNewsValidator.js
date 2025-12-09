import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";
const categorySchema = yup.object().shape({
  tenDanhMuc: yup
    .string()
    .required("Tên danh mục là bắt buộc")
    .test('trim', 'Tên danh mục là bắt buộc', value => value && value.trim().length > 0)
    .max(255, "Tên danh mục không được vượt quá 255 ký tự"),
  moTa: yup
    .string()
    .nullable()
    .transform((value) => value || null)
});

export async function validateCategoryForm(data) {
  const result = await validateSchema(categorySchema, data);
  return { isValid: result.valid, errors: result.errors };
}