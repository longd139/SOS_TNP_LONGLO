import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

const mauDonSchema = yup.object().shape({
    id: yup
        .string()
        .nullable(),
    so_luong_ban_chinh: yup
        .number()
        .required("Số lượng bản chính là bắt buộc")
        .min(0, "Số lượng bản chính phải lớn hơn hoặc bằng 0"),
    so_luong_ban_sao: yup
        .number()
        .required("Số lượng bản sao là bắt buộc")
        .min(0, "Số lượng bản sao phải lớn hơn hoặc bằng 0"),
    ghi_chu: yup
        .string()
        .nullable()
});

const cachThucHienSchema = yup.object().shape({
    hinh_thuc_ap_dung: yup
        .string()
        .nullable(),
    mo_ta_chi_tiet: yup
        .string()
        .nullable(),
    thoi_gian_giai_quyet: yup
        .string()
        .nullable(),
    le_phi: yup
        .mixed()
        .nullable()
        .test('is-valid-number', 'Lệ phí phải là số hợp lệ', function(value) {
            if (!value && value !== 0) return false;
            const cleanedValue = String(value).replace(/,/g, '.').replace(/\s/g, '');
            const numValue = parseFloat(cleanedValue);
            return !isNaN(numValue) && numValue >= 0;
        }),
    ghi_chu_le_phi: yup
        .string()
        .nullable()
});

const trinhTuThucHienSchema = yup.object().shape({
    ten_buoc: yup
        .string()
        .nullable(),
    mo_ta_buoc: yup
        .string()
        .nullable(),
    thu_tu_buoc: yup
        .number()
        .nullable()
});

export const createFormalitySchema = yup.object().shape({
    idCoSoDichVuCong: yup
        .string()
        .required("Mã cơ sở dịch vụ công là bắt buộc"),
    tenThuTuc: yup
        .string()
        .required("Tên thủ tục là bắt buộc")
        .min(3, "Tên thủ tục phải có ít nhất 3 ký tự")
        .max(500, "Tên thủ tục không được vượt quá 500 ký tự"),
    maThuTuc: yup
        .string()
        .required("Mã thủ tục là bắt buộc")
        .min(2, "Mã thủ tục phải có ít nhất 2 ký tự")
        .max(100, "Mã thủ tục không được vượt quá 100 ký tự"),
    doiTuongThucHien: yup
        .string()
        .required("Đối tượng thực hiện là bắt buộc"),
    // url_pdf: yup
    //     .string()
    //     .nullable()
    //     .notRequired()
    //     .transform((value) => value === '' ? null : value)
    //     .test('url-format', 'URL PDF không hợp lệ', function (value) {
    //         if (!value) return true; 
    //         try {
    //             new URL(value);
    //             return true;
    //         } catch {
    //             return false;
    //         }
    //     }),
    yeuCauDieuKienChung: yup
        .string()
        .nullable(),
    soQuyetDinh: yup
        .string()
        .required("Số quyết định là bắt buộc"),
    danhSachLinhVucIds: yup
        .array()
        .of(yup.string())
        .min(1, "Phải chọn ít nhất một lĩnh vực")
        .required("Danh sách lĩnh vực là bắt buộc"),
    danhSachMauDon: yup
        .array()
        .of(mauDonSchema)
        .nullable(),
    cachThuThucHien: yup
        .array()
        .of(cachThucHienSchema)
        .nullable(),
    trinhTuThucHien: yup
        .array()
        .of(trinhTuThucHienSchema)
        .nullable()
});

const mauDonUpdateSchema = mauDonSchema.shape({
    id: yup
        .string()
        .nullable()
});

const cachThucHienUpdateSchema = cachThucHienSchema.shape({
    id: yup
        .string()
        .nullable()
});

const trinhTuThucHienUpdateSchema = trinhTuThucHienSchema.shape({
    id: yup
        .string()
        .nullable()
});

export const updateFormalitySchema = yup.object().shape({
    idCoSoDichVuCong: yup
        .string()
        .required("Mã cơ sở dịch vụ công là bắt buộc"),
    tenThuTuc: yup
        .string()
        .required("Tên thủ tục là bắt buộc")
        .min(3, "Tên thủ tục phải có ít nhất 3 ký tự")
        .max(500, "Tên thủ tục không được vượt quá 500 ký tự"),
    maThuTuc: yup
        .string()
        .required("Mã thủ tục là bắt buộc")
        .min(2, "Mã thủ tục phải có ít nhất 2 ký tự")
        .max(100, "Mã thủ tục không được vượt quá 100 ký tự"),
    doiTuongThucHien: yup
        .string()
        .required("Đối tượng thực hiện là bắt buộc"),
    // url_pdf: yup
    //     .string()
    //     .nullable()
    //     .notRequired()
    //     .transform((value) => value === '' ? null : value)
    //     .test('url-format', 'URL PDF không hợp lệ', function (value) {
    //         if (!value) return true;
    //         try {
    //             new URL(value);
    //             return true;
    //         } catch {
    //             return false;
    //         }
    //     }),
    yeuCauDieuKienChung: yup
        .string()
        .nullable(),
    soQuyetDinh: yup
        .string()
        .nullable(),
    isRemoved: yup
        .boolean()
        .nullable(),
    danhSachLinhVucIds: yup
        .array()
        .of(yup.string())
        .min(1, "Phải chọn ít nhất một lĩnh vực")
        .required("Danh sách lĩnh vực là bắt buộc"),
    danhSachMauDon: yup
        .array()
        .of(mauDonUpdateSchema)
        .nullable(),
    cachThuThucHien: yup
        .array()
        .of(cachThucHienUpdateSchema)
        .nullable(),
    trinhTuThucHien: yup
        .array()
        .of(trinhTuThucHienUpdateSchema)
        .nullable()
});

export async function validateCreateFormality(data) {
    const result = await validateSchema(createFormalitySchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateFormality(data) {
    const result = await validateSchema(updateFormalitySchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateFormalityForm(formalityData, isEditMode = false) {

    const schema = isEditMode ? updateFormalitySchema : createFormalitySchema;

    const result = await validateSchema(schema, formalityData);
    
    return { isValid: result.valid, errors: result.errors };
}
