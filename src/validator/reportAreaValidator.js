import * as yup from 'yup';
import { validateSchema } from '../utils/validationUtils';

const reportAreaSchema = yup.object().shape({
    ten: yup
        .string()
        .required('Tên lĩnh vực là bắt buộc')
        .min(2, 'Tên lĩnh vực phải có ít nhất 2 ký tự')
        .max(255, 'Tên lĩnh vực không được vượt quá 255 ký tự')
        .trim(),
    moTa: yup
        .string()
        .max(1000, 'Mô tả không được vượt quá 1000 ký tự')
        .nullable()
        .transform((value) => value || null)
});

export const validateReportArea = async (data) => {
    const result = await validateSchema(reportAreaSchema, data);
        return { isValid: result.valid, errors: result.errors };
};
