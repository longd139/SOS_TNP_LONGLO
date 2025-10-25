import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const authSchema = yup.object().shape({
    tenDangNhap: yup
        .string()
        .required("Tên đăng nhập là bắt buộc"),
    matKhau: yup
        .string()
        .required("Mật khẩu là bắt buộc"),
})

export async function validateAuth(data) {
    return await validateSchema(authSchema, data);
}