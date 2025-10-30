import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

const governmentSchema = yup.object().shape({
    idUyBan: yup
        .string()
        .required("Mã cơ quan/ủy ban là bắt buộc"),
    tenCoSo: yup
        .string()
        .required("Tên cơ sở là bắt buộc"),
    diaChi: yup
        .string()
        .required("Địa chỉ là bắt buộc"),
    soDienThoai: yup
        .string()
        .required("Số điện thoại là bắt buộc"),
    moTa: yup
        .string()
        .nullable(),
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