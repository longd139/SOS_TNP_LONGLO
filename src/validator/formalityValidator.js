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
        .nullable()
        .test('max-length', 'Hình thức áp dụng không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    mo_ta_chi_tiet: yup
        .string()
        .nullable(),
    thoi_gian_giai_quyet: yup
        .string()
        .nullable(),
    le_phi: yup
        .mixed()
        .nullable()
        .test('is-valid-number', 'Lệ phí phải là số hợp lệ', function (value) {
            if (!value && value !== 0) return false;
            const cleanedValue = String(value).replace(/,/g, '.').replace(/\s/g, '');
            const numValue = parseFloat(cleanedValue);
            return !isNaN(numValue) && numValue >= 0;
        })
        .test('max-length', 'Lệ phí không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return String(value).length <= 230;
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

const thanhPhanHoSoSchema = yup.object().shape({
    ten_thanh_phan: yup
        .string()
        .nullable()
        .test('max-length', 'Tên thành phần không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    mo_ta_chi_tiet: yup
        .string()
        .nullable(),
    so_luong_ban_chinh: yup
        .number()
        .nullable()
        .min(0, "Số lượng bản chính phải lớn hơn hoặc bằng 0"),
    so_luong_ban_sao: yup
        .number()
        .nullable()
        .min(0, "Số lượng bản sao phải lớn hơn hoặc bằng 0"),
    ghi_chu: yup
        .string()
        .nullable()
});

const truongHopThuTucSchema = yup.object().shape({
    ten_truong_hop: yup
        .string()
        .nullable()
        .test('max-length', 'Tên trường hợp không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    mo_ta: yup
        .string()
        .nullable(),
    thu_tu: yup
        .number()
        .nullable(),
    thanh_phan_ho_so: yup
        .array()
        .of(thanhPhanHoSoSchema)
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
        .max(230, "Tên thủ tục không được vượt quá 230 ký tự"),
    maThuTuc: yup
        .string()
        .required("Mã thủ tục là bắt buộc")
        .min(2, "Mã thủ tục phải có ít nhất 2 ký tự")
        .max(50, "Mã thủ tục không được vượt quá 50 ký tự"),
    doiTuongThucHien: yup
        .string()
        .required("Đối tượng thực hiện là bắt buộc")
        .max(230, "Đối tượng thực hiện không được vượt quá 230 ký tự"),
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
        .required("Số quyết định là bắt buộc")
        .max(230, "Số quyết định không được vượt quá 230 ký tự"),
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
        .nullable(),
    truongHopThuTuc: yup
        .array()
        .of(truongHopThuTucSchema)
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
        .nullable(),
    hinhThucApDung: yup
        .string()
        .nullable()
        .test('max-length', 'Hình thức áp dụng không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    lePhi: yup
        .mixed()
        .nullable()
        .test('max-length', 'Lệ phí không được vượt quá 230 ký tự', function(value) {
            if (!value) return true;
            return String(value).length <= 230;
        })
        .test('is-valid-number', 'Lệ phí phải là số hợp lệ', function (value) {
            if (!value && value !== 0) return false;
            const cleanedValue = String(value).replace(/,/g, '.').replace(/\s/g, '');
            const numValue = parseFloat(cleanedValue);
            return !isNaN(numValue) && numValue >= 0;
        })
});

const trinhTuThucHienUpdateSchema = trinhTuThucHienSchema.shape({
    id: yup
        .string()
        .nullable()

});

const thanhPhanHoSoUpdateSchema = thanhPhanHoSoSchema.shape({
    id: yup
        .string()
        .nullable()
});

const truongHopThuTucUpdateSchema = truongHopThuTucSchema.shape({
    id: yup
        .string()
        .nullable(),
    thanh_phan_ho_so: yup
        .array()
        .of(thanhPhanHoSoUpdateSchema)
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
        .max(230, "Tên thủ tục không được vượt quá 230 ký tự"),
    maThuTuc: yup
        .string()
        .required("Mã thủ tục là bắt buộc")
        .min(2, "Mã thủ tục phải có ít nhất 2 ký tự")
        .max(50, "Mã thủ tục không được vượt quá 50 ký tự"),
    doiTuongThucHien: yup
        .string()
        .required("Đối tượng thực hiện là bắt buộc")
        .max(230, "Đối tượng thực hiện không được vượt quá 230 ký tự"),
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
        .required("Số quyết định là bắt buộc")
        .max(230, "Số quyết định không được vượt quá 230 ký tự"),
    isActive: yup
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
        .max(230, "Cách thức thực hiện không được vượt quá 230 ký tự")
        .nullable(),
    trinhTuThucHien: yup
        .array()
        .of(trinhTuThucHienUpdateSchema)
        .nullable(),
    truongHopThuTuc: yup
        .array()
        .of(truongHopThuTucUpdateSchema)
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
