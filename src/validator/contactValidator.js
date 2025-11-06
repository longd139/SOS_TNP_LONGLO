import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const contactSchema = yup.object().shape({
    tenDonVi: yup
        .string()
        .required("Tên đơn vị không được để trống"),

    diaChi: yup
        .string()
        .required("Địa chỉ không được để trống"),

    soDienThoai: yup
        .string()
        .required("Số điện thoại không được để trống"),

    email: yup
        .string()
        .required("Email không được để trống"),

    gioLamViec: yup
        .object()
        .shape({
            buoi_sang: yup.object().shape({
                tu: yup
                    .string()
                    .required("Giờ bắt đầu buổi sáng không được để trống")
                    .matches(
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                        "Giờ phải có định dạng HH:mm (ví dụ: 07:30)"
                    ),

                den: yup
                    .string()
                    .required("Giờ kết thúc buổi sáng không được để trống")
                    .matches(
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                        "Giờ phải có định dạng HH:mm (ví dụ: 11:30)"
                    )
                    .test(
                        "is-after-start",
                        "Giờ kết thúc buổi sáng phải sau giờ bắt đầu",
                        function (value) {
                            const { tu } = this.parent;
                            if (!tu || !value) return true;
                            const [startHour, startMin] = tu.split(":").map(Number);
                            const [endHour, endMin] = value.split(":").map(Number);
                            return endHour * 60 + endMin > startHour * 60 + startMin;
                        }
                    ),
            }),

            buoi_chieu: yup.object().shape({
                tu: yup
                    .string()
                    .required("Giờ bắt đầu buổi chiều không được để trống")
                    .matches(
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                        "Giờ phải có định dạng HH:mm (ví dụ: 13:00)"
                    ),

                den: yup
                    .string()
                    .required("Giờ kết thúc buổi chiều không được để trống")
                    .matches(
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                        "Giờ phải có định dạng HH:mm (ví dụ: 17:00)"
                    )
                    .test(
                        "is-after-start",
                        "Giờ kết thúc buổi chiều phải sau giờ bắt đầu",
                        function (value) {
                            const { tu } = this.parent;
                            if (!tu || !value) return true;
                            const [startHour, startMin] = tu.split(":").map(Number);
                            const [endHour, endMin] = value.split(":").map(Number);
                            return endHour * 60 + endMin > startHour * 60 + startMin;
                        }
                    ),
            }),

            ghi_chu: yup
                .string()
                .nullable()
                .transform((value) => (value === "" ? null : value)),
        })
        .test(
            "afternoon-after-morning",
            "Buổi chiều phải bắt đầu sau khi buổi sáng kết thúc",
            function (value) {
                if (!value?.buoi_sang?.den || !value?.buoi_chieu?.tu) return true;

                const [morningEndHour, morningEndMin] = value.buoi_sang.den
                    .split(":")
                    .map(Number);
                const [afternoonStartHour, afternoonStartMin] = value.buoi_chieu.tu
                    .split(":")
                    .map(Number);

                const morningEndTotal = morningEndHour * 60 + morningEndMin;
                const afternoonStartTotal = afternoonStartHour * 60 + afternoonStartMin;

                return afternoonStartTotal > morningEndTotal;
            }
        ),

    linkGoogleMap: yup
        .string()
        .required("Link Google Map không được để trống"),
});

export const contactUpdateSchema = contactSchema;

export async function validateContact(data) {
    const result = await validateSchema(contactSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateContact(data) {
    const result = await validateSchema(contactUpdateSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateContactForm(uyBanData, isEditMode = false) {
    const schema = isEditMode ? contactUpdateSchema : contactSchema;
    const result = await validateSchema(schema, uyBanData);
    return { isValid: result.valid, errors: result.errors };
}
