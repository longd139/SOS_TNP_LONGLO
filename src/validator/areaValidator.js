import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

const categorySchema = yup.object().shape({
    tenLinhVuc: yup
        .string()
        .required("Tên lĩnh vực là bắt buộc")
        .test('trim', 'Tên lĩnh vực là bắt buộc', value => value && value.trim().length > 0)
        .max(255,'Tên lĩnh vực không được vượt quá 255 ký tự'),
    moTa: yup
        .string()
        .nullable()
        .transform((value) => value === '' ? null : value)
});

export async function validateAreaForm(data) {
    const result = await validateSchema(categorySchema, data);
    return { isValid: result.valid, errors: result.errors };
}