import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

const mauDonSchema = yup.object().shape({
    id: yup
        .string()
        .required("Mã định danh mẫu đơn là bắt buộc"),
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
        .required("Ghi chú là bắt buộc")
});

const cachThucHienSchema = yup.object().shape({
    hinh_thuc_ap_dung: yup
        .string()
        .required("Hình thức áp dụng là bắt buộc"),
    mo_ta_chi_tiet: yup
        .string()
        .required("Mô tả chi tiết là bắt buộc"),
    thoi_gian_giai_quyet: yup
        .string()
        .required("Thời gian giải quyết là bắt buộc"),
    le_phi: yup
        .number()
        .required("Lệ phí là bắt buộc")
        .min(0, "Lệ phí phải lớn hơn hoặc bằng 0"),
    ghi_chu_le_phi: yup
        .string()
        .nullable()
});

const trinhTuThucHienSchema = yup.object().shape({
    ten_buoc: yup
        .string()
        .required("Tên bước là bắt buộc"),
    mo_ta_buoc: yup
        .string()
        .required("Mô tả bước là bắt buộc"),
    thu_tu_buoc: yup
        .number()
        .required("Thứ tự bước là bắt buộc")
        .min(1, "Thứ tự bước phải lớn hơn hoặc bằng 1")
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
        .nullable(),
    danhSachLinhVucIds: yup
        .array()
        .of(yup.string())
        .min(1, "Phải chọn ít nhất một lĩnh vực")
        .required("Danh sách lĩnh vực là bắt buộc"),
    danhSachMauDon: yup
        .array()
        .of(mauDonSchema)
        .min(1, "Phải có ít nhất một mẫu đơn")
        .required("Danh sách mẫu đơn là bắt buộc"),
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
        .min(1, "Phải có ít nhất một mẫu đơn")
        .required("Danh sách mẫu đơn là bắt buộc"),
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
    console.log('validateFormalityForm called with:', { formalityData, isEditMode });

    const schema = isEditMode ? updateFormalitySchema : createFormalitySchema;

    console.log('Schema selected:', isEditMode ? 'update' : 'create');

    const result = await validateSchema(schema, formalityData);
    console.log('Validation result:', result);

    return { isValid: result.valid, errors: result.errors };
}
