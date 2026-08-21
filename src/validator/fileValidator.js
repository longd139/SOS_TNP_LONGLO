import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

const ALLOWED_IMPORT_TYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
    "application/vnd.ms-excel",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; 

export const fileImportSchema = yup.object().shape({
    file: yup
        .mixed()
        .required("Vui lòng chọn file để import")
        .test("fileSize", "File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.", (value) => {
            if (!value) return false;
            return value.size <= MAX_FILE_SIZE;
        })
        .test("fileType", "Định dạng file không hỗ trợ. Vui lòng chọn file .xlsx hoặc .xls", (value) => {
            if (!value) return false;
            const fileName = String(value.name || "").toLowerCase();
            const hasExcelExtension = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
            return hasExcelExtension && ALLOWED_IMPORT_TYPES.includes(value.type);
        }),
});

export async function validateFileImport(data) {
    return await validateSchema(fileImportSchema, data);
}

export { ALLOWED_IMPORT_TYPES, MAX_FILE_SIZE };
