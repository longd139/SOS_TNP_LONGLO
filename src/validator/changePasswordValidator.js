import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const changePasswordSchema = yup.object().shape({
    matKhauHienTai: yup
        .string()
        .required("Vui lòng nhập mật khẩu cũ"),
    
    matKhauMoi: yup
        .string()
        .required("Vui lòng nhập mật khẩu mới")
        .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
        .test(
            'different-from-current',
            'Mật khẩu mới phải khác mật khẩu cũ',
            function(value) {
                const { matKhauHienTai } = this.parent;
                return !matKhauHienTai || !value || value !== matKhauHienTai;
            }
        ),
    
    confirmMatKhauMoi: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu mới")
        .oneOf([yup.ref('matKhauMoi'), null], "Mật khẩu xác nhận không khớp"),
});

export async function validateChangePassword(data) {
    return await validateSchema(changePasswordSchema, data);
}
