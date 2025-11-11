import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

export const createWorkScheduleSchema = yup.object().shape({
    diaDiem: yup.string().required("Địa điểm không được để trống"),
    tenCanBo: yup.string().required("Tên cán bộ không được để trống"),
    ngayTiepDan: yup.date().required("Ngày tiếp dân không được để trống"),
    batDau: yup.string().required("Giờ bắt đầu không được để trống"),
    ketThuc: yup.string().required("Giờ kết thúc không được để trống"),
});

export async function validateCreateWorkScheduleForm(data) {
    const result = await validateSchema(createWorkScheduleSchema, data);
    return { isValid: result.valid, errors: result.errors };
}