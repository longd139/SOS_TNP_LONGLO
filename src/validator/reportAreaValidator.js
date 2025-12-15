import * as yup from 'yup';
import { validateSchema } from '../utils/validationUtils';

const reportAreaSchema = yup.object().shape({
    ten: yup
        .string()
        .required('Tên lĩnh vực là bắt buộc')
        .test('trim', 'Tên lĩnh vực là bắt buộc', value => value && value.trim().length > 0)
        .min(2, 'Tên lĩnh vực phải có ít nhất 2 ký tự')
        .max(255,'Tên lĩnh vực phản ánh không được vượt quá 255 ký tự')
        .trim(),
    moTa: yup
        .string()
        .nullable()
        .transform((value) => value || null)
});

export const validateReportArea = async (data) => {
    const result = await validateSchema(reportAreaSchema, data);
        return { isValid: result.valid, errors: result.errors };
};
