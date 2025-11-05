import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

const governmentSchema = yup.object().shape({
    tenCoSo: yup
        .string()
        .required("Tên cơ sở là bắt buộc"),
    diaChi: yup
        .string()
        .required("Địa chỉ là bắt buộc"),
    soDienThoai: yup
        .string()
        .required("Số điện thoại là bắt buộc")
        .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
        .test('starts-with-zero', 'Số điện thoại phải bắt đầu bằng số 0', function(value) {
            if (!value) return true;
            return value.startsWith('0');
        }),
    moTa: yup
        .string()
        .nullable()
        .transform((value) => value === '' ? null : value),
    linkGoogleMap: yup
        .string()
        .required("Link Google Map là bắt buộc")
        .test('is-url', 'Link Google Map không hợp lệ', (value) => {
            if (!value) return false;
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        })
});

export async function validateGovernmentForm(data) {
    const result = await validateSchema(governmentSchema, data);
    return { isValid: result.valid, errors: result.errors };
}