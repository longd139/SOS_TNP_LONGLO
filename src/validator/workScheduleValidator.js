import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

export const createWorkScheduleSchema = yup.object().shape({
    diaDiem: yup
        .string()
        .required("Địa điểm không được để trống"),
    tenCanBo: yup
        .string()
        .required("Tên cán bộ không được để trống"),
    ngayTiepDan: yup
        .date()
        .required("Ngày tiếp dân không được để trống"),
    batDau: yup
        .string()
        .required("Giờ bắt đầu không được để trống")
        .test('validTime', 'Giờ bắt đầu không hợp lệ', (value) => {
            if (!value) return false;
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            return timeRegex.test(value);
        })
        .test('startBeforeEnd', 'Giờ bắt đầu phải trước giờ kết thúc', function (value) {
            const { ketThuc } = this.parent;
            if (!value || !ketThuc) return true; 
            return value < ketThuc;
        }),
    ketThuc: yup
        .string()
        .required("Giờ kết thúc không được để trống")
        .test('validTime', 'Giờ kết thúc không hợp lệ', (value) => {
            if (!value) return false;
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            return timeRegex.test(value);
        })
        .test('endAfterStart', 'Giờ kết thúc phải sau giờ bắt đầu', function (value) {
            const { batDau } = this.parent;
            if (!value || !batDau) return true; 
            return value > batDau;
        }),
});

export async function validateCreateWorkScheduleForm(data) {
    const result = await validateSchema(createWorkScheduleSchema, data);
    return { isValid: result.valid, errors: result.errors };
}