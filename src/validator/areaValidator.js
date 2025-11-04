import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

const categorySchema = yup.object().shape({
    ten_linh_vuc: yup
        .string()
        .required("Tên lĩnh vực là bắt buộc"),
    mo_ta: yup
        .string()
        .nullable()
});

export async function validateAreaForm(data) {
    const result = await validateSchema(categorySchema, data);
    return { isValid: result.valid, errors: result.errors };
}