import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const contactSchema = yup.object().shape({
    tenDonVi: yup
        .string()
        .required("Tên đơn vị không được để trống")
        .max(255, "Tên đơn vị không được vượt quá 255 ký tự")
        .test('trim', 'Tên đơn vị không được để trống', value => value && value.trim().length > 0),
    diaChi: yup
        .string()
        .required("Địa chỉ không được để trống")
        .test('trim', 'Địa chỉ không được để trống', value => value && value.trim().length > 0)
        .max(255, "Địa chỉ không được vượt quá 255 ký tự"),
    soDienThoai: yup
        .string()
        .required("Số điện thoại không được để trống")
        .test('trim', 'Số điện thoại không được để trống', value => value && value.trim().length > 0)
        .matches(
            /^(\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/,
            "Số điện thoại không hợp lệ"
        ),
    email: yup
        .string()
        .required("Email không được để trống")
        .test('trim', 'Email không được để trống', value => value && value.trim().length > 0)
        .email("Email không hợp lệ"),
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
                .max(500, "Ghi chú không được vượt quá 500 ký tự")
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
        .required("Link Google Map không được để trống")
        .test('trim', 'Link Google Map không được để trống', value => value && value.trim().length > 0)
        .max(255, "Link Google Map không được vượt quá 255 ký tự")
        .url("Link Google Map phải là một URL hợp lệ"),
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
