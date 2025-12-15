import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const otpSchema = yup.object().shape({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .matches(/^\d+$/, "Mã OTP phải là chữ số")
        .length(6, "Mã OTP phải là 6 chữ số"),
});

export async function validateOtp(data) {
    return await validateSchema(otpSchema, data);
}
